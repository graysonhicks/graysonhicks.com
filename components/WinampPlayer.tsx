'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const TRACKS = [
  { title: 'Brain Dance', artist: 'Kevin MacLeod', src: '/music/Brain Dance.mp3' },
  { title: 'Ethernight Club', artist: 'Kevin MacLeod', src: '/music/Ethernight Club.mp3' },
  { title: 'Equatorial Complex', artist: 'Kevin MacLeod', src: '/music/Equatorial Complex.mp3' },
  { title: 'Mesmerizing Galaxy Loop', artist: 'Kevin MacLeod', src: '/music/Mesmerizing Galaxy Loop.mp3' },
]

type VisMode = 'alchemy' | 'ribbons' | 'aurora'
const VIS_MODES: VisMode[] = ['alchemy', 'ribbons', 'aurora']

export default function WinampPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [visMode, setVisMode] = useState<VisMode>('ribbons')
  const [scrollOffset, setScrollOffset] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; hue: number; life: number; size: number }[]>([])
  const ribbonPointsRef = useRef<{ x: number; y: number; hue: number }[][]>([[], [], []])

  const track = TRACKS[currentTrack]

  // Initialize audio context and analyser on first play
  const ensureAudioContext = useCallback(() => {
    if (audioCtxRef.current) return
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.85

    const source = ctx.createMediaElementSource(audioRef.current!)
    source.connect(analyser)
    analyser.connect(ctx.destination)

    audioCtxRef.current = ctx
    analyserRef.current = analyser
    sourceRef.current = source
  }, [])

  // Play / pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    ensureAudioContext()
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }, [playing, ensureAudioContext])

  const stop = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaying(false)
  }, [])

  const prevTrack = useCallback(() => {
    setCurrentTrack((i) => (i - 1 + TRACKS.length) % TRACKS.length)
    setPlaying(true)
  }, [])

  const nextTrack = useCallback(() => {
    setCurrentTrack((i) => (i + 1) % TRACKS.length)
    setPlaying(true)
  }, [])

  // When track changes, load and play
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.load()
    if (playing) {
      audioRef.current.play().catch(() => {})
    }
    setScrollOffset(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  // Time updates
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration || 0)
    const onEnded = () => nextTrack()
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [nextTrack])

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Scrolling title text
  useEffect(() => {
    const id = setInterval(() => setScrollOffset((o) => o + 1), 150)
    return () => clearInterval(id)
  }, [])

  // Visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      timeRef.current += 0.016
      const t = timeRef.current
      const analyser = analyserRef.current

      // Get frequency + waveform data
      let freqData = new Uint8Array(128)
      let waveData = new Uint8Array(256)
      let bass = 0, mid = 0, treble = 0, energy = 0

      if (analyser) {
        freqData = new Uint8Array(analyser.frequencyBinCount)
        waveData = new Uint8Array(analyser.fftSize)
        analyser.getByteFrequencyData(freqData)
        analyser.getByteTimeDomainData(waveData)

        const len = freqData.length
        for (let i = 0; i < len; i++) {
          const v = freqData[i] / 255
          energy += v
          if (i < len * 0.15) bass += v
          else if (i < len * 0.5) mid += v
          else treble += v
        }
        energy /= len
        bass /= len * 0.15
        mid /= len * 0.35
        treble /= len * 0.5
      }

      if (visMode === 'alchemy') {
        // WMP Alchemy-style: flowing blobs + particle trails
        // Fade with slight color shift
        ctx.fillStyle = `rgba(4, 2, 12, 0.12)`
        ctx.fillRect(0, 0, W, H)

        const cx = W / 2
        const cy = H / 2

        // Rotating blob shapes driven by frequency bands
        for (let b = 0; b < 4; b++) {
          const bandVal = b === 0 ? bass : b === 1 ? mid : b === 2 ? treble : energy
          const baseHue = (t * 30 + b * 90) % 360
          const radius = 15 + bandVal * 60
          const angle = t * (0.5 + b * 0.3) + b * Math.PI / 2

          const bx = cx + Math.cos(angle) * (30 + bass * 40)
          const by = cy + Math.sin(angle * 0.7) * (20 + mid * 30)

          // Glowing blob
          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, radius)
          grad.addColorStop(0, `hsla(${baseHue}, 100%, 65%, ${0.4 + bandVal * 0.4})`)
          grad.addColorStop(0.4, `hsla(${baseHue + 30}, 100%, 50%, ${0.15 + bandVal * 0.2})`)
          grad.addColorStop(1, `hsla(${baseHue + 60}, 100%, 30%, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()

          // Organic wobble shape
          const points = 64
          for (let i = 0; i <= points; i++) {
            const a = (i / points) * Math.PI * 2
            const wobble = 1 + 0.3 * Math.sin(a * 3 + t * 2 + b) * bandVal
              + 0.2 * Math.cos(a * 5 - t * 1.5) * treble
            const r = radius * wobble
            const px = bx + Math.cos(a) * r
            const py = by + Math.sin(a) * r
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.fill()
        }

        // Spawn particles on beats
        if (bass > 0.5) {
          for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 1 + bass * 3
            particlesRef.current.push({
              x: cx + Math.cos(angle) * 10,
              y: cy + Math.sin(angle) * 10,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              hue: (t * 40 + Math.random() * 60) % 360,
              life: 1,
              size: 1.5 + bass * 2,
            })
          }
        }

        // Update & draw particles
        const particles = particlesRef.current
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.98
          p.vy *= 0.98
          p.life -= 0.015

          if (p.life <= 0 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
            particles.splice(i, 1)
            continue
          }

          ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life * 0.8})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fill()
        }

        // Keep particle count reasonable
        if (particles.length > 200) particles.splice(0, particles.length - 200)

        // Central glow pulse
        const pulseR = 20 + energy * 50
        const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR)
        cGrad.addColorStop(0, `hsla(${(t * 50) % 360}, 100%, 80%, ${0.1 + energy * 0.15})`)
        cGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = cGrad
        ctx.fillRect(0, 0, W, H)

      } else if (visMode === 'ribbons') {
        // WMP-style flowing ribbons / silk threads
        ctx.fillStyle = 'rgba(2, 2, 10, 0.08)'
        ctx.fillRect(0, 0, W, H)

        const ribbons = ribbonPointsRef.current
        const numRibbons = 3

        for (let r = 0; r < numRibbons; r++) {
          const ribbon = ribbons[r]
          const bandVal = r === 0 ? bass : r === 1 ? mid : treble
          const baseHue = (t * 25 + r * 120) % 360

          // Generate new head point
          const nx = W * 0.5 + Math.sin(t * (0.8 + r * 0.3)) * (W * 0.35)
            + Math.cos(t * 1.2 + r) * bandVal * 40
          const ny = H * 0.5 + Math.cos(t * (0.6 + r * 0.4)) * (H * 0.35)
            + Math.sin(t * 0.9 - r) * bandVal * 30

          ribbon.unshift({ x: nx, y: ny, hue: baseHue + bandVal * 40 })

          // Limit trail length
          const maxLen = 80
          if (ribbon.length > maxLen) ribbon.length = maxLen

          if (ribbon.length < 3) continue

          // Draw ribbon as gradient-stroked curve
          ctx.lineWidth = 2 + bandVal * 4
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          for (let i = 1; i < ribbon.length - 1; i++) {
            const alpha = (1 - i / ribbon.length) * (0.5 + bandVal * 0.5)
            const hue = ribbon[i].hue

            ctx.strokeStyle = `hsla(${hue}, 100%, ${55 + bandVal * 20}%, ${alpha})`
            ctx.lineWidth = (2 + bandVal * 4) * (1 - i / ribbon.length)
            ctx.shadowColor = `hsla(${hue}, 100%, 60%, ${alpha * 0.5})`
            ctx.shadowBlur = 8 + bandVal * 12

            ctx.beginPath()
            ctx.moveTo(ribbon[i - 1].x, ribbon[i - 1].y)
            // Smooth curve through midpoints
            const mx = (ribbon[i].x + ribbon[i + 1].x) / 2
            const my = (ribbon[i].y + ribbon[i + 1].y) / 2
            ctx.quadraticCurveTo(ribbon[i].x, ribbon[i].y, mx, my)
            ctx.stroke()
          }
          ctx.shadowBlur = 0

          // Glowing head
          const headGrad = ctx.createRadialGradient(ribbon[0].x, ribbon[0].y, 0, ribbon[0].x, ribbon[0].y, 8 + bandVal * 10)
          headGrad.addColorStop(0, `hsla(${baseHue}, 100%, 80%, ${0.6 + bandVal * 0.3})`)
          headGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = headGrad
          ctx.fillRect(ribbon[0].x - 20, ribbon[0].y - 20, 40, 40)
        }

      } else if (visMode === 'aurora') {
        // Aurora borealis / northern lights style
        ctx.fillStyle = 'rgba(2, 1, 8, 0.06)'
        ctx.fillRect(0, 0, W, H)

        // Multiple flowing wave layers
        const layers = 5
        for (let l = 0; l < layers; l++) {
          const baseY = H * (0.3 + l * 0.12)
          const baseHue = (t * 15 + l * 60) % 360
          const bandIdx = Math.floor((l / layers) * freqData.length * 0.5)
          const bandVal = (freqData[bandIdx] || 0) / 255
          const amplitude = 8 + bandVal * 25 + energy * 15

          // Draw filled wave
          ctx.beginPath()
          ctx.moveTo(0, H)

          for (let x = 0; x <= W; x += 2) {
            const xRatio = x / W
            // Multiple sine waves for organic motion
            const y = baseY
              + Math.sin(xRatio * 4 + t * (0.7 + l * 0.2)) * amplitude
              + Math.sin(xRatio * 7 - t * 0.5 + l) * amplitude * 0.4 * mid
              + Math.cos(xRatio * 2.5 + t * 0.3) * amplitude * 0.6 * bass

            ctx.lineTo(x, y)
          }

          ctx.lineTo(W, H)
          ctx.closePath()

          const grad = ctx.createLinearGradient(0, baseY - amplitude, 0, baseY + amplitude * 2)
          grad.addColorStop(0, `hsla(${baseHue}, 100%, ${50 + bandVal * 25}%, ${0.03 + bandVal * 0.08})`)
          grad.addColorStop(0.3, `hsla(${baseHue + 20}, 90%, ${45 + bandVal * 20}%, ${0.06 + bandVal * 0.12})`)
          grad.addColorStop(0.7, `hsla(${baseHue + 40}, 80%, 40%, ${0.02 + energy * 0.04})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fill()

          // Bright edge line at the wave crest
          ctx.strokeStyle = `hsla(${baseHue}, 100%, 75%, ${0.1 + bandVal * 0.3})`
          ctx.lineWidth = 1 + bandVal * 2
          ctx.shadowColor = `hsla(${baseHue}, 100%, 70%, 0.4)`
          ctx.shadowBlur = 6 + bandVal * 10
          ctx.beginPath()
          for (let x = 0; x <= W; x += 2) {
            const xRatio = x / W
            const y = baseY
              + Math.sin(xRatio * 4 + t * (0.7 + l * 0.2)) * amplitude
              + Math.sin(xRatio * 7 - t * 0.5 + l) * amplitude * 0.4 * mid
              + Math.cos(xRatio * 2.5 + t * 0.3) * amplitude * 0.6 * bass
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
          ctx.shadowBlur = 0
        }

        // Shimmer particles along aurora
        if (energy > 0.15) {
          for (let i = 0; i < 2 + energy * 3; i++) {
            const px = Math.random() * W
            const py = H * 0.25 + Math.random() * H * 0.5
            const sparkHue = (t * 30 + Math.random() * 120) % 360
            ctx.fillStyle = `hsla(${sparkHue}, 100%, 85%, ${0.3 + energy * 0.4})`
            ctx.beginPath()
            ctx.arc(px, py, 0.5 + energy, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Idle state fallback (no analyser yet)
      if (!analyser) {
        // Still draw ambient animation with fake gentle energy
        // The modes above will just use bass/mid/treble/energy = 0
        // Add a subtle hint line
        ctx.strokeStyle = 'rgba(0,255,255,0.15)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        const idleY = H / 2 + Math.sin(t * 2) * 5
        ctx.moveTo(0, idleY)
        for (let x = 0; x <= W; x += 4) {
          ctx.lineTo(x, idleY + Math.sin(x * 0.05 + t * 3) * 3)
        }
        ctx.stroke()
      }
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [visMode])

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = ratio * duration
  }

  // Scrolling title
  const titleStr = `  *** ${track.title} - ${track.artist} ***  `
  const displayTitle = (() => {
    const doubled = titleStr + titleStr
    const idx = scrollOffset % titleStr.length
    return doubled.slice(idx, idx + 30)
  })()

  return (
    <div
      className="select-none"
      style={{
        width: 275,
        fontFamily: "'VT323', monospace",
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 40%, #0a0a16 100%)',
        border: '1px solid rgba(0,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <audio ref={audioRef} src={track.src} preload="metadata" crossOrigin="anonymous" />

      {/* Header strip */}
      <div
        style={{
          height: 14,
          background: 'linear-gradient(90deg, rgba(0,255,255,0.08), rgba(255,0,255,0.06), rgba(0,255,255,0.08))',
          borderBottom: '1px solid rgba(0,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 8, color: 'rgba(0,255,255,0.5)', letterSpacing: '0.2em' }}>
          CYBER.AMP v2.86
        </span>
      </div>

      {/* Visualizer */}
      <div
        style={{ padding: '6px 8px 4px', cursor: 'pointer' }}
        onClick={() => setVisMode(VIS_MODES[(VIS_MODES.indexOf(visMode) + 1) % VIS_MODES.length])}
        title="Click to change visualization"
      >
        <canvas
          ref={canvasRef}
          width={259}
          height={140}
          style={{
            width: '100%',
            height: 140,
            display: 'block',
            border: '1px solid rgba(0,255,255,0.12)',
            borderRadius: 2,
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Scrolling title display */}
      <div
        style={{
          margin: '2px 8px',
          padding: '3px 6px',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(0,255,255,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: 11, color: '#00ff41', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
          {displayTitle}
        </div>
      </div>

      {/* Time + seek */}
      <div style={{ padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#00ffff', minWidth: 32 }}>
          {formatTime(currentTime)}
        </span>
        <div
          onClick={seek}
          style={{
            flex: 1,
            height: 8,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(0,255,255,0.15)',
            borderRadius: 2,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
              borderRadius: 2,
              transition: 'width 0.1s',
            }}
          />
        </div>
        <span style={{ fontSize: 11, color: 'rgba(0,255,255,0.5)', minWidth: 32, textAlign: 'right' }}>
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls row */}
      <div style={{ padding: '2px 8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        {[
          { label: '⏮', action: prevTrack, title: 'Previous' },
          { label: playing ? '⏸' : '▶', action: togglePlay, title: playing ? 'Pause' : 'Play', highlight: true },
          { label: '⏹', action: stop, title: 'Stop' },
          { label: '⏭', action: nextTrack, title: 'Next' },
        ].map((btn) => (
          <button
            key={btn.title}
            onClick={btn.action}
            title={btn.title}
            style={{
              width: 32,
              height: 22,
              border: '1px solid rgba(0,255,255,0.2)',
              borderRadius: 2,
              background: btn.highlight
                ? 'linear-gradient(180deg, rgba(0,255,255,0.12), rgba(0,255,255,0.04))'
                : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2))',
              color: btn.highlight ? '#00ffff' : 'rgba(0,255,255,0.7)',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,255,255,0.5)'
              e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,255,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,255,255,0.2)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {btn.label}
          </button>
        ))}

        {/* Volume */}
        <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'rgba(0,255,255,0.5)' }}>VOL</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              width: 50,
              height: 4,
              accentColor: '#00ffff',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* Playlist */}
      <div
        style={{
          borderTop: '1px solid rgba(0,255,255,0.1)',
          background: 'rgba(0,0,0,0.3)',
          maxHeight: 90,
          overflowY: 'auto',
        }}
      >
        {TRACKS.map((t, i) => (
          <div
            key={t.src}
            onClick={() => {
              setCurrentTrack(i)
              setPlaying(true)
            }}
            style={{
              padding: '4px 8px',
              fontSize: 10,
              letterSpacing: '0.05em',
              color: i === currentTrack ? '#00ffff' : 'rgba(255,255,255,0.4)',
              background: i === currentTrack ? 'rgba(0,255,255,0.06)' : 'transparent',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(0,255,255,0.04)',
              display: 'flex',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (i !== currentTrack) e.currentTarget.style.background = 'rgba(0,255,255,0.03)'
            }}
            onMouseLeave={(e) => {
              if (i !== currentTrack) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ color: i === currentTrack ? '#ff00ff' : 'rgba(255,255,255,0.25)', minWidth: 14 }}>
              {i === currentTrack && playing ? '▶' : `${i + 1}.`}
            </span>
            <span>{t.artist} - {t.title}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          height: 12,
          background: 'linear-gradient(90deg, rgba(255,0,255,0.06), rgba(0,255,255,0.06))',
          borderTop: '1px solid rgba(0,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
          MUSIC BY KEVIN MACLEOD (INCOMPETECH.COM) CC BY 4.0
        </span>
      </div>
    </div>
  )
}
