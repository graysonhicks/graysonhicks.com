'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const CELL = 14
const COLS = 26
const ROWS = 22
const W = COLS * CELL
const H = ROWS * CELL
const TICK_MS = 90

type Dir = 'up' | 'down' | 'left' | 'right'
type Pt = { x: number; y: number }

export default function CyberSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const stateRef = useRef({
    snake: [{ x: 13, y: 11 }] as Pt[],
    dir: 'right' as Dir,
    nextDir: 'right' as Dir,
    food: { x: 20, y: 11 } as Pt,
    score: 0,
    alive: true,
  })

  const spawnFood = useCallback((snake: Pt[]): Pt => {
    let p: Pt
    do {
      p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    } while (snake.some((s) => s.x === p.x && s.y === p.y))
    return p
  }, [])

  const reset = useCallback(() => {
    const s = stateRef.current
    s.snake = [{ x: 13, y: 11 }]
    s.dir = 'right'
    s.nextDir = 'right'
    s.food = { x: 20, y: 11 }
    s.score = 0
    s.alive = true
    setScore(0)
    setGameOver(false)
    setStarted(true)
  }, [])

  // Input handling
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (!s.alive && started) {
        if (e.key === ' ' || e.key === 'Enter') reset()
        return
      }
      if (!started) {
        setStarted(true)
        return
      }

      const map: Record<string, Dir> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
      }
      const nd = map[e.key]
      if (!nd) return
      e.preventDefault()

      const opp: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
      if (nd !== opp[s.dir]) s.nextDir = nd
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [started, reset])

  // Game loop + render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let interval: ReturnType<typeof setInterval>

    const draw = () => {
      const s = stateRef.current

      // Background
      ctx.fillStyle = '#06060f'
      ctx.fillRect(0, 0, W, H)

      // Grid lines
      ctx.strokeStyle = 'rgba(0,255,255,0.04)'
      ctx.lineWidth = 0.5
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke()
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke()
      }

      // Food — pulsing magenta
      const pulse = 0.6 + Math.sin(Date.now() / 200) * 0.4
      ctx.shadowColor = '#ff00ff'
      ctx.shadowBlur = 8 * pulse
      ctx.fillStyle = `rgba(255,0,255,${0.7 + pulse * 0.3})`
      ctx.fillRect(s.food.x * CELL + 2, s.food.y * CELL + 2, CELL - 4, CELL - 4)
      ctx.shadowBlur = 0

      // Snake
      s.snake.forEach((seg, i) => {
        const t = 1 - i / s.snake.length
        const isHead = i === 0

        if (isHead) {
          ctx.shadowColor = '#00ffff'
          ctx.shadowBlur = 10
          ctx.fillStyle = '#00ffff'
        } else {
          ctx.shadowColor = '#00ffff'
          ctx.shadowBlur = 4 * t
          const g = Math.floor(180 + 75 * t)
          ctx.fillStyle = `rgba(0,${g},${g},${0.5 + 0.5 * t})`
        }

        const pad = isHead ? 1 : 2
        ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
      })
      ctx.shadowBlur = 0

      // Border glow
      ctx.strokeStyle = 'rgba(0,255,255,0.15)'
      ctx.lineWidth = 1
      ctx.strokeRect(0.5, 0.5, W - 1, H - 1)

      // Game over overlay
      if (!s.alive) {
        ctx.fillStyle = 'rgba(6,6,15,0.75)'
        ctx.fillRect(0, 0, W, H)

        ctx.font = '700 18px Orbitron, monospace'
        ctx.fillStyle = '#ff0044'
        ctx.shadowColor = '#ff0044'
        ctx.shadowBlur = 12
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', W / 2, H / 2 - 14)
        ctx.shadowBlur = 0

        ctx.font = '11px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(0,255,255,0.6)'
        ctx.fillText(`SCORE: ${s.score}`, W / 2, H / 2 + 8)
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fillText('PRESS SPACE TO RESTART', W / 2, H / 2 + 28)
      }

      // Start screen
      if (!started) {
        ctx.fillStyle = 'rgba(6,6,15,0.6)'
        ctx.fillRect(0, 0, W, H)

        ctx.font = '700 16px Orbitron, monospace'
        ctx.fillStyle = '#00ffff'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 10
        ctx.textAlign = 'center'
        ctx.fillText('CYBER SNAKE', W / 2, H / 2 - 12)
        ctx.shadowBlur = 0

        ctx.font = '10px "Share Tech Mono", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.fillText('PRESS ANY KEY TO START', W / 2, H / 2 + 10)
        ctx.fillText('WASD / ARROWS TO MOVE', W / 2, H / 2 + 26)
      }
    }

    const tick = () => {
      const s = stateRef.current
      if (!s.alive || !started) return

      s.dir = s.nextDir
      const head = { ...s.snake[0] }

      if (s.dir === 'up') head.y--
      else if (s.dir === 'down') head.y++
      else if (s.dir === 'left') head.x--
      else head.x++

      // Wall collision — wrap around
      if (head.x < 0) head.x = COLS - 1
      if (head.x >= COLS) head.x = 0
      if (head.y < 0) head.y = ROWS - 1
      if (head.y >= ROWS) head.y = 0

      // Self collision
      if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        s.alive = false
        setGameOver(true)
        setHighScore((prev) => Math.max(prev, s.score))
        return
      }

      s.snake.unshift(head)

      // Eat food
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++
        setScore(s.score)
        s.food = spawnFood(s.snake)
      } else {
        s.snake.pop()
      }
    }

    interval = setInterval(() => {
      tick()
      draw()
    }, TICK_MS)

    // Initial draw
    draw()

    return () => clearInterval(interval)
  }, [started, spawnFood, reset])

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Score bar */}
      <div className="w-full flex justify-between items-center px-1">
        <span className="text-[9px] font-mono tracking-widest text-cyber-cyan/60">
          SCORE: {score}
        </span>
        <span className="text-[9px] font-mono tracking-widest text-cyber-magenta/60">
          HI: {highScore}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block border border-cyan-400/10"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Mobile controls */}
      <div className="flex gap-1 sm:hidden mt-1">
        {(['left', 'up', 'down', 'right'] as Dir[]).map((d) => {
          const labels: Record<Dir, string> = { up: '▲', down: '▼', left: '◀', right: '▶' }
          return (
            <button
              key={d}
              className="w-10 h-8 border border-cyan-400/20 bg-cyan-400/5 text-cyber-cyan/60 text-xs font-mono active:bg-cyan-400/15 transition-colors"
              onTouchStart={(e) => {
                e.preventDefault()
                const s = stateRef.current
                if (!started) { setStarted(true); return }
                if (!s.alive) { reset(); return }
                const opp: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
                if (d !== opp[s.dir]) s.nextDir = d
              }}
            >
              {labels[d]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
