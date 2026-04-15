'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const ENDZONE_W = 50
const W = 700
const H = 420
const FIELD_TOP = 50
const FIELD_BOT = H - 40
const FIELD_H = FIELD_BOT - FIELD_TOP
const FIELD_LEFT = 36 + ENDZONE_W
const FIELD_RIGHT = W - 36 - ENDZONE_W
const FIELD_W = FIELD_RIGHT - FIELD_LEFT
const PLAYER_R = 8
const TICK_MS = 33 // ~30fps

type Pt = { x: number; y: number }
type Player = Pt & { vx: number; vy: number; speed: number; tackled?: boolean }
type PlayType = 'run_left' | 'run_mid' | 'run_right' | 'pass_short' | 'pass_deep'
type DefPlayType = 'rush' | 'cover' | 'blitz'
type GamePhase = 'title' | 'kickoff' | 'pick_play' | 'playing' | 'scored' | 'turnover' | 'game_over'

const PLAYS: { name: string; key: string; type: PlayType }[] = [
  { name: 'RUN LEFT', key: '1', type: 'run_left' },
  { name: 'RUN MID', key: '2', type: 'run_mid' },
  { name: 'RUN RIGHT', key: '3', type: 'run_right' },
  { name: 'SHORT PASS', key: '4', type: 'pass_short' },
  { name: 'DEEP PASS', key: '5', type: 'pass_deep' },
]

const DEF_PLAYS: { name: string; key: string; type: DefPlayType }[] = [
  { name: 'RUSH', key: '1', type: 'rush' },
  { name: 'COVER', key: '2', type: 'cover' },
  { name: 'BLITZ', key: '3', type: 'blitz' },
]

