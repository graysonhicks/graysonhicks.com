'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const W = 400
const H = 260
const FIELD_TOP = 30
const FIELD_BOT = H - 20
const FIELD_H = FIELD_BOT - FIELD_TOP
const FIELD_LEFT = 20
const FIELD_RIGHT = W - 20
const FIELD_W = FIELD_RIGHT - FIELD_LEFT
const ENDZONE_W = 36
const PLAYER_R = 5
const TICK_MS = 33 // ~30fps

type Pt = { x: number; y: number }
type Player = Pt & { vx: number; vy: number; speed: number; tackled?: boolean }
type PlayType = 'run_left' | 'run_mid' | 'run_right' | 'pass_short' | 'pass_deep'
type GamePhase = 'title' | 'pick_play' | 'playing' | 'scored' | 'turnover' | 'game_over'

const PLAYS: { name: string; key: string; type: PlayType }[] = [
  { name: 'RUN LEFT', key: '1', type: 'run_left' },
  { name: 'RUN MID', key: '2', type: 'run_mid' },
  { name: 'RUN RIGHT', key: '3', type: 'run_right' },
  { name: 'SHORT PASS', key: '4', type: 'pass_short' },
  { name: 'DEEP PASS', key: '5', type: 'pass_deep' },
]

const QUARTER_TIME = 45 // seconds per quarter

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }
function dist(a: Pt, b: Pt) { return Math.hypot(a.x - b.x, a.y - b.y) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

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
  })

  const setupPlay = useCallback(() => {
    const s = stateRef.current
    const losX = yardToFieldX(s.lineOfScrimmage)
    const midY = FIELD_TOP + FIELD_H / 2

    // QB behind the line
    s.qb = { x: losX - 20, y: midY, vx: 0, vy: 0, speed: 2.2, tackled: false }

    // Offensive players
    s.runners = [
      { x: losX - 8, y: midY - 30, vx: 0, vy: 0, speed: 2.5 }, // WR top
      { x: losX - 8, y: midY + 30, vx: 0, vy: 0, speed: 2.5 }, // WR bottom
      { x: losX - 14, y: midY - 10, vx: 0, vy: 0, speed: 2.0 }, // RB
      { x: losX - 6, y: midY - 5, vx: 0, vy: 0, speed: 1.2 }, // OL
      { x: losX - 6, y: midY + 5, vx: 0, vy: 0, speed: 1.2 }, // OL
    ]

    // Defenders
    s.defenders = [
      { x: losX + 8, y: midY - 25, vx: 0, vy: 0, speed: 1.8 },  // CB
      { x: losX + 8, y: midY + 25, vx: 0, vy: 0, speed: 1.8 },  // CB
      { x: losX + 4, y: midY - 8, vx: 0, vy: 0, speed: 1.6 },   // DL
      { x: losX + 4, y: midY + 8, vx: 0, vy: 0, speed: 1.6 },   // DL
      { x: losX + 20, y: midY, vx: 0, vy: 0, speed: 2.0 },       // LB
      { x: losX + 35, y: midY - 15, vx: 0, vy: 0, speed: 2.2 },  // Safety
      { x: losX + 35, y: midY + 15, vx: 0, vy: 0, speed: 2.2 },  // Safety
    ]

    s.ballCarrier = null
    s.ball = null
    s.hasPassed = false
    s.playActive = false
    s.phase = 'pick_play'
    setPhase('pick_play')
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
      s.runners[2].vx = 2.0; s.runners[2].vy = -1.5 // RB runs up-left
      s.runners[3].vx = 1.0; s.runners[3].vy = -1.0 // OL blocks
      s.runners[4].vx = 1.0; s.runners[4].vy = -0.5
    } else if (playType === 'run_mid') {
      s.runners[2].vx = 2.5; s.runners[2].vy = 0
      s.runners[3].vx = 1.5; s.runners[3].vy = -0.3
      s.runners[4].vx = 1.5; s.runners[4].vy = 0.3
    } else if (playType === 'run_right') {
      s.runners[2].vx = 2.0; s.runners[2].vy = 1.5
      s.runners[3].vx = 1.0; s.runners[3].vy = 0.5
      s.runners[4].vx = 1.0; s.runners[4].vy = 1.0
    } else if (playType === 'pass_short') {
      // WRs run short routes
      s.runners[0].vx = 2.5; s.runners[0].vy = -0.5
      s.runners[1].vx = 2.5; s.runners[1].vy = 0.5
      s.runners[3].vx = 0.8; s.runners[3].vy = 0
      s.runners[4].vx = 0.8; s.runners[4].vy = 0
    } else if (playType === 'pass_deep') {
      s.runners[0].vx = 2.8; s.runners[0].vy = -1.0
      s.runners[1].vx = 2.8; s.runners[1].vy = 1.0
      s.runners[3].vx = 0.6; s.runners[3].vy = 0
      s.runners[4].vx = 0.6; s.runners[4].vy = 0
    }
  }, [])

  const endPlay = useCallback((gained: number, reason: string) => {
    const s = stateRef.current
    s.playActive = false
    s.clockRunning = false

    const newLos = clamp(s.lineOfScrimmage + gained, 0, 100)

    // Touchdown!
    if (newLos >= 100) {
      s.playerScore += 7
      setPlayerScore(s.playerScore)
      s.message = 'TOUCHDOWN!'
      s.messageTimer = 90
      setMessage('TOUCHDOWN!')
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
      s.cpuScore += 2
      setCpuScore(s.cpuScore)
      s.message = 'SAFETY!'
      s.messageTimer = 90
      setMessage('SAFETY!')
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
        // Turnover on downs
        s.message = 'TURNOVER ON DOWNS'
        s.messageTimer = 90
        setMessage('TURNOVER ON DOWNS')
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
    setupPlay()
  }, [setupPlay])

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
        if (s.messageTimer <= 0 && (e.key === ' ' || e.key === 'Enter')) {
          setupPlay()
        }
        return
      }

      if (s.phase === 'pick_play') {
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
        return
      }

      if (s.phase === 'playing') {
        // Player controls ball carrier
        if (s.ballCarrier) {
          const spd = s.ballCarrier.speed
          if (e.key === 'ArrowUp' || e.key === 'w') { s.ballCarrier.vy = -spd; e.preventDefault() }
          if (e.key === 'ArrowDown' || e.key === 's') { s.ballCarrier.vy = spd; e.preventDefault() }
          if (e.key === 'ArrowLeft' || e.key === 'a') { s.ballCarrier.vx = -spd; e.preventDefault() }
          if (e.key === 'ArrowRight' || e.key === 'd') { s.ballCarrier.vx = spd; e.preventDefault() }

          // Pass the ball (space)
          if (e.key === ' ' && !s.hasPassed && s.ballCarrier === s.qb) {
            e.preventDefault()
            // Find closest receiver ahead of QB
            const receivers = s.runners.filter((r, i) => i < 2 && r.x > s.qb.x)
            if (receivers.length > 0) {
              // Pick closest to "downfield"
              const target = receivers.reduce((a, b) => a.x > b.x ? a : b)
              const dx = target.x - s.qb.x
              const dy = target.y - s.qb.y
              const d = Math.hypot(dx, dy) || 1
              const ballSpeed = 5
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
      }
    }

    const handleUp = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (s.phase !== 'playing' || !s.ballCarrier) return
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') {
        s.ballCarrier.vy = 0
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
        s.ballCarrier.vx = 0
      }
    }

    window.addEventListener('keydown', handle)
    window.addEventListener('keyup', handleUp)
    return () => {
      window.removeEventListener('keydown', handle)
      window.removeEventListener('keyup', handleUp)
    }
  }, [reset, setupPlay, startPlay, endPlay])

  // Game loop + render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
      if (s.messageTimer > 0) s.messageTimer--

      // Playing logic
      if (s.phase === 'playing' && s.playActive) {
        const losX = yardToFieldX(s.lineOfScrimmage)

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

        // Move ball carrier
        if (s.ballCarrier) {
          s.ballCarrier.x += s.ballCarrier.vx
          s.ballCarrier.y += s.ballCarrier.vy
          s.ballCarrier.x = clamp(s.ballCarrier.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
          s.ballCarrier.y = clamp(s.ballCarrier.y, FIELD_TOP + 2, FIELD_BOT - 2)
        }

        // Move ball in flight
        if (s.ball && s.ball.inFlight) {
          s.ball.x += s.ball.vx
          s.ball.y += s.ball.vy

          // Check if ball reached target receiver
          if (s.ball.target && dist(s.ball, s.ball.target) < 12) {
            // Catch! (80% chance)
            if (Math.random() < 0.80) {
              s.ballCarrier = s.ball.target
              s.ball = null
            } else {
              // Incomplete
              const gained = fieldXToYard(losX) - s.lineOfScrimmage
              endPlay(0, 'incomplete')
              return
            }
          }

          // Ball out of bounds or too far
          if (s.ball && (s.ball.x < FIELD_LEFT || s.ball.x > FIELD_RIGHT || s.ball.y < FIELD_TOP || s.ball.y > FIELD_BOT)) {
            endPlay(0, 'incomplete')
            return
          }

          // Defender intercepts?
          if (s.ball) {
            for (const def of s.defenders) {
              if (dist(s.ball, def) < 8) {
                if (Math.random() < 0.25) {
                  // Interception!
                  s.message = 'INTERCEPTED!'
                  s.messageTimer = 90
                  setMessage('INTERCEPTED!')
                  s.lineOfScrimmage = 100 - fieldXToYard(def.x)
                  s.down = 1
                  s.yardsToGo = 10
                  s.firstDownYard = Math.min(s.lineOfScrimmage + 10, 100)
                  s.playActive = false
                  s.clockRunning = false
                  s.phase = 'turnover'
                  setPhase('turnover')
                  return
                }
              }
            }
          }
        }

        // Move defenders — AI chase ball carrier or QB
        const target = s.ballCarrier || s.qb
        s.defenders.forEach((def, i) => {
          // Mix of chasing ball carrier and zone coverage
          let tx = target.x
          let ty = target.y

          // Some defenders play zone
          if (i >= 5 && !s.hasPassed) {
            // Safeties stay back unless ball is passed
            tx = lerp(def.x, target.x, 0.3)
            ty = lerp(def.y, target.y, 0.5)
          }

          const dx = tx - def.x
          const dy = ty - def.y
          const d = Math.hypot(dx, dy) || 1
          const chase = def.speed * (0.7 + Math.random() * 0.3)
          def.x += (dx / d) * chase
          def.y += (dy / d) * chase
          def.x = clamp(def.x, FIELD_LEFT + 2, FIELD_RIGHT - 2)
          def.y = clamp(def.y, FIELD_TOP + 2, FIELD_BOT - 2)

          // Tackle check
          if (s.ballCarrier && dist(def, s.ballCarrier) < PLAYER_R * 2) {
            // Juke chance - 20% to break tackle
            if (Math.random() < 0.20) {
              // Broken tackle — push defender away
              def.x -= (dx / d) * 15
              def.y -= (dy / d) * 10
              return
            }
            const gained = fieldXToYard(s.ballCarrier.x) - s.lineOfScrimmage
            endPlay(gained, 'tackled')
            return
          }

          // Sack the QB
          if (!s.hasPassed && s.ballCarrier === s.qb && dist(def, s.qb) < PLAYER_R * 2) {
            const gained = fieldXToYard(s.qb.x) - s.lineOfScrimmage
            endPlay(Math.min(gained, -2), 'sacked')
            return
          }
        })

        // OL blocking — push defenders away from QB/carrier
        s.runners.slice(3).forEach((ol) => {
          s.defenders.forEach((def) => {
            if (dist(ol, def) < PLAYER_R * 2.5) {
              const dx = def.x - ol.x
              const dy = def.y - ol.y
              const d = Math.hypot(dx, dy) || 1
              def.x += (dx / d) * 0.8
              def.y += (dy / d) * 0.8
            }
          })
        })
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

      // Endzones
      ctx.fillStyle = 'rgba(255,0,100,0.12)'
      ctx.fillRect(FIELD_LEFT, FIELD_TOP, ENDZONE_W, FIELD_H)
      ctx.fillStyle = 'rgba(0,180,255,0.12)'
      ctx.fillRect(FIELD_RIGHT - ENDZONE_W, FIELD_TOP, ENDZONE_W, FIELD_H)

      // Yard lines
      ctx.strokeStyle = 'rgba(0,255,65,0.12)'
      ctx.lineWidth = 0.5
      for (let yd = 10; yd <= 90; yd += 10) {
        const x = yardToFieldX(yd)
        ctx.beginPath(); ctx.moveTo(x, FIELD_TOP); ctx.lineTo(x, FIELD_BOT); ctx.stroke()
      }

      // Yard numbers
      ctx.font = '7px "Share Tech Mono", monospace'
      ctx.fillStyle = 'rgba(0,255,65,0.2)'
      ctx.textAlign = 'center'
      for (let yd = 10; yd <= 90; yd += 10) {
        const label = yd <= 50 ? yd : 100 - yd
        const x = yardToFieldX(yd)
        ctx.fillText(String(label), x, FIELD_TOP + 10)
        ctx.fillText(String(label), x, FIELD_BOT - 4)
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
      ctx.strokeRect(FIELD_LEFT, FIELD_TOP, FIELD_W, FIELD_H)

      // Line of scrimmage
      if (s.phase !== 'title' && s.phase !== 'game_over') {
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
      if (s.phase === 'pick_play' || s.phase === 'playing') {
        // Offense
        const drawPlayer = (p: Player, color: string, glow: string, isCarrier: boolean) => {
          ctx.shadowColor = glow
          ctx.shadowBlur = isCarrier ? 10 : 4
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(p.x, p.y, PLAYER_R, 0, Math.PI * 2)
          ctx.fill()
          if (isCarrier) {
            // Ball indicator
            ctx.fillStyle = '#ffaa00'
            ctx.shadowColor = '#ffaa00'
            ctx.shadowBlur = 6
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.shadowBlur = 0
        }

        // QB
        drawPlayer(s.qb, '#00ffff', '#00ffff', s.ballCarrier === s.qb)

        // Runners/WRs
        s.runners.forEach((r, i) => {
          const color = i < 2 ? '#00ff88' : i === 2 ? '#00ddff' : '#008888'
          drawPlayer(r, color, color, s.ballCarrier === r)
        })

        // Defenders
        s.defenders.forEach((d) => {
          ctx.shadowColor = '#ff0066'
          ctx.shadowBlur = 4
          ctx.fillStyle = '#ff0066'
          ctx.beginPath()
          ctx.arc(d.x, d.y, PLAYER_R, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        })

        // Ball in flight
        if (s.ball && s.ball.inFlight) {
          ctx.shadowColor = '#ffcc00'
          ctx.shadowBlur = 8
          ctx.fillStyle = '#ffcc00'
          ctx.beginPath()
          ctx.arc(s.ball.x, s.ball.y, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      // Scoreboard
      ctx.fillStyle = 'rgba(10,10,30,0.9)'
      ctx.fillRect(0, 0, W, FIELD_TOP - 2)
      ctx.strokeStyle = 'rgba(0,255,255,0.2)'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0, FIELD_TOP - 2); ctx.lineTo(W, FIELD_TOP - 2); ctx.stroke()

      ctx.textAlign = 'left'
      ctx.font = '700 10px Orbitron, monospace'
      ctx.fillStyle = '#00ffff'
      ctx.shadowColor = '#00ffff'
      ctx.shadowBlur = 4
      ctx.fillText(`YOU: ${s.playerScore}`, 8, 14)
      ctx.fillStyle = '#ff0066'
      ctx.shadowColor = '#ff0066'
      ctx.fillText(`CPU: ${s.cpuScore}`, 80, 14)
      ctx.shadowBlur = 0

      // Quarter & Clock
      ctx.textAlign = 'center'
      ctx.font = '9px "Share Tech Mono", monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      const mins = Math.floor(Math.max(0, s.clockTime) / 60)
      const secs = Math.floor(Math.max(0, s.clockTime) % 60)
      ctx.fillText(`Q${Math.min(s.quarter, 4)} ${mins}:${secs.toString().padStart(2, '0')}`, W / 2, 14)

      // Down & distance
      if (s.phase !== 'title' && s.phase !== 'game_over') {
        ctx.textAlign = 'right'
        ctx.font = '8px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(0,255,255,0.6)'
        ctx.fillText(`${s.down}${['ST','ND','RD','TH'][Math.min(s.down-1,3)]} & ${s.yardsToGo}`, W - 8, 14)

        // Yard line indicator
        ctx.fillText(`BALL ON ${s.lineOfScrimmage}`, W - 8, 24)
      }

      // Bottom bar
      ctx.fillStyle = 'rgba(10,10,30,0.9)'
      ctx.fillRect(0, FIELD_BOT + 2, W, H - FIELD_BOT - 2)
      ctx.strokeStyle = 'rgba(0,255,255,0.15)'
      ctx.beginPath(); ctx.moveTo(0, FIELD_BOT + 2); ctx.lineTo(W, FIELD_BOT + 2); ctx.stroke()

      // Play selection screen
      if (s.phase === 'pick_play') {
        // Overlay on bottom
        ctx.textAlign = 'center'
        ctx.font = '700 9px Orbitron, monospace'
        ctx.fillStyle = '#00ffff'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 4
        ctx.fillText('SELECT PLAY', W / 2, FIELD_BOT + 16)
        ctx.shadowBlur = 0

        ctx.font = '8px "Share Tech Mono", monospace'
        PLAYS.forEach((play, i) => {
          const x = 30 + i * 75
          const selected = i === s.selectedPlay
          ctx.fillStyle = selected ? '#00ffff' : 'rgba(255,255,255,0.4)'
          if (selected) {
            ctx.shadowColor = '#00ffff'
            ctx.shadowBlur = 4
          }
          ctx.fillText(`[${play.key}] ${play.name}`, x + 20, FIELD_BOT + 32)
          ctx.shadowBlur = 0
        })
      }

      // Playing — show controls hint
      if (s.phase === 'playing') {
        ctx.textAlign = 'center'
        ctx.font = '7px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fillText('WASD/ARROWS: MOVE  |  SPACE: PASS', W / 2, FIELD_BOT + 16)
      }

      // Messages
      if (s.messageTimer > 0 && s.message) {
        ctx.textAlign = 'center'
        ctx.font = '700 16px Orbitron, monospace'
        const flash = Math.sin(Date.now() / 100) > 0

        if (s.message === 'TOUCHDOWN!') {
          ctx.fillStyle = flash ? '#00ffff' : '#ff00ff'
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

        if (s.messageTimer < 20 && (s.phase === 'scored' || s.phase === 'turnover')) {
          ctx.font = '9px "Share Tech Mono", monospace'
          ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.fillText('PRESS ENTER TO CONTINUE', W / 2, FIELD_TOP + FIELD_H / 2 + 20)
        }
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
        ctx.font = '700 22px Orbitron, monospace'
        ctx.fillStyle = '#00ffff'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 15
        ctx.fillText('CYBER BOWL', W / 2, H / 2 - 30)
        ctx.shadowBlur = 0

        ctx.font = '700 10px Orbitron, monospace'
        ctx.fillStyle = '#ff00ff'
        ctx.shadowColor = '#ff00ff'
        ctx.shadowBlur = 8
        ctx.fillText('2 0 8 7', W / 2, H / 2 - 10)
        ctx.shadowBlur = 0

        ctx.font = '9px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        const blink = Math.sin(Date.now() / 400) > 0
        if (blink) ctx.fillText('PRESS ENTER TO START', W / 2, H / 2 + 20)

        ctx.font = '8px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(0,255,255,0.3)'
        ctx.fillText('WASD / ARROWS: MOVE  •  1-5: SELECT PLAY  •  SPACE: PASS', W / 2, H / 2 + 45)
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
        ctx.font = '700 14px Orbitron, monospace'
        ctx.fillStyle = '#ff0044'
        ctx.shadowColor = '#ff0044'
        ctx.shadowBlur = 10
        ctx.fillText('GAME OVER', W / 2, H / 2 - 35)
        ctx.shadowBlur = 0

        ctx.font = '700 18px Orbitron, monospace'
        const win = s.playerScore > s.cpuScore
        ctx.fillStyle = win ? '#00ffff' : '#ff0066'
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 12
        ctx.fillText(s.message, W / 2, H / 2 - 8)
        ctx.shadowBlur = 0

        ctx.font = '11px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillText(`FINAL: ${s.playerScore} - ${s.cpuScore}`, W / 2, H / 2 + 15)

        ctx.font = '9px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        const blink = Math.sin(Date.now() / 400) > 0
        if (blink) ctx.fillText('PRESS ENTER TO PLAY AGAIN', W / 2, H / 2 + 40)
      }

      // Scanline overlay (subtle)
      if (s.phase === 'playing' || s.phase === 'pick_play') {
        for (let y = 0; y < H; y += 4) {
          ctx.fillStyle = 'rgba(0,0,0,0.06)'
          ctx.fillRect(0, y, W, 1)
        }
      }

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [endPlay])

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Score bar */}
      <div className="w-full flex justify-between items-center px-1">
        <span className="text-[9px] font-mono tracking-widest text-cyber-cyan/60">
          YOU: {playerScore}
        </span>
        <span className="text-[9px] font-mono tracking-widest text-cyber-magenta/60">
          Q{Math.min(quarter, 4)} | {phase === 'pick_play' ? 'PICK PLAY' : phase === 'playing' ? 'LIVE' : phase.toUpperCase()}
        </span>
        <span className="text-[9px] font-mono tracking-widest text-red-400/60">
          CPU: {cpuScore}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block border border-cyan-400/10 w-full h-auto"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Mobile controls */}
      <div className="flex flex-col gap-1 sm:hidden mt-1">
        {phase === 'pick_play' && (
          <div className="flex gap-1 flex-wrap justify-center">
            {PLAYS.map((play, i) => (
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
        {phase === 'playing' && (
          <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
            <div />
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vy = -stateRef.current.ballCarrier.speed }} onTouchEnd={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vy = 0 }}>▲</button>
            <div />
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vx = -stateRef.current.ballCarrier.speed }} onTouchEnd={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vx = 0 }}>◀</button>
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vy = stateRef.current.ballCarrier.speed }} onTouchEnd={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vy = 0 }}>▼</button>
            <button className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onTouchStart={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vx = stateRef.current.ballCarrier.speed }} onTouchEnd={() => { if (stateRef.current.ballCarrier) stateRef.current.ballCarrier.vx = 0 }}>▶</button>
          </div>
        )}
        {(phase === 'title' || phase === 'game_over') && (
          <button className="px-4 py-2 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onClick={reset}>START</button>
        )}
        {(phase === 'scored' || phase === 'turnover') && stateRef.current.messageTimer <= 0 && (
          <button className="px-4 py-2 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15" onClick={setupPlay}>CONTINUE</button>
        )}
      </div>
    </div>
  )
}
