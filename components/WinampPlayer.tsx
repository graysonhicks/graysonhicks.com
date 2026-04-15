'use client'

import { useEffect, useRef, useState } from 'react'
import { useMusicPlayer, type VisMode } from '@/components/MusicPlayerProvider'

const VIS_MODE_LABELS: Record<VisMode, string> = {
  stereo: 'STEREO',
  alchemy: 'ALCHEMY',
  ribbons: 'WAVE',
  aurora: 'AURORA',
}

const VIS_PANEL_WIDTH = 224
const FULL_CANVAS_WIDTH = 259
const FULL_CANVAS_HEIGHT = 150
const COMPACT_CANVAS_WIDTH = 144
const COMPACT_CANVAS_HEIGHT = 74
const COMPACT_PLAYER_WIDTH = 392

interface WinampPlayerProps {
  compact?: boolean
}

export default function WinampPlayer({ compact = false }: WinampPlayerProps) {
  const {
    tracks,
    track,
    currentTrack,
    playing,
    currentTime,
    duration,
    volume,
    visMode,
    displayTitle,
    analyserRef,
    attemptAutoplay,
    setVolume,
    cycleVisMode,
    togglePlay,
    stop,
    prevTrack,
    nextTrack,
    selectTrack,
    seekToRatio,
  } = useMusicPlayer()

  const playerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; hue: number; life: number; size: number }[]>([])
  const ribbonPointsRef = useRef<{ x: number; y: number; hue: number }[][]>([[], [], []])
  const peakBarsRef = useRef<number[]>([])
  const [playerWidth, setPlayerWidth] = useState(0)

  useEffect(() => {
    attemptAutoplay()
  }, [attemptAutoplay])

  useEffect(() => {
    if (compact) return

    const player = playerRef.current
    if (!player) return

    const syncWidth = () => setPlayerWidth(player.getBoundingClientRect().width)
    syncWidth()

    const observer = new ResizeObserver(syncWidth)
    observer.observe(player)

    return () => observer.disconnect()
  }, [compact])

  const stackedLayout = !compact && playerWidth > 0 && playerWidth < 520
  const narrowStackedLayout = !compact && playerWidth > 0 && playerWidth < 420
  const fullCanvasWidth = narrowStackedLayout ? 860 : stackedLayout ? 720 : FULL_CANVAS_WIDTH
  const fullCanvasHeight = narrowStackedLayout ? 168 : stackedLayout ? 138 : FULL_CANVAS_HEIGHT
  const fullVisualizerWidth = stackedLayout ? '100%' : VIS_PANEL_WIDTH

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      const W = canvas.width
      const H = canvas.height
      timeRef.current += 0.016
      const t = timeRef.current
      const analyser = analyserRef.current

      let freqData = new Uint8Array(128)
      let waveData = new Uint8Array(256)
      let bass = 0
      let mid = 0
      let treble = 0
      let energy = 0

      if (analyser) {
        freqData = new Uint8Array(analyser.frequencyBinCount)
        waveData = new Uint8Array(analyser.fftSize)
        analyser.getByteFrequencyData(freqData)
        analyser.getByteTimeDomainData(waveData)

        const len = freqData.length
        for (let i = 0; i < len; i++) {
          const value = freqData[i] / 255
          energy += value
          if (i < len * 0.15) bass += value
          else if (i < len * 0.5) mid += value
          else treble += value
        }

        energy /= len
        bass /= len * 0.15
        mid /= len * 0.35
        treble /= len * 0.5
      }

      if (visMode === 'stereo') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
        ctx.fillRect(0, 0, W, H)

        const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
        bgGrad.addColorStop(0, 'rgba(14, 8, 36, 0.18)')
        bgGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.1)')
        bgGrad.addColorStop(1, 'rgba(8, 6, 20, 0.15)')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, W, H)

        const barCount = compact ? 14 : 18
        const gap = compact ? 2 : 3
        const barWidth = (W - gap * (barCount + 1)) / barCount
        const segmentCount = compact ? 10 : 16
        const segmentGap = compact ? 2 : 2.25
        const usableHeight = H - (compact ? 14 : 20)
        const segmentHeight = (usableHeight - segmentGap * (segmentCount - 1)) / segmentCount
        const floorY = H - (compact ? 6 : 9)
        const segmentInsetX = compact ? 0.6 : 0.9

        if (peakBarsRef.current.length !== barCount) {
          peakBarsRef.current = Array.from({ length: barCount }, () => 0)
        }

        ctx.strokeStyle = 'rgba(110, 90, 180, 0.22)'
        ctx.lineWidth = 1
        for (let i = 0; i < segmentCount; i++) {
          const y = floorY - i * (segmentHeight + segmentGap)
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(W, y)
          ctx.stroke()
        }

        for (let i = 0; i < barCount; i++) {
          const fromRatio = i / barCount
          const toRatio = (i + 1) / barCount
          const start = Math.floor(Math.pow(fromRatio, 1.65) * (freqData.length - 1))
          const end = Math.max(start + 1, Math.floor(Math.pow(toRatio, 1.65) * freqData.length))

          let bandTotal = 0
          let bandPeak = 0
          for (let j = start; j < end; j++) {
            const value = freqData[j] || 0
            bandTotal += value
            if (value > bandPeak) bandPeak = value
          }

          const bandAverage = bandTotal / (end - start)
          const bandValue = bandAverage * 0.45 + bandPeak * 0.55
          const upperBias = (i / Math.max(1, barCount - 1)) * (treble * 42 + energy * 18)
          const normalized = Math.pow(Math.min(1, (bandValue + upperBias) / 255), 0.82)
          const litSegments = Math.max(1, Math.round(normalized * (segmentCount - 1) * (0.95 + energy * 0.55)))
          const x = gap + i * (barWidth + gap)
          const hue = 178 + (i / barCount) * 10

          peakBarsRef.current[i] = Math.max(litSegments, peakBarsRef.current[i] - (compact ? 0.18 : 0.12))

          for (let seg = 0; seg < segmentCount; seg++) {
            const segY = floorY - (seg + 1) * segmentHeight - seg * segmentGap
            const isLit = seg < litSegments
            const alpha = isLit ? 0.42 + (seg / segmentCount) * 0.5 : 0.05
            const fill = isLit
              ? `hsla(${hue}, 100%, ${72 + seg * 1.2}%, ${alpha})`
              : 'rgba(55, 65, 120, 0.05)'

            ctx.fillStyle = fill
            ctx.fillRect(x + segmentInsetX, segY, barWidth - segmentInsetX * 2, segmentHeight)

            if (isLit) {
              ctx.shadowColor = `hsla(${hue}, 100%, 78%, 0.55)`
              ctx.shadowBlur = compact ? 8 : 12
              ctx.fillStyle = `hsla(${hue}, 100%, 84%, ${0.15 + energy * 0.1})`
              ctx.fillRect(
                x + segmentInsetX + 1,
                segY + 1,
                Math.max(1, barWidth - segmentInsetX * 2 - 2),
                Math.max(1, segmentHeight - 2)
              )
              ctx.shadowBlur = 0
            }

            ctx.strokeStyle = isLit ? 'rgba(210, 250, 255, 0.22)' : 'rgba(110, 120, 180, 0.08)'
            ctx.strokeRect(x + segmentInsetX + 0.5, segY + 0.5, barWidth - segmentInsetX * 2 - 1, segmentHeight - 1)
          }

          const peakSeg = Math.max(0, Math.min(segmentCount - 1, Math.round(peakBarsRef.current[i])))
          const peakY = floorY - (peakSeg + 1) * segmentHeight - peakSeg * segmentGap
          ctx.fillStyle = 'rgba(225, 250, 255, 0.95)'
          ctx.fillRect(x + segmentInsetX, peakY, barWidth - segmentInsetX * 2, Math.max(2, segmentHeight * 0.5))
        }

        ctx.fillStyle = `rgba(150, 255, 245, ${0.03 + energy * 0.05})`
        ctx.fillRect(0, 0, W, compact ? 2 : 4)
        ctx.fillRect(0, H - (compact ? 2 : 4), W, compact ? 2 : 4)

        const glow = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.7)
        glow.addColorStop(0, `rgba(110, 255, 245, ${0.06 + energy * 0.08})`)
        glow.addColorStop(1, 'rgba(80, 160, 255, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, W, H)
      } else if (visMode === 'alchemy') {
        ctx.fillStyle = 'rgba(4, 2, 12, 0.12)'
        ctx.fillRect(0, 0, W, H)

        const cx = W / 2
        const cy = H / 2

        for (let band = 0; band < 4; band++) {
          const bandVal = band === 0 ? bass : band === 1 ? mid : band === 2 ? treble : energy
          const baseHue = (t * 30 + band * 90) % 360
          const radius = 15 + bandVal * 60
          const angle = t * (0.5 + band * 0.3) + band * Math.PI / 2
          const bx = cx + Math.cos(angle) * (30 + bass * 40)
          const by = cy + Math.sin(angle * 0.7) * (20 + mid * 30)

          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, radius)
          grad.addColorStop(0, `hsla(${baseHue}, 100%, 65%, ${0.4 + bandVal * 0.4})`)
          grad.addColorStop(0.4, `hsla(${baseHue + 30}, 100%, 50%, ${0.15 + bandVal * 0.2})`)
          grad.addColorStop(1, `hsla(${baseHue + 60}, 100%, 30%, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()

          const points = 64
          for (let i = 0; i <= points; i++) {
            const anglePoint = (i / points) * Math.PI * 2
            const wobble = 1 + 0.3 * Math.sin(anglePoint * 3 + t * 2 + band) * bandVal
              + 0.2 * Math.cos(anglePoint * 5 - t * 1.5) * treble
            const radiusPoint = radius * wobble
            const px = bx + Math.cos(anglePoint) * radiusPoint
            const py = by + Math.sin(anglePoint) * radiusPoint
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.fill()
        }

        if (bass > 0.5) {
          for (let i = 0; i < (compact ? 2 : 3); i++) {
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

        const particles = particlesRef.current
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i]
          particle.x += particle.vx
          particle.y += particle.vy
          particle.vx *= 0.98
          particle.vy *= 0.98
          particle.life -= 0.015

          if (particle.life <= 0 || particle.x < 0 || particle.x > W || particle.y < 0 || particle.y > H) {
            particles.splice(i, 1)
            continue
          }

          ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.life * 0.8})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
          ctx.fill()
        }

        if (particles.length > 200) particles.splice(0, particles.length - 200)

        const pulseRadius = 20 + energy * 50
        const pulseGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseRadius)
        pulseGradient.addColorStop(0, `hsla(${(t * 50) % 360}, 100%, 80%, ${0.1 + energy * 0.15})`)
        pulseGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = pulseGradient
        ctx.fillRect(0, 0, W, H)
      } else if (visMode === 'ribbons') {
        ctx.fillStyle = 'rgba(2, 2, 10, 0.12)'
        ctx.fillRect(0, 0, W, H)

        const ribbons = ribbonPointsRef.current
        const numRibbons = 3
        const centerY = H / 2

        for (let r = 0; r < numRibbons; r++) {
          const ribbon = ribbons[r]
          const bandVal = r === 0 ? bass : r === 1 ? mid : treble
          const baseHue = (t * 25 + r * 120) % 360
          const waveIndex = Math.min(
            waveData.length - 1,
            Math.floor((r / Math.max(1, numRibbons - 1)) * (waveData.length - 1))
          )
          const waveSample = ((waveData[waveIndex] || 128) - 128) / 128
          const lateralDrift = Math.sin(t * (0.8 + r * 0.28)) * 12
          const nx = W * 0.5 + lateralDrift + waveSample * (40 + bandVal * 60)
          const ny = centerY
            + waveSample * (22 + bandVal * 70)
            + (r - 1) * 20
            + Math.sin(t * (1.2 + r * 0.35) + waveSample * 3) * (8 + bandVal * 18)

          ribbon.unshift({ x: nx, y: ny, hue: baseHue + bandVal * 40 })
          const maxLen = compact ? 50 : 80
          if (ribbon.length > maxLen) ribbon.length = maxLen
          if (ribbon.length < 3) continue

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
            const mx = (ribbon[i].x + ribbon[i + 1].x) / 2
            const my = (ribbon[i].y + ribbon[i + 1].y) / 2
            ctx.quadraticCurveTo(ribbon[i].x, ribbon[i].y, mx, my)
            ctx.stroke()
          }
          ctx.shadowBlur = 0

          const headGrad = ctx.createRadialGradient(ribbon[0].x, ribbon[0].y, 0, ribbon[0].x, ribbon[0].y, 8 + bandVal * 10)
          headGrad.addColorStop(0, `hsla(${baseHue}, 100%, 80%, ${0.6 + bandVal * 0.3})`)
          headGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = headGrad
          ctx.fillRect(ribbon[0].x - 20, ribbon[0].y - 20, 40, 40)
        }

        ctx.strokeStyle = `rgba(130, 255, 250, ${0.1 + energy * 0.3})`
        ctx.lineWidth = 1.5 + energy * 2
        ctx.shadowColor = 'rgba(0, 255, 255, 0.25)'
        ctx.shadowBlur = 10
        ctx.beginPath()
        for (let x = 0; x <= W; x += 2) {
          const index = Math.min(waveData.length - 1, Math.floor((x / W) * (waveData.length - 1)))
          const sample = ((waveData[index] || 128) - 128) / 128
          const y = centerY + sample * (18 + energy * 60)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.shadowBlur = 0
      } else if (visMode === 'aurora') {
        ctx.fillStyle = 'rgba(2, 1, 8, 0.06)'
        ctx.fillRect(0, 0, W, H)

        const layers = 5
        for (let layer = 0; layer < layers; layer++) {
          const baseY = H * (0.3 + layer * 0.12)
          const baseHue = (t * 15 + layer * 60) % 360
          const bandIdx = Math.floor((layer / layers) * freqData.length * 0.5)
          const bandVal = (freqData[bandIdx] || 0) / 255
          const amplitude = 8 + bandVal * 25 + energy * 15

          ctx.beginPath()
          ctx.moveTo(0, H)
          for (let x = 0; x <= W; x += 2) {
            const xRatio = x / W
            const y = baseY
              + Math.sin(xRatio * 4 + t * (0.7 + layer * 0.2)) * amplitude
              + Math.sin(xRatio * 7 - t * 0.5 + layer) * amplitude * 0.4 * mid
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

          ctx.strokeStyle = `hsla(${baseHue}, 100%, 75%, ${0.1 + bandVal * 0.3})`
          ctx.lineWidth = 1 + bandVal * 2
          ctx.shadowColor = `hsla(${baseHue}, 100%, 70%, 0.4)`
          ctx.shadowBlur = 6 + bandVal * 10
          ctx.beginPath()
          for (let x = 0; x <= W; x += 2) {
            const xRatio = x / W
            const y = baseY
              + Math.sin(xRatio * 4 + t * (0.7 + layer * 0.2)) * amplitude
              + Math.sin(xRatio * 7 - t * 0.5 + layer) * amplitude * 0.4 * mid
              + Math.cos(xRatio * 2.5 + t * 0.3) * amplitude * 0.6 * bass
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      }

      if (!analyser) {
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
  }, [analyserRef, compact, visMode])

  const formatTime = (seconds: number) => {
    if (!seconds || Number.isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    seekToRatio(ratio)
  }

  const buttonBase = {
    border: '1px solid rgba(0,255,255,0.2)',
    borderRadius: 2,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  } as const

  if (compact) {
    return (
      <div
        className="select-none"
        style={{
          width: COMPACT_PLAYER_WIDTH,
          fontFamily: "'VT323', monospace",
          background: 'linear-gradient(180deg, #17172d 0%, #0c0c18 100%)',
          border: '1px solid rgba(0,255,255,0.16)',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 0 18px rgba(0,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', gap: 8, padding: '8px 8px 6px' }}>
          <canvas
            ref={canvasRef}
            width={COMPACT_CANVAS_WIDTH}
            height={COMPACT_CANVAS_HEIGHT}
            style={{
              width: COMPACT_CANVAS_WIDTH,
              height: COMPACT_CANVAS_HEIGHT,
              display: 'block',
              border: '1px solid rgba(0,255,255,0.12)',
              borderRadius: 2,
              imageRendering: 'pixelated',
              flexShrink: 0,
            }}
          />

          <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '3px 5px 4px',
                background: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(0,255,255,0.08)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: 10, lineHeight: 1.1, color: '#00ff41', whiteSpace: 'nowrap' }}>
                {displayTitle}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
              <span style={{ fontSize: 10, color: '#00ffff', minWidth: 28 }}>{formatTime(currentTime)}</span>
              <div
                onClick={seek}
                style={{
                  flex: 1,
                  height: 6,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(0,255,255,0.12)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #00ffff, #44ffd4)',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 'auto' }}>
              <button
                onClick={cycleVisMode}
                title="Change visualization mode"
                style={{
                  ...buttonBase,
                  minWidth: 94,
                  height: 20,
                  padding: '0 8px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2))',
                  color: 'rgba(0,255,255,0.78)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                }}
              >
                {VIS_MODE_LABELS[visMode]}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                {[
                  { label: '⏮', action: prevTrack, title: 'Previous' },
                  { label: playing ? '⏸' : '▶', action: togglePlay, title: playing ? 'Pause' : 'Play' },
                  { label: '⏹', action: stop, title: 'Stop' },
                  { label: '⏭', action: nextTrack, title: 'Next' },
                ].map((btn) => (
                  <button
                    key={btn.title}
                    onClick={btn.action}
                    title={btn.title}
                    style={{
                      ...buttonBase,
                      width: 28,
                      height: 20,
                      background: btn.title === 'Play' || btn.title === 'Pause'
                        ? 'linear-gradient(180deg, rgba(0,255,255,0.12), rgba(0,255,255,0.04))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2))',
                      color: btn.title === 'Play' || btn.title === 'Pause' ? '#00ffff' : 'rgba(0,255,255,0.7)',
                      fontSize: 11,
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={playerRef}
      className="select-none"
      style={{
        width: '100%',
        fontFamily: "'VT323', monospace",
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 40%, #0a0a16 100%)',
        border: '1px solid rgba(0,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ display: stackedLayout ? 'block' : 'flex' }}>
        <div
          style={{
            padding: narrowStackedLayout ? '0' : stackedLayout ? '8px 8px 0' : '6px 4px 6px 8px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'stretch',
            width: stackedLayout ? '100%' : 'auto',
          }}
        >
          <canvas
            ref={canvasRef}
            width={fullCanvasWidth}
            height={fullCanvasHeight}
            style={{
              width: fullVisualizerWidth,
              height: stackedLayout ? fullCanvasHeight : '100%',
              display: 'block',
              border: narrowStackedLayout ? '0' : '1px solid rgba(0,255,255,0.12)',
              borderRadius: narrowStackedLayout ? 0 : 2,
              imageRendering: 'pixelated',
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              margin: narrowStackedLayout ? '10px 10px 0' : stackedLayout ? '8px 8px 0' : '6px 8px 0 4px',
              padding: '4px 6px 5px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(0,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: 11,
                lineHeight: 1.15,
                color: '#00ff41',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              {displayTitle}
            </div>
          </div>

          <div
            style={{
              padding: narrowStackedLayout ? '8px 10px 4px' : stackedLayout ? '6px 8px 2px' : '4px 8px 2px 4px',
              display: 'flex',
              alignItems: 'center',
              gap: narrowStackedLayout ? 6 : stackedLayout ? 4 : 6,
            }}
          >
            <span style={{ fontSize: stackedLayout ? 10 : 11, color: '#00ffff', minWidth: stackedLayout ? 28 : 32 }}>
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
            <span
              style={{
                fontSize: stackedLayout ? 10 : 11,
                color: 'rgba(0,255,255,0.5)',
                minWidth: stackedLayout ? 28 : 32,
                textAlign: 'right',
              }}
            >
              {formatTime(duration)}
            </span>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(0,255,255,0.1)',
              background: 'rgba(0,0,0,0.3)',
              maxHeight: narrowStackedLayout ? 124 : stackedLayout ? 112 : 80,
              overflowY: 'auto',
            }}
          >
            {tracks.map((item, index) => (
              <div
                key={item.src}
                onClick={() => selectTrack(index)}
                style={{
                  padding: '4px 8px',
                  fontSize: 10,
                  letterSpacing: '0.05em',
                  color: index === currentTrack ? '#00ffff' : 'rgba(255,255,255,0.4)',
                  background: index === currentTrack ? 'rgba(0,255,255,0.06)' : 'transparent',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(0,255,255,0.04)',
                  display: 'flex',
                  gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ color: index === currentTrack ? '#ff00ff' : 'rgba(255,255,255,0.25)', minWidth: 14 }}>
                  {index === currentTrack && playing ? '▶' : `${index + 1}.`}
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: narrowStackedLayout ? '6px 10px 8px' : '4px 8px 6px',
          display: 'flex',
          flexDirection: stackedLayout ? 'column' : 'row',
          alignItems: stackedLayout ? 'stretch' : 'center',
          justifyContent: 'space-between',
          gap: 8,
          borderTop: '1px solid rgba(0,255,255,0.08)',
        }}
      >
        <button
          onClick={cycleVisMode}
          title="Change visualization mode"
          style={{
            ...buttonBase,
            width: stackedLayout ? '100%' : VIS_PANEL_WIDTH,
            height: 22,
            padding: '0 10px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2))',
            color: 'rgba(0,255,255,0.8)',
            fontSize: 11,
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}
        >
          {`VISUALIZER: ${VIS_MODE_LABELS[visMode]}`}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: stackedLayout ? 'space-between' : 'flex-start',
            gap: 10,
            marginLeft: stackedLayout ? 0 : 'auto',
            width: stackedLayout ? '100%' : 'auto',
            flexWrap: stackedLayout ? 'wrap' : 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'rgba(0,255,255,0.5)' }}>VOL</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(parseFloat(event.target.value))}
              style={{
                width: 50,
                height: 4,
                accentColor: '#00ffff',
                cursor: 'pointer',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: stackedLayout ? 'auto' : 0 }}>
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
                  ...buttonBase,
                  width: 32,
                  height: 22,
                  background: btn.highlight
                    ? 'linear-gradient(180deg, rgba(0,255,255,0.12), rgba(0,255,255,0.04))'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2))',
                  color: btn.highlight ? '#00ffff' : 'rgba(0,255,255,0.7)',
                  fontSize: 12,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
          {track.title.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