const QUARTER_TIME = 45 // seconds per quarter

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }
function dist(a: Pt, b: Pt) { return Math.hypot(a.x - b.x, a.y - b.y) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function getDefenseProfile(defPlayType: DefPlayType) {
  if (defPlayType === 'rush') {
    return {
      pressure: 0.82,
      zoneDepth: 0.78,
      sackRadius: PLAYER_R * 1.55,
      qbUrgency: 12,
      tackleBreakChance: 0.3,
    }
  }
  if (defPlayType === 'blitz') {
    return {
      pressure: 1.08,
      zoneDepth: 0.45,
      sackRadius: PLAYER_R * 1.9,
      qbUrgency: 20,
      tackleBreakChance: 0.14,
    }
  }
  return {
    pressure: 0.62,
    zoneDepth: 1,
    sackRadius: PLAYER_R * 1.2,
    qbUrgency: 0,
    tackleBreakChance: 0.24,
  }
}

function fieldXToYard(x: number): number {
  // field goes from FIELD_LEFT to FIELD_RIGHT = 100 yards
  return Math.round(((x - FIELD_LEFT) / FIELD_W) * 100)
}

function yardToFieldX(yard: number): number {
  return FIELD_LEFT + (yard / 100) * FIELD_W
}

export default function CyberBowl() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<GamePhase>('title')
  const [playerScore, setPlayerScore] = useState(0)
  const [cpuScore, setCpuScore] = useState(0)
  const [quarter, setQuarter] = useState(1)
  const [message, setMessage] = useState('')
  const [selectedPlay, setSelectedPlay] = useState(0)

  const stateRef = useRef({
    phase: 'title' as GamePhase,
    // Offense (player) state
    qb: { x: 0, y: 0, vx: 0, vy: 0, speed: 2.2 } as Player,
    runners: [] as Player[], // WRs/RBs
    ballCarrier: null as Player | null,
    ball: null as (Pt & { vx: number; vy: number; inFlight: boolean; target: Player | null }) | null,
    hasPassed: false,
    // Defense (CPU)
    defenders: [] as Player[],
    // Field state
    lineOfScrimmage: 25, // yard line (0=player endzone, 100=cpu endzone)
    down: 1,
    yardsToGo: 10,
    firstDownYard: 35,
    possession: 'player' as 'player' | 'cpu',
    // Score
    playerScore: 0,
    cpuScore: 0,
    // Clock
    quarter: 1,
    clockTime: QUARTER_TIME,
    clockRunning: false,
    // Play
    playType: 'run_mid' as PlayType,
    playActive: false,
    selectedPlay: 0,
    // Message
    message: '',
    messageTimer: 0,
    // Kick
    kickoff: false,
    kickoffState: null as 'ball_in_air' | 'returning' | null,
    // CPU offense / defense
    defPlayType: 'cover' as DefPlayType,
    cpuPlayTimer: 0,
    cpuActed: false,
    controlledDefender: null as Player | null,
  })

  const getControlledPlayer = useCallback(() => {
    const s = stateRef.current
    if (s.phase === 'playing' && s.possession === 'cpu') return s.controlledDefender
    return s.ballCarrier
  }, [])

  const setupPlay = useCallback(() => {
    const s = stateRef.current
    const losX = yardToFieldX(s.lineOfScrimmage)
    const midY = FIELD_TOP + FIELD_H / 2

    // QB behind the line
    s.qb = { x: losX - 35, y: midY, vx: 0, vy: 0, speed: 3.8, tackled: false }

    // Offensive players
    s.runners = [
      { x: losX - 14, y: midY - 50, vx: 0, vy: 0, speed: 4.2 }, // WR top
      { x: losX - 14, y: midY + 50, vx: 0, vy: 0, speed: 4.2 }, // WR bottom
      { x: losX - 24, y: midY - 16, vx: 0, vy: 0, speed: 3.4 }, // RB
      { x: losX - 10, y: midY - 8, vx: 0, vy: 0, speed: 2.0 }, // OL
      { x: losX - 10, y: midY + 8, vx: 0, vy: 0, speed: 2.0 }, // OL
    ]

    // Defenders
    s.defenders = [
      { x: losX + 14, y: midY - 42, vx: 0, vy: 0, speed: 3.0 },  // CB
      { x: losX + 14, y: midY + 42, vx: 0, vy: 0, speed: 3.0 },  // CB
      { x: losX + 7, y: midY - 14, vx: 0, vy: 0, speed: 2.7 },   // DL
      { x: losX + 7, y: midY + 14, vx: 0, vy: 0, speed: 2.7 },   // DL
      { x: losX + 35, y: midY, vx: 0, vy: 0, speed: 3.4 },       // LB
      { x: losX + 60, y: midY - 25, vx: 0, vy: 0, speed: 3.8 },  // Safety
      { x: losX + 60, y: midY + 25, vx: 0, vy: 0, speed: 3.8 },  // Safety
    ]

    s.ballCarrier = null
    s.ball = null
    s.hasPassed = false
    s.playActive = false
    s.selectedPlay = 0
    s.phase = 'pick_play'
    setPhase('pick_play')
    setSelectedPlay(0)
  }, [])

  const setupKickoff = useCallback(() => {
    const s = stateRef.current
    const midY = FIELD_TOP + FIELD_H / 2

    // Returner deep in own territory
    s.runners = [
      { x: yardToFieldX(8), y: midY, vx: 0, vy: 0, speed: 4.5 }, // returner
      { x: yardToFieldX(28), y: midY - 45, vx: 0, vy: 0, speed: 3.2 }, // blocker
      { x: yardToFieldX(28), y: midY + 45, vx: 0, vy: 0, speed: 3.2 }, // blocker
      { x: yardToFieldX(32), y: midY - 15, vx: 0, vy: 0, speed: 3.0 }, // blocker
      { x: yardToFieldX(32), y: midY + 15, vx: 0, vy: 0, speed: 3.0 }, // blocker
    ]

    // Ball kicked from CPU's 35 (yard 65)
    const kickFromX = yardToFieldX(65)
    const targetY = midY + (Math.random() - 0.5) * 30
    const dx = s.runners[0].x - kickFromX
    const dy = targetY - midY
    const d = Math.hypot(dx, dy) || 1
    const kickSpeed = 6
    s.ball = {
      x: kickFromX, y: midY,
      vx: (dx / d) * kickSpeed,
      vy: (dy / d) * kickSpeed,
      inFlight: true,
      target: s.runners[0],
    }

    // Coverage team spread across field
    s.defenders = [
      { x: yardToFieldX(62), y: midY - 70, vx: 0, vy: 0, speed: 3.2 },
      { x: yardToFieldX(62), y: midY - 35, vx: 0, vy: 0, speed: 3.0 },
      { x: yardToFieldX(62), y: midY, vx: 0, vy: 0, speed: 3.4 },
      { x: yardToFieldX(62), y: midY + 35, vx: 0, vy: 0, speed: 3.0 },
      { x: yardToFieldX(62), y: midY + 70, vx: 0, vy: 0, speed: 3.2 },
      { x: yardToFieldX(56), y: midY - 15, vx: 0, vy: 0, speed: 3.6 },
      { x: yardToFieldX(56), y: midY + 15, vx: 0, vy: 0, speed: 3.6 },
    ]

    s.qb = { x: -100, y: -100, vx: 0, vy: 0, speed: 0 } // off screen
    s.ballCarrier = null
    s.hasPassed = false
    s.playActive = true
    s.clockRunning = false
    s.kickoffState = 'ball_in_air'
    s.phase = 'kickoff'
    setPhase('kickoff')
  }, [])

  const startPlay = useCallback((playType: PlayType) => {
    const s = stateRef.current
    s.playType = playType
    s.playActive = true
    s.clockRunning = true
    s.phase = 'playing'
    setPhase('playing')

    // QB starts as ball carrier
    s.ballCarrier = s.qb

    // Set route patterns for runners based on play
    const midY = FIELD_TOP + FIELD_H / 2
    const losX = yardToFieldX(s.lineOfScrimmage)

    if (playType === 'run_left') {
      s.runners[2].vx = 3.4; s.runners[2].vy = -2.5
      s.runners[3].vx = 1.7; s.runners[3].vy = -1.7
      s.runners[4].vx = 1.7; s.runners[4].vy = -0.8
    } else if (playType === 'run_mid') {
      s.runners[2].vx = 4.2; s.runners[2].vy = 0
      s.runners[3].vx = 2.5; s.runners[3].vy = -0.5
      s.runners[4].vx = 2.5; s.runners[4].vy = 0.5
    } else if (playType === 'run_right') {
      s.runners[2].vx = 3.4; s.runners[2].vy = 2.5
      s.runners[3].vx = 1.7; s.runners[3].vy = 0.8
      s.runners[4].vx = 1.7; s.runners[4].vy = 1.7
    } else if (playType === 'pass_short') {
      s.runners[0].vx = 4.2; s.runners[0].vy = -0.8
      s.runners[1].vx = 4.2; s.runners[1].vy = 0.8
      s.runners[3].vx = 1.4; s.runners[3].vy = 0
      s.runners[4].vx = 1.4; s.runners[4].vy = 0
    } else if (playType === 'pass_deep') {
      s.runners[0].vx = 4.8; s.runners[0].vy = -1.7
      s.runners[1].vx = 4.8; s.runners[1].vy = 1.7
      s.runners[3].vx = 1.0; s.runners[3].vy = 0
      s.runners[4].vx = 1.0; s.runners[4].vy = 0
    }

    // When CPU has possession, set up CPU play timer and player-controlled defender
    if (s.possession === 'cpu') {
      const isPass = playType.startsWith('pass')
      const defenseProfile = getDefenseProfile(s.defPlayType)
      const baseTimer = isPass ? 40 + Math.floor(Math.random() * 30) : 15 + Math.floor(Math.random() * 10)
      s.cpuPlayTimer = Math.max(8, baseTimer - defenseProfile.qbUrgency)
      s.cpuActed = false
      // Player controls the LB (defender index 4)
      s.controlledDefender = s.defenders[4]
    }
  }, [])

  const endPlay = useCallback((gained: number, reason: string) => {
    const s = stateRef.current
    s.playActive = false
    s.clockRunning = false
    s.controlledDefender = null

    const newLos = clamp(s.lineOfScrimmage + gained, 0, 100)

    // Touchdown!
    if (newLos >= 100) {
      if (s.possession === 'player') {
        s.playerScore += 7
        setPlayerScore(s.playerScore)
        s.message = 'TOUCHDOWN!'
      } else {
        s.cpuScore += 7
        setCpuScore(s.cpuScore)
        s.message = 'CPU TOUCHDOWN!'
      }
      s.messageTimer = 90
      setMessage(s.message)
      // Flip possession — scoring team kicks off
      s.possession = s.possession === 'player' ? 'cpu' : 'player'
      s.lineOfScrimmage = 25
      s.down = 1
      s.yardsToGo = 10
      s.firstDownYard = 35
      s.phase = 'scored'
      setPhase('scored')
      return
    }

    // Safety (pushed back into own endzone)
    if (newLos <= 0) {
      if (s.possession === 'player') {
        s.cpuScore += 2
        setCpuScore(s.cpuScore)
      } else {
        s.playerScore += 2
        setPlayerScore(s.playerScore)
      }
      s.message = 'SAFETY!'
      s.messageTimer = 90
      setMessage('SAFETY!')
      s.possession = s.possession === 'player' ? 'cpu' : 'player'
      s.lineOfScrimmage = 25
      s.down = 1
      s.yardsToGo = 10
      s.firstDownYard = 35
      s.phase = 'scored'
      setPhase('scored')
      return
    }

    s.lineOfScrimmage = newLos

    // First down?
    if (newLos >= s.firstDownYard) {
      s.down = 1
      s.yardsToGo = 10
      s.firstDownYard = Math.min(newLos + 10, 100)
      s.message = 'FIRST DOWN!'
      s.messageTimer = 60
      setMessage('FIRST DOWN!')
    } else {
      s.down++
      s.yardsToGo = s.firstDownYard - newLos

      if (s.down > 4) {
        // Turnover on downs — flip possession
        s.message = 'TURNOVER ON DOWNS'
        s.messageTimer = 90
        setMessage('TURNOVER ON DOWNS')
        s.possession = s.possession === 'player' ? 'cpu' : 'player'
        s.lineOfScrimmage = 100 - newLos
        s.down = 1
        s.yardsToGo = 10
        s.firstDownYard = Math.min(s.lineOfScrimmage + 10, 100)
        s.phase = 'turnover'
        setPhase('turnover')
        return
      }
    }

    setupPlay()
  }, [setupPlay])

  const reset = useCallback(() => {
    const s = stateRef.current
    s.playerScore = 0
    s.cpuScore = 0
    s.quarter = 1
    s.clockTime = QUARTER_TIME
    s.lineOfScrimmage = 25
    s.down = 1
    s.yardsToGo = 10
    s.firstDownYard = 35
    s.possession = 'player'
    s.message = ''
    s.messageTimer = 0
    setPlayerScore(0)
    setCpuScore(0)
    setQuarter(1)
    setMessage('')
    setupKickoff()
  }, [setupKickoff])

  // Input handling
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const s = stateRef.current

      if (s.phase === 'title') {
        if (e.key === ' ' || e.key === 'Enter') reset()
        return
      }

      if (s.phase === 'game_over') {
        if (e.key === ' ' || e.key === 'Enter') reset()
        return
      }

      if (s.phase === 'scored' || s.phase === 'turnover') {
        return
      }

      if (s.phase === 'kickoff' && s.kickoffState === 'returning' && s.ballCarrier) {
        const spd = s.ballCarrier.speed
        if (e.key === 'ArrowUp' || e.key === 'w') { s.ballCarrier.vy = -spd; e.preventDefault() }
        if (e.key === 'ArrowDown' || e.key === 's') { s.ballCarrier.vy = spd; e.preventDefault() }
        if (e.key === 'ArrowLeft' || e.key === 'a') { s.ballCarrier.vx = -spd; e.preventDefault() }
        if (e.key === 'ArrowRight' || e.key === 'd') { s.ballCarrier.vx = spd; e.preventDefault() }
        return
      }

      if (s.phase === 'pick_play') {
        if (s.possession === 'player') {
          // Offensive play selection
          const num = parseInt(e.key)
          if (num >= 1 && num <= 5) {
            e.preventDefault()
            startPlay(PLAYS[num - 1].type)
            return
          }
          if (e.key === 'ArrowUp' || e.key === 'w') {
            e.preventDefault()
            s.selectedPlay = Math.max(0, s.selectedPlay - 1)
            setSelectedPlay(s.selectedPlay)
          }
          if (e.key === 'ArrowDown' || e.key === 's') {
            e.preventDefault()
            s.selectedPlay = Math.min(4, s.selectedPlay + 1)
            setSelectedPlay(s.selectedPlay)
          }
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            startPlay(PLAYS[s.selectedPlay].type)
          }
        } else {
          // Defensive play selection — CPU picks random offense play
          const num = parseInt(e.key)
          if (num >= 1 && num <= 3) {
            e.preventDefault()
            s.defPlayType = DEF_PLAYS[num - 1].type
            const cpuPlays: PlayType[] = ['run_left', 'run_mid', 'run_right', 'pass_short', 'pass_deep']
            startPlay(cpuPlays[Math.floor(Math.random() * cpuPlays.length)])
            return
          }
          if (e.key === 'ArrowUp' || e.key === 'w') {
            e.preventDefault()
            s.selectedPlay = Math.max(0, s.selectedPlay - 1)
            setSelectedPlay(s.selectedPlay)
          }
          if (e.key === 'ArrowDown' || e.key === 's') {
            e.preventDefault()
            s.selectedPlay = Math.min(2, s.selectedPlay + 1)
            setSelectedPlay(s.selectedPlay)
          }
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            s.defPlayType = DEF_PLAYS[s.selectedPlay].type
            const cpuPlays: PlayType[] = ['run_left', 'run_mid', 'run_right', 'pass_short', 'pass_deep']
            startPlay(cpuPlays[Math.floor(Math.random() * cpuPlays.length)])
          }
        }
        return
      }

      if (s.phase === 'playing') {
        if (s.possession === 'player') {
          // Player controls ball carrier (offense)
          if (s.ballCarrier) {
            const spd = s.ballCarrier.speed
            if (e.key === 'ArrowUp' || e.key === 'w') { s.ballCarrier.vy = -spd; e.preventDefault() }
            if (e.key === 'ArrowDown' || e.key === 's') { s.ballCarrier.vy = spd; e.preventDefault() }
            if (e.key === 'ArrowLeft' || e.key === 'a') { s.ballCarrier.vx = -spd; e.preventDefault() }
            if (e.key === 'ArrowRight' || e.key === 'd') { s.ballCarrier.vx = spd; e.preventDefault() }

            // Pass the ball (space)
            if (e.key === ' ' && !s.hasPassed && s.ballCarrier === s.qb) {
              e.preventDefault()
              const receivers = s.runners.filter((r, i) => i < 2 && r.x > s.qb.x)
              if (receivers.length > 0) {
                const target = receivers.reduce((a, b) => a.x > b.x ? a : b)
                const dx = target.x - s.qb.x
                const dy = target.y - s.qb.y
                const d = Math.hypot(dx, dy) || 1
                const ballSpeed = 8.5
                s.ball = {
                  x: s.qb.x, y: s.qb.y,
                  vx: (dx / d) * ballSpeed,
                  vy: (dy / d) * ballSpeed,
                  inFlight: true,
                  target,
                }
                s.ballCarrier = null
                s.hasPassed = true
              }
            }
          }
        } else {
          // Player controls defender (defense)
          if (s.controlledDefender) {
            const spd = s.controlledDefender.speed * 1.1
            if (e.key === 'ArrowUp' || e.key === 'w') { s.controlledDefender.vy = -spd; e.preventDefault() }
            if (e.key === 'ArrowDown' || e.key === 's') { s.controlledDefender.vy = spd; e.preventDefault() }
            if (e.key === 'ArrowLeft' || e.key === 'a') { s.controlledDefender.vx = -spd; e.preventDefault() }
            if (e.key === 'ArrowRight' || e.key === 'd') { s.controlledDefender.vx = spd; e.preventDefault() }
          }
        }
      }
    }

    const handleUp = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (s.phase !== 'playing' && s.phase !== 'kickoff') return
      // Determine which entity the player controls
      const controlled = (s.phase === 'playing' && s.possession === 'cpu')
        ? s.controlledDefender
        : s.ballCarrier
      if (!controlled) return
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') {
        controlled.vy = 0
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
        controlled.vx = 0
      }
    }

    window.addEventListener('keydown', handle)
    window.addEventListener('keyup', handleUp)
    return () => {
      window.removeEventListener('keydown', handle)
      window.removeEventListener('keyup', handleUp)
    }
  }, [reset, setupPlay, setupKickoff, startPlay, endPlay])

  // Game loop + render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Pre-render emojis to offscreen canvases for crisp rendering
    const EMOJI_SIZE = PLAYER_R * 3.5
    const emojiCache: Record<string, HTMLCanvasElement> = {}
    const cacheEmoji = (emoji: string) => {
      const size = Math.ceil(EMOJI_SIZE * 2 * dpr)
      const off = document.createElement('canvas')
      off.width = size
      off.height = size
      const octx = off.getContext('2d')!
      octx.scale(dpr, dpr)
      octx.font = `${EMOJI_SIZE}px serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.clearRect(0, 0, size, size)
      octx.fillText(emoji, EMOJI_SIZE, EMOJI_SIZE)
      emojiCache[emoji] = off
    }
    cacheEmoji('🏃')
    cacheEmoji('🏈')
    cacheEmoji('🤖')

    let animFrame: number
    let lastTick = 0

    const tick = (now: number) => {
      if (now - lastTick < TICK_MS) { animFrame = requestAnimationFrame(tick); return }
      lastTick = now
      const s = stateRef.current

      // Clock
      if (s.clockRunning && s.phase === 'playing') {
        s.clockTime -= TICK_MS / 1000
        if (s.clockTime <= 0) {
          s.clockTime = QUARTER_TIME
          s.quarter++
          setQuarter(s.quarter)
          if (s.quarter > 4) {
            s.phase = 'game_over'
            setPhase('game_over')
            s.clockRunning = false
            s.message = s.playerScore > s.cpuScore ? 'YOU WIN!' : s.playerScore < s.cpuScore ? 'YOU LOSE!' : 'TIE GAME!'
            setMessage(s.message)
          }
        }
      }

      // Message timer
      if (s.messageTimer > 0) {
        s.messageTimer--
        if (s.messageTimer <= 0) {
          if (s.phase === 'scored') {
            setupKickoff()
          } else if (s.phase === 'turnover') {
            setupPlay()
          }
        }
      }

      // Kickoff logic
      if (s.phase === 'kickoff' && s.playActive) {
        let kickEnded = false

        if (s.kickoffState === 'ball_in_air' && s.ball) {
          s.ball.x += s.ball.vx
          s.ball.y += s.ball.vy

          // Coverage team runs downfield
          s.defenders.forEach(def => {
            def.x -= def.speed * 0.8
            def.x = clamp(def.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
          })

          // Ball caught by returner
          if (s.ball.target && dist(s.ball, s.ball.target) < 20) {
            s.ballCarrier = s.ball.target
            s.ball = null
            s.kickoffState = 'returning'
          }

          // Touchback — ball enters endzone
          if (s.ball && s.ball.x <= yardToFieldX(0)) {
            s.lineOfScrimmage = 25
            s.down = 1
            s.yardsToGo = 10
            s.firstDownYard = 35
            s.playActive = false
            s.kickoffState = null
            s.message = 'TOUCHBACK'
            s.messageTimer = 45
            setMessage('TOUCHBACK')
            setupPlay()
            kickEnded = true
          }
        }

        if (!kickEnded && s.kickoffState === 'returning' && s.ballCarrier) {
          // CPU auto-return AI: run toward the right, dodge defenders
          if (s.possession === 'cpu') {
            const midY = FIELD_TOP + FIELD_H / 2
            s.ballCarrier.vx = s.ballCarrier.speed * 0.9
            // Find nearest defender and dodge vertically
            let nearestDef: Player | null = null
            let nearDist = Infinity
            s.defenders.forEach(def => {
              const d = dist(def, s.ballCarrier!)
              if (d < nearDist) { nearDist = d; nearestDef = def }
            })
            if (nearestDef && nearDist < 60) {
              s.ballCarrier.vy = (nearestDef as Player).y > s.ballCarrier.y ? -s.ballCarrier.speed * 0.6 : s.ballCarrier.speed * 0.6
            } else {
              s.ballCarrier.vy *= 0.9 // drift back to center
              s.ballCarrier.vy += (midY - s.ballCarrier.y) * 0.02
            }
          }

          // Move returner
          s.ballCarrier.x += s.ballCarrier.vx
          s.ballCarrier.y += s.ballCarrier.vy
          s.ballCarrier.y = clamp(s.ballCarrier.y, FIELD_TOP + 2, FIELD_BOT - 2)
          s.ballCarrier.x = clamp(s.ballCarrier.x, FIELD_LEFT - ENDZONE_W + 2, FIELD_RIGHT - 2)

          // Kick return touchdown
          const yard = fieldXToYard(s.ballCarrier.x)
          if (yard >= 100) {
            if (s.possession === 'player') {
              s.playerScore += 7
              setPlayerScore(s.playerScore)
              s.message = 'KICK RETURN TD!'
            } else {
              s.cpuScore += 7
              setCpuScore(s.cpuScore)
              s.message = 'CPU RETURN TD!'
            }
            s.messageTimer = 90
            setMessage(s.message)
            s.possession = s.possession === 'player' ? 'cpu' : 'player'
            s.lineOfScrimmage = 25
            s.down = 1
            s.yardsToGo = 10
            s.firstDownYard = 35
            s.playActive = false
            s.kickoffState = null
            s.phase = 'scored'
            setPhase('scored')
            kickEnded = true
          }

          // Move blockers toward nearest defender
          if (!kickEnded) {
            s.runners.slice(1).forEach(blocker => {
              let nearest = s.defenders[0]
              let nearDist = Infinity
              s.defenders.forEach(def => {
                const d = dist(blocker, def)
                if (d < nearDist) { nearDist = d; nearest = def }
              })
              if (nearest && nearDist < 80) {
                const dx = nearest.x - blocker.x
                const dy = nearest.y - blocker.y
                const d = Math.hypot(dx, dy) || 1
                blocker.x += (dx / d) * blocker.speed * 0.7
                blocker.y += (dy / d) * blocker.speed * 0.7
                if (nearDist < PLAYER_R * 2.5) {
                  nearest.x += (dx / d) * 1.2
                  nearest.y += (dy / d) * 1.2
                }
              }
              blocker.x = clamp(blocker.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
              blocker.y = clamp(blocker.y, FIELD_TOP + 2, FIELD_BOT - 2)
            })
          }

          // Coverage team chases returner
          if (!kickEnded) {
            s.defenders.forEach(def => {
              if (kickEnded || !s.ballCarrier) return
              const dx = s.ballCarrier.x - def.x
              const dy = s.ballCarrier.y - def.y
              const d = Math.hypot(dx, dy) || 1
              const chase = def.speed * (0.7 + Math.random() * 0.3)
              def.x += (dx / d) * chase
              def.y += (dy / d) * chase
              def.x = clamp(def.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
              def.y = clamp(def.y, FIELD_TOP + 2, FIELD_BOT - 2)

              // Tackle
              if (!kickEnded && s.ballCarrier && dist(def, s.ballCarrier) < PLAYER_R * 2) {
                if (Math.random() < 0.15) {
                  def.x -= (dx / d) * 20
                  def.y -= (dy / d) * 15
                  return
                }
                const tackleYard = fieldXToYard(s.ballCarrier.x)
                s.lineOfScrimmage = clamp(tackleYard, 1, 99)
                s.down = 1
                s.yardsToGo = 10
                s.firstDownYard = Math.min(s.lineOfScrimmage + 10, 100)
                s.playActive = false
                s.kickoffState = null
                setupPlay()
                kickEnded = true
              }
            })
          }
        }
      }

      // Playing logic
      if (s.phase === 'playing' && s.playActive) {
        let playEnded = false
        const losX = yardToFieldX(s.lineOfScrimmage)
        const defenseProfile = getDefenseProfile(s.defPlayType)

        // Move offense runners along routes (if not ball carrier)
        s.runners.forEach((r) => {
          if (r === s.ballCarrier) return
          r.x += r.vx
          r.y += r.vy
          // Slow down routes over time
          r.vx *= 0.995
          r.vy *= 0.995
          r.x = clamp(r.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
          r.y = clamp(r.y, FIELD_TOP + 2, FIELD_BOT - 2)
        })

        // CPU offensive AI — control the ball carrier
        if (!playEnded && s.possession === 'cpu' && s.ballCarrier && !s.ball) {
          const midY = FIELD_TOP + FIELD_H / 2

          if (s.ballCarrier === s.qb && !s.cpuActed) {
            // QB AI: drop back slightly, then act
            let nearestPressure = Infinity
            s.defenders.forEach(def => {
              if (def === s.controlledDefender) return
              const d = dist(def, s.qb)
              if (d < nearestPressure) nearestPressure = d
            })
            if (nearestPressure < 70) {
              s.cpuPlayTimer = Math.min(s.cpuPlayTimer, 8)
            } else if (nearestPressure < 100) {
              s.cpuPlayTimer = Math.min(s.cpuPlayTimer, 14)
            }
            s.cpuPlayTimer--
            if (s.cpuPlayTimer > 0) {
              // QB drifts back
              s.ballCarrier.vx = -0.5
              s.ballCarrier.vy = (midY - s.ballCarrier.y) * 0.03
            } else {
              // Time to act
              s.cpuActed = true
              const isRun = s.playType.startsWith('run')
              if (isRun) {
                // Hand off to RB
                s.ballCarrier = s.runners[2]
              } else {
                // Pass to most open WR
                const receivers = s.runners.filter((r, i) => i < 2)
                let bestReceiver = receivers[0]
                let bestOpenness = -Infinity
                receivers.forEach(wr => {
                  let minDefDist = Infinity
                  s.defenders.forEach(def => {
                    const d = dist(wr, def)
                    if (d < minDefDist) minDefDist = d
                  })
                  if (minDefDist > bestOpenness) {
                    bestOpenness = minDefDist
                    bestReceiver = wr
                  }
                })
                if (bestReceiver && bestReceiver.x > s.qb.x) {
                  const dx = bestReceiver.x - s.qb.x
                  const dy = bestReceiver.y - s.qb.y
                  const d = Math.hypot(dx, dy) || 1
                  const ballSpeed = 7.5
                  s.ball = {
                    x: s.qb.x, y: s.qb.y,
                    vx: (dx / d) * ballSpeed,
                    vy: (dy / d) * ballSpeed,
                    inFlight: true,
                    target: bestReceiver,
                  }
                  s.ballCarrier = null
                  s.hasPassed = true
                } else {
                  // No open receiver, QB scrambles
                  s.ballCarrier.vx = s.ballCarrier.speed * 0.8
                }
              }
            }
          } else if (s.ballCarrier !== s.qb) {
            // CPU ball carrier AI — run toward endzone, dodge defenders
            s.ballCarrier.vx = s.ballCarrier.speed * 0.85
            // Find nearest defender and dodge
            let nearestDef: Player | null = null
            let nearDefDist = Infinity
            s.defenders.forEach(def => {
              const d = dist(def, s.ballCarrier!)
              if (d < nearDefDist) { nearDefDist = d; nearestDef = def }
            })
            if (nearestDef && nearDefDist < 50) {
              const dodgeDir = (nearestDef as Player).y > s.ballCarrier.y ? -1 : 1
              s.ballCarrier.vy = dodgeDir * s.ballCarrier.speed * 0.6
            } else {
              s.ballCarrier.vy *= 0.9
              s.ballCarrier.vy += (midY - s.ballCarrier.y) * 0.02
            }
          }
        }

        // Move ball carrier
        if (!playEnded && s.ballCarrier) {
          s.ballCarrier.x += s.ballCarrier.vx
          s.ballCarrier.y += s.ballCarrier.vy
          s.ballCarrier.y = clamp(s.ballCarrier.y, FIELD_TOP + 2, FIELD_BOT - 2)

          // Check if ball carrier reached the opponent endzone (touchdown)
          const carrierYard = fieldXToYard(s.ballCarrier.x)
          if (carrierYard >= 100) {
            const gained = carrierYard - s.lineOfScrimmage
            endPlay(gained, 'touchdown')
            playEnded = true
          } else {
            // Clamp x — allow running into own endzone (safety only on tackle)
            s.ballCarrier.x = clamp(s.ballCarrier.x, FIELD_LEFT - ENDZONE_W + 2, FIELD_RIGHT - 2)
          }
        }

        // Move ball in flight
        if (!playEnded && s.ball && s.ball.inFlight) {
          s.ball.x += s.ball.vx
          s.ball.y += s.ball.vy

          // Check if ball reached target receiver
          if (s.ball.target && dist(s.ball, s.ball.target) < 12) {
            // Catch! (80% chance)
            if (Math.random() < 0.80) {
              s.ballCarrier = s.ball.target
              s.ball = null
              // Check if receiver caught it in the opponent endzone (touchdown)
              const catchYard = fieldXToYard(s.ballCarrier.x)
              if (catchYard >= 100) {
                endPlay(catchYard - s.lineOfScrimmage, 'touchdown')
                playEnded = true
              }
            } else {
              // Incomplete
              endPlay(0, 'incomplete')
              playEnded = true
            }
          }

          // Ball out of bounds or too far
          if (!playEnded && s.ball && (s.ball.x < FIELD_LEFT || s.ball.x > FIELD_RIGHT || s.ball.y < FIELD_TOP || s.ball.y > FIELD_BOT)) {
            endPlay(0, 'incomplete')
            playEnded = true
          }

          // Defender intercepts?
          if (!playEnded && s.ball) {
            for (const def of s.defenders) {
              if (dist(s.ball, def) < 8) {
                if (Math.random() < 0.25) {
                  // Interception!
                  s.message = 'INTERCEPTED!'
                  s.messageTimer = 90
                  setMessage('INTERCEPTED!')
                  s.possession = s.possession === 'player' ? 'cpu' : 'player'
                  s.lineOfScrimmage = 100 - fieldXToYard(def.x)
                  s.down = 1
                  s.yardsToGo = 10
                  s.firstDownYard = Math.min(s.lineOfScrimmage + 10, 100)
                  s.playActive = false
                  s.clockRunning = false
                  s.phase = 'turnover'
                  setPhase('turnover')
                  playEnded = true
                  break
                }
              }
            }
          }
        }

        // Move defenders — AI chase ball carrier or QB
        if (!playEnded) {
          const target = s.ballCarrier || s.qb
          s.defenders.forEach((def, i) => {
            if (playEnded) return
            // Skip player-controlled defender (player moves it via input)
            if (s.possession === 'cpu' && def === s.controlledDefender) {
              def.x += def.vx
              def.y += def.vy
              def.x = clamp(def.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
              def.y = clamp(def.y, FIELD_TOP + 2, FIELD_BOT - 2)
              // But still check for tackles
              if (s.ballCarrier && dist(def, s.ballCarrier) < PLAYER_R * 2) {
                if (Math.random() < defenseProfile.tackleBreakChance) {
                  def.x -= 15; return
                }
                const gained = fieldXToYard(s.ballCarrier.x) - s.lineOfScrimmage
                endPlay(gained, 'tackled')
                playEnded = true
              }
              return
            }
            // Mix of chasing ball carrier and zone coverage
            let tx = target.x
            let ty = target.y

            // Some defenders play zone
            if (i >= 5 && !s.hasPassed) {
              // Safeties stay back unless ball is passed
              tx = lerp(def.x, target.x, 0.3 * defenseProfile.zoneDepth)
              ty = lerp(def.y, target.y, 0.5 * defenseProfile.zoneDepth)
            }

            const dx = tx - def.x
            const dy = ty - def.y
            const d = Math.hypot(dx, dy) || 1
            let chase = def.speed * (0.7 + Math.random() * 0.3) * defenseProfile.pressure
            if (s.ballCarrier === s.qb && !s.hasPassed && i >= 5 && s.defPlayType !== 'blitz') {
              chase *= 0.75
            }
            def.x += (dx / d) * chase
            def.y += (dy / d) * chase
            def.x = clamp(def.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
            def.y = clamp(def.y, FIELD_TOP + 2, FIELD_BOT - 2)

            // Tackle check
            if (s.ballCarrier && dist(def, s.ballCarrier) < PLAYER_R * 2) {
              // Juke chance - 20% to break tackle
              if (Math.random() < defenseProfile.tackleBreakChance) {
                // Broken tackle — push defender away
                def.x -= (dx / d) * 25
                def.y -= (dy / d) * 17
                return
              }
              const gained = fieldXToYard(s.ballCarrier.x) - s.lineOfScrimmage
              endPlay(gained, 'tackled')
              playEnded = true
              return
            }

            // Sack the QB
            if (!s.hasPassed && s.ballCarrier === s.qb && dist(def, s.qb) < defenseProfile.sackRadius) {
              const gained = fieldXToYard(s.qb.x) - s.lineOfScrimmage
              endPlay(Math.min(gained, -2), 'sacked')
              playEnded = true
              return
            }
          })
        }

        // OL blocking — push defenders away from QB/carrier
        if (!playEnded) {
          s.runners.slice(3).forEach((ol) => {
            s.defenders.forEach((def) => {
              if (dist(ol, def) < PLAYER_R * 2.5) {
                const dx = def.x - ol.x
                const dy = def.y - ol.y
                const d = Math.hypot(dx, dy) || 1
                const blockStrength = s.possession === 'cpu' && !s.hasPassed ? 1.15 : 0.8
                def.x += (dx / d) * blockStrength
                def.y += (dy / d) * blockStrength
              }
            })
          })
        }
      }

      // === RENDER ===
      ctx.clearRect(0, 0, W, H)

      // Background
      ctx.fillStyle = '#060610'
      ctx.fillRect(0, 0, W, H)

      // Field
      const fieldGrad = ctx.createLinearGradient(FIELD_LEFT, 0, FIELD_RIGHT, 0)
      fieldGrad.addColorStop(0, '#0a1a0a')
      fieldGrad.addColorStop(0.5, '#0d200d')
      fieldGrad.addColorStop(1, '#0a1a0a')
      ctx.fillStyle = fieldGrad
      ctx.fillRect(FIELD_LEFT, FIELD_TOP, FIELD_W, FIELD_H)

      // Endzones (outside the 0 and 100 yard lines)
      ctx.fillStyle = 'rgba(255,0,100,0.12)'
      ctx.fillRect(FIELD_LEFT - ENDZONE_W, FIELD_TOP, ENDZONE_W, FIELD_H)
      ctx.fillStyle = 'rgba(0,180,255,0.12)'
      ctx.fillRect(FIELD_RIGHT, FIELD_TOP, ENDZONE_W, FIELD_H)

      // Yard lines
      ctx.strokeStyle = 'rgba(0,255,65,0.12)'
      ctx.lineWidth = 0.5
      for (let yd = 10; yd <= 90; yd += 10) {
        const x = yardToFieldX(yd)
        ctx.beginPath(); ctx.moveTo(x, FIELD_TOP); ctx.lineTo(x, FIELD_BOT); ctx.stroke()
      }

      // Yard numbers
      ctx.font = '12px "Share Tech Mono", monospace'
      ctx.fillStyle = 'rgba(0,255,65,0.2)'
      ctx.textAlign = 'center'
      for (let yd = 10; yd <= 90; yd += 10) {
        const label = yd <= 50 ? yd : 100 - yd
        const x = yardToFieldX(yd)
        ctx.fillText(String(label), x, FIELD_TOP + 16)
        ctx.fillText(String(label), x, FIELD_BOT - 6)
      }

      // Hash marks
      ctx.strokeStyle = 'rgba(0,255,65,0.08)'
      for (let yd = 1; yd <= 99; yd++) {
        const x = yardToFieldX(yd)
        const midY = FIELD_TOP + FIELD_H / 2
        ctx.beginPath(); ctx.moveTo(x, midY - 2); ctx.lineTo(x, midY + 2); ctx.stroke()
      }

      // Field border
      ctx.strokeStyle = 'rgba(0,255,65,0.25)'
      ctx.lineWidth = 1
      ctx.strokeRect(FIELD_LEFT - ENDZONE_W, FIELD_TOP, FIELD_W + ENDZONE_W * 2, FIELD_H)

      // Line of scrimmage
      if (s.phase !== 'title' && s.phase !== 'game_over' && s.phase !== 'kickoff') {
        const losX = yardToFieldX(s.lineOfScrimmage)
        ctx.strokeStyle = 'rgba(0,200,255,0.5)'
        ctx.setLineDash([3, 3])
        ctx.beginPath(); ctx.moveTo(losX, FIELD_TOP); ctx.lineTo(losX, FIELD_BOT); ctx.stroke()
        ctx.setLineDash([])

        // First down line
        const fdX = yardToFieldX(s.firstDownYard)
        ctx.strokeStyle = 'rgba(255,255,0,0.35)'
        ctx.setLineDash([3, 3])
        ctx.beginPath(); ctx.moveTo(fdX, FIELD_TOP); ctx.lineTo(fdX, FIELD_BOT); ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw players
      if (s.phase === 'pick_play' || s.phase === 'playing' || s.phase === 'kickoff') {
        // Determine which team is offense/defense
        // QB + runners = offense, defenders = defense
        // When player has possession: offense = player team, defense = cpu team
        // When cpu has possession: offense = cpu team, defense = player team
        const offenseIsCpu = s.possession === 'cpu'

        const drawPlayer = (p: Player, glow: string, isCarrier: boolean, isCpuTeam: boolean) => {
          const cached = emojiCache[isCpuTeam ? '🤖' : '🏃']
          const drawSize = EMOJI_SIZE * 2
          ctx.shadowColor = glow
          ctx.shadowBlur = isCarrier ? 16 : 8
          ctx.drawImage(cached, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize)
          ctx.shadowBlur = 0
          ctx.drawImage(cached, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize)
          if (isCarrier) {
            const ballCached = emojiCache['🏈']
            const ballSize = EMOJI_SIZE
            ctx.drawImage(ballCached, p.x + PLAYER_R + 2 - ballSize / 2, p.y - PLAYER_R - 2 - ballSize / 2, ballSize, ballSize)
          }
        }

        // QB + Runners (offense side)
        drawPlayer(s.qb, offenseIsCpu ? '#ff0066' : '#00ffff', s.ballCarrier === s.qb, offenseIsCpu)
        s.runners.forEach((r) => {
          drawPlayer(r, offenseIsCpu ? '#ff0066' : '#00ff88', s.ballCarrier === r, offenseIsCpu)
        })

        // Defenders (defense side)
        s.defenders.forEach((d) => {
          const isControlled = s.possession === 'cpu' && d === s.controlledDefender
          const glow = isControlled ? '#ffff00' : (offenseIsCpu ? '#00ff88' : '#ff0066')
          drawPlayer(d, glow, false, !offenseIsCpu)
        })

        // Ball in flight
        if (s.ball && s.ball.inFlight) {
          ctx.shadowBlur = 0
          const ballCached = emojiCache['🏈']
          const ballSize = EMOJI_SIZE * 1.2
          ctx.drawImage(ballCached, s.ball.x - ballSize / 2, s.ball.y - ballSize / 2, ballSize, ballSize)
        }
      }

      // Scoreboard
      ctx.fillStyle = 'rgba(10,10,30,0.9)'
      ctx.fillRect(0, 0, W, FIELD_TOP - 2)
      ctx.strokeStyle = 'rgba(0,255,255,0.2)'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0, FIELD_TOP - 2); ctx.lineTo(W, FIELD_TOP - 2); ctx.stroke()

      ctx.textAlign = 'left'
      ctx.font = '700 16px Orbitron, monospace'
      ctx.fillStyle = '#00ffff'
      ctx.shadowColor = '#00ffff'
      ctx.shadowBlur = 4
      ctx.fillText(`YOU: ${s.playerScore}`, 12, 28)
      ctx.fillStyle = '#ff0066'
      ctx.shadowColor = '#ff0066'
      ctx.fillText(`CPU: ${s.cpuScore}`, 140, 28)
      ctx.shadowBlur = 0

      // Quarter & Clock
      ctx.textAlign = 'center'
      ctx.font = '14px "Share Tech Mono", monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      const mins = Math.floor(Math.max(0, s.clockTime) / 60)
      const secs = Math.floor(Math.max(0, s.clockTime) % 60)
      ctx.fillText(`Q${Math.min(s.quarter, 4)} ${mins}:${secs.toString().padStart(2, '0')}`, W / 2, 28)

      // Down & distance
      if (s.phase !== 'title' && s.phase !== 'game_over' && s.phase !== 'kickoff') {
        ctx.textAlign = 'right'
        ctx.font = '13px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(0,255,255,0.6)'
        const possLabel = s.possession === 'player' ? 'OFF' : 'DEF'
        ctx.fillText(`${possLabel} ${s.down}${['ST','ND','RD','TH'][Math.min(s.down-1,3)]} & ${s.yardsToGo}`, W - 12, 22)

        ctx.fillText(`BALL ON ${s.lineOfScrimmage}`, W - 12, 38)
      }

      // Bottom bar
      ctx.fillStyle = 'rgba(10,10,30,0.9)'
      ctx.fillRect(0, FIELD_BOT + 2, W, H - FIELD_BOT - 2)
      ctx.strokeStyle = 'rgba(0,255,255,0.15)'
      ctx.beginPath(); ctx.moveTo(0, FIELD_BOT + 2); ctx.lineTo(W, FIELD_BOT + 2); ctx.stroke()

      // Play selection screen
      if (s.phase === 'pick_play') {
        ctx.textAlign = 'center'
        ctx.font = '700 14px Orbitron, monospace'

        if (s.possession === 'player') {
          ctx.fillStyle = '#00ffff'
          ctx.shadowColor = '#00ffff'
          ctx.shadowBlur = 4
          ctx.fillText('SELECT PLAY', W / 2, FIELD_BOT + 18)
          ctx.shadowBlur = 0

          ctx.font = '12px "Share Tech Mono", monospace'
          PLAYS.forEach((play, i) => {
            const x = 40 + i * 128
            const selected = i === s.selectedPlay
            ctx.fillStyle = selected ? '#00ffff' : 'rgba(255,255,255,0.4)'
            if (selected) { ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 4 }
            ctx.fillText(`[${play.key}] ${play.name}`, x + 20, FIELD_BOT + 34)
            ctx.shadowBlur = 0
          })
        } else {
          ctx.fillStyle = '#ff0066'
          ctx.shadowColor = '#ff0066'
          ctx.shadowBlur = 4
          ctx.fillText('SELECT DEFENSE', W / 2, FIELD_BOT + 18)
          ctx.shadowBlur = 0

          ctx.font = '12px "Share Tech Mono", monospace'
          DEF_PLAYS.forEach((play, i) => {
            const x = 140 + i * 160
            const selected = i === s.selectedPlay
            ctx.fillStyle = selected ? '#ff0066' : 'rgba(255,255,255,0.4)'
            if (selected) { ctx.shadowColor = '#ff0066'; ctx.shadowBlur = 4 }
            ctx.fillText(`[${play.key}] ${play.name}`, x + 20, FIELD_BOT + 34)
            ctx.shadowBlur = 0
          })
        }
      }

      // Kickoff — show hint
      if (s.phase === 'kickoff') {
        ctx.textAlign = 'center'
        ctx.font = '700 14px Orbitron, monospace'
        ctx.fillStyle = '#ffcc00'
        ctx.shadowColor = '#ffcc00'
        ctx.shadowBlur = 4
        ctx.fillText(s.kickoffState === 'ball_in_air' ? 'KICKOFF' : 'RETURN IT!', W / 2, FIELD_BOT + 18)
        ctx.shadowBlur = 0
        if (s.kickoffState === 'returning') {
          ctx.font = '12px "Share Tech Mono", monospace'
          ctx.fillStyle = 'rgba(255,255,255,0.3)'
          ctx.fillText('WASD/ARROWS: MOVE', W / 2, FIELD_BOT + 34)
        }
      }

      // Playing — show controls hint
      if (s.phase === 'playing') {
        ctx.textAlign = 'center'
        ctx.font = '12px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        if (s.possession === 'player') {
          ctx.fillText('WASD/ARROWS: MOVE  |  SPACE: PASS', W / 2, FIELD_BOT + 22)
        } else {
          ctx.fillText('WASD/ARROWS: MOVE DEFENDER  |  MAKE THE TACKLE!', W / 2, FIELD_BOT + 22)
        }
      }

      // Messages
      if (s.messageTimer > 0 && s.message) {
        ctx.textAlign = 'center'
        ctx.font = '700 24px Orbitron, monospace'
        const flash = Math.sin(Date.now() / 100) > 0

        if (s.message === 'TOUCHDOWN!' || s.message === 'KICK RETURN TD!') {
          ctx.fillStyle = flash ? '#00ffff' : '#ff00ff'
          ctx.shadowColor = ctx.fillStyle
        } else if (s.message === 'CPU TOUCHDOWN!' || s.message === 'CPU RETURN TD!') {
          ctx.fillStyle = flash ? '#ff0044' : '#ff0066'
          ctx.shadowColor = ctx.fillStyle
        } else if (s.message.includes('INTERCEPT')) {
          ctx.fillStyle = '#ff0044'
          ctx.shadowColor = '#ff0044'
        } else {
          ctx.fillStyle = '#ffcc00'
          ctx.shadowColor = '#ffcc00'
        }
        ctx.shadowBlur = 12
        ctx.fillText(s.message, W / 2, FIELD_TOP + FIELD_H / 2)
        ctx.shadowBlur = 0

      }

      // Title screen
      if (s.phase === 'title') {
        ctx.fillStyle = 'rgba(6,6,15,0.7)'
        ctx.fillRect(0, 0, W, H)

        // Scanlines
        for (let y = 0; y < H; y += 3) {
          ctx.fillStyle = 'rgba(0,0,0,0.15)'
          ctx.fillRect(0, y, W, 1)
        }

        ctx.textAlign = 'center'
        ctx.font = '700 36px Orbitron, monospace'
        ctx.fillStyle = '#00ffff'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 15
        ctx.fillText('CYBER BOWL', W / 2, H / 2 - 50)
        ctx.shadowBlur = 0

        ctx.font = '700 16px Orbitron, monospace'
        ctx.fillStyle = '#ff00ff'
        ctx.shadowColor = '#ff00ff'
        ctx.shadowBlur = 8
        ctx.fillText('2 0 8 7', W / 2, H / 2 - 15)
        ctx.shadowBlur = 0

        ctx.font = '14px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        const blink = Math.sin(Date.now() / 400) > 0
        if (blink) ctx.fillText('PRESS ENTER TO START', W / 2, H / 2 + 25)

        ctx.font = '12px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(0,255,255,0.3)'
        ctx.fillText('WASD / ARROWS: MOVE  •  1-5: SELECT PLAY  •  SPACE: PASS', W / 2, H / 2 + 60)
      }

      // Game over
      if (s.phase === 'game_over') {
        ctx.fillStyle = 'rgba(6,6,15,0.8)'
        ctx.fillRect(0, 0, W, H)

        for (let y = 0; y < H; y += 3) {
          ctx.fillStyle = 'rgba(0,0,0,0.15)'
          ctx.fillRect(0, y, W, 1)
        }

        ctx.textAlign = 'center'
        ctx.font = '700 22px Orbitron, monospace'
        ctx.fillStyle = '#ff0044'
        ctx.shadowColor = '#ff0044'
        ctx.shadowBlur = 10
        ctx.fillText('GAME OVER', W / 2, H / 2 - 55)
        ctx.shadowBlur = 0

        ctx.font = '700 28px Orbitron, monospace'
        const win = s.playerScore > s.cpuScore
        ctx.fillStyle = win ? '#00ffff' : '#ff0066'
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 12
        ctx.fillText(s.message, W / 2, H / 2 - 10)
        ctx.shadowBlur = 0

        ctx.font = '16px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillText(`FINAL: ${s.playerScore} - ${s.cpuScore}`, W / 2, H / 2 + 22)

        ctx.font = '14px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        const blink = Math.sin(Date.now() / 400) > 0
        if (blink) ctx.fillText('PRESS ENTER TO PLAY AGAIN', W / 2, H / 2 + 55)
      }

      // Scanline overlay (subtle)
      if (s.phase === 'playing' || s.phase === 'pick_play' || s.phase === 'kickoff') {
        for (let y = 0; y < H; y += 4) {
          ctx.fillStyle = 'rgba(0,0,0,0.06)'
          ctx.fillRect(0, y, W, 1)
        }
      }

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [endPlay, setupPlay, setupKickoff])

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Score bar */}
      <div className="w-full flex justify-between items-center px-1">
        <span className="text-[9px] font-mono tracking-widest text-cyber-cyan/60">
          YOU: {playerScore}
        </span>
        <span className="text-[9px] font-mono tracking-widest text-cyber-magenta/60">
          Q{Math.min(quarter, 4)} | {phase === 'kickoff' ? 'KICKOFF' : phase === 'pick_play' ? (stateRef.current.possession === 'player' ? 'OFFENSE' : 'DEFENSE') : phase === 'playing' ? 'LIVE' : phase.toUpperCase()}
        </span>
        <span className="text-[9px] font-mono tracking-widest text-red-400/60">
          CPU: {cpuScore}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="block border border-cyan-400/10 relative"
        style={{ zIndex: 10000 }}
      />

      {/* Mobile controls */}
      <div className="flex flex-col gap-1 sm:hidden mt-1">
        {phase === 'pick_play' && stateRef.current.possession === 'player' && (
          <div className="flex gap-1 flex-wrap justify-center">
            {PLAYS.map((play) => (
              <button
                key={play.type}
                className="px-2 py-1 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-[9px] font-mono active:bg-cyan-400/15 transition-colors"
                onClick={() => startPlay(play.type)}
              >
                {play.name}
              </button>
            ))}
          </div>
        )}
        {phase === 'pick_play' && stateRef.current.possession === 'cpu' && (
          <div className="flex gap-1 flex-wrap justify-center">
            {DEF_PLAYS.map((play) => (
              <button
                key={play.type}
                className="px-2 py-1 border border-red-400/20 bg-red-400/5 text-red-400/60 text-[9px] font-mono active:bg-red-400/15 transition-colors"
                onClick={() => {
                  stateRef.current.defPlayType = play.type
                  const cpuPlays: PlayType[] = ['run_left', 'run_mid', 'run_right', 'pass_short', 'pass_deep']
                  startPlay(cpuPlays[Math.floor(Math.random() * cpuPlays.length)])
                }}
              >
                {play.name}
              </button>
            ))}
          </div>
        )}
        {phase === 'playing' && (
          <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
            <div />
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { const player = getControlledPlayer(); if (player) player.vy = -player.speed }} onTouchEnd={() => { const player = getControlledPlayer(); if (player) player.vy = 0 }}>▲</button>
            <div />
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { const player = getControlledPlayer(); if (player) player.vx = -player.speed }} onTouchEnd={() => { const player = getControlledPlayer(); if (player) player.vx = 0 }}>◀</button>
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { const player = getControlledPlayer(); if (player) player.vy = player.speed }} onTouchEnd={() => { const player = getControlledPlayer(); if (player) player.vy = 0 }}>▼</button>
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { const player = getControlledPlayer(); if (player) player.vx = player.speed }} onTouchEnd={() => { const player = getControlledPlayer(); if (player) player.vx = 0 }}>▶</button>
          </div>
        )}
        {(phase === 'title' || phase === 'game_over') && (
          <button className="px-4 py-2 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onClick={reset}>START</button>
        )}
      </div>
    </div>
  )
}
