'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function TerminalImage() {
  const [bootPhase, setBootPhase] = useState(0)
  const [scanY, setScanY] = useState(0)
  const [showAlt, setShowAlt] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const flickerRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const autoPreviewRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHoveringRef = useRef(false)

  const clearFlickerTimers = useCallback(() => {
    flickerRef.current.forEach(clearTimeout)
    flickerRef.current = []
  }, [])

  const startFlicker = useCallback(() => {
    clearFlickerTimers()

    // Brief flicker then swap to alt image
    const flickers = [50, 120, 200]
    flickers.forEach((delay, i) => {
      const timer = setTimeout(() => {
        setShowAlt(i % 2 === 0)
      }, delay)
      flickerRef.current.push(timer)
    })
    const settle = setTimeout(() => setShowAlt(true), 250)
    flickerRef.current.push(settle)
  }, [clearFlickerTimers])

  const stopFlicker = useCallback(() => {
    clearFlickerTimers()

    // Brief flicker back to original
    const flickers = [50, 120]
    flickers.forEach((delay, i) => {
      const timer = setTimeout(() => {
        setShowAlt(i % 2 === 1)
      }, delay)
      flickerRef.current.push(timer)
    })
    const settle = setTimeout(() => setShowAlt(false), 180)
    flickerRef.current.push(settle)
  }, [clearFlickerTimers])

  const runTimedPreview = useCallback(() => {
    clearFlickerTimers()

    const flickers = [50, 130, 220]
    flickers.forEach((delay, i) => {
      const timer = setTimeout(() => {
        setShowAlt(i % 2 === 0)
      }, delay)
      flickerRef.current.push(timer)
    })

    const settle = setTimeout(() => setShowAlt(true), 280)
    const revert = setTimeout(() => {
      if (!isHoveringRef.current) setShowAlt(false)
    }, 1280)

    flickerRef.current.push(settle, revert)
  }, [clearFlickerTimers])

  useEffect(() => {
    autoPreviewRef.current = setTimeout(() => {
      runTimedPreview()
    }, 5000)

    return () => {
      clearFlickerTimers()
      if (autoPreviewRef.current) clearTimeout(autoPreviewRef.current)
    }
  }, [clearFlickerTimers, runTimedPreview])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const syncMobile = () => setIsMobile(media.matches)
    syncMobile()
    media.addEventListener('change', syncMobile)
    return () => media.removeEventListener('change', syncMobile)
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setBootPhase(1), 300),
      setTimeout(() => setBootPhase(2), 800),
      setTimeout(() => setBootPhase(3), 1400),
      setTimeout(() => setBootPhase(4), 2000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (bootPhase < 4) return
    let frame: number
    let start: number
    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = (ts - start) / 1000
      setScanY((Math.sin(elapsed * 0.7) * 0.5 + 0.5) * 100)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [bootPhase])

  return (
    <div
      className="relative w-full h-56 sm:w-44 sm:h-56 md:w-52 md:h-64 shrink-0 select-none overflow-hidden cursor-pointer"
      onMouseEnter={() => {
        isHoveringRef.current = true
        startFlicker()
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false
        stopFlicker()
      }}
    >
      {/* Outer monitor casing */}
      <div className="absolute -inset-3 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-sm border border-gray-700/50 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Bezel screws */}
        <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-gray-600/40 border border-gray-500/20" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gray-600/40 border border-gray-500/20" />
        <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-gray-600/40 border border-gray-500/20" />
        <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gray-600/40 border border-gray-500/20" />

        {/* Model label on bezel */}
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[6px] font-mono text-gray-600/40 tracking-[0.3em]">
          CRT-7700
        </div>
      </div>

      {/* Screen area */}
      <div className="relative w-full h-full overflow-hidden bg-black rounded-[1px] border border-gray-800/80">
        {/* Screen curvature */}
        <div
          className="absolute inset-0 z-30 pointer-events-none rounded-[1px]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {/* Phosphor glow */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 40% 40%, rgba(0,255,255,0.04) 0%, transparent 70%)`,
          }}
        />

        {/* Scanlines */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px)',
          }}
        />

        {/* Moving scan bar */}
        {bootPhase >= 4 && (
          <div
            className="absolute left-0 right-0 h-8 z-20 pointer-events-none transition-none"
            style={{
              top: `${scanY}%`,
              background: 'linear-gradient(180deg, transparent, rgba(0,255,255,0.04) 40%, rgba(0,255,255,0.06) 50%, rgba(0,255,255,0.04) 60%, transparent)',
            }}
          />
        )}

        {/* RGB pixel subgrid */}
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, #ff0000 0px, #ff0000 1px, #00ff00 1px, #00ff00 2px, #0000ff 2px, #0000ff 3px, transparent 3px, transparent 4px)`,
          }}
        />

        {/* Boot sequence */}
        {bootPhase < 4 && (
          <div className="absolute inset-0 z-40 bg-black flex flex-col justify-end p-2">
            <div className="font-mono text-[8px] leading-relaxed text-cyber-green/80 space-y-0.5">
              {bootPhase >= 1 && <p>BIOS v3.2.1 ... OK</p>}
              {bootPhase >= 2 && <p>LOADING SUBJECT.IMG ...</p>}
              {bootPhase >= 3 && (
                <p className="animate-pulse">RENDERING FEED ████████</p>
              )}
            </div>
          </div>
        )}

        {/* Actual headshot image with CRT color treatment */}
        <div
          className={`relative w-full h-full transition-opacity duration-700 ${
            bootPhase >= 4 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/images/headshot.png"
            alt="Grayson Hicks"
            fill
            className="object-cover absolute inset-0 transition-opacity duration-75"
            style={{
              filter: 'contrast(1.1) brightness(0.95) saturate(0.85)',
              objectPosition: isMobile ? 'center 20%' : 'center center',
              opacity: showAlt ? 0 : 1,
            }}
          />
          <Image
            src="/images/headshot-alt.png"
            alt="Grayson Hicks - Alt"
            fill
            className="object-cover absolute inset-0 transition-opacity duration-75"
            style={{
              filter: 'contrast(1.1) brightness(0.95) saturate(0.85)',
              objectPosition: isMobile ? 'center 20%' : 'center center',
              opacity: showAlt ? 1 : 0,
            }}
          />
          {/* Cyan/green tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 via-transparent to-cyber-green/10 mix-blend-overlay" />
        </div>

        {/* HUD overlay */}
        {bootPhase >= 4 && (
          <div className="absolute inset-0 z-30 pointer-events-none p-1.5">
            {/* Top-left: crosshairs */}
            <div className="absolute top-2 left-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M0 4 L0 0 L4 0" stroke="rgba(0,255,255,0.5)" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute top-2 right-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 0 L16 0 L16 4" stroke="rgba(0,255,255,0.5)" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute bottom-2 left-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M0 12 L0 16 L4 16" stroke="rgba(0,255,255,0.5)" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 16 L16 16 L16 12" stroke="rgba(0,255,255,0.5)" strokeWidth="1" />
              </svg>
            </div>

            {/* Top bar */}
            <div className="flex justify-between items-start">
              <span className="text-[7px] font-mono text-cyber-cyan/50 tracking-widest">
                SUBJ_01
              </span>
              <span className="text-[7px] font-mono text-cyber-green/50 animate-pulse">
                ● REC
              </span>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-end">
              <span className="text-[6px] font-mono text-cyber-cyan/40 tracking-wider">
                FEED://CAM_01
              </span>
              <span className="text-[6px] font-mono text-cyber-cyan/40">
                30.0fps
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Power LED */}
      <div className="absolute -bottom-3 right-4 flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
            bootPhase >= 1
              ? 'bg-cyber-green shadow-[0_0_4px_rgba(0,255,65,0.6)]'
              : 'bg-gray-700'
          }`}
        />
      </div>

      {/* Status readout below monitor */}
      <div className="mt-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse" />
        <span className="text-[9px] font-mono text-cyber-green/60 tracking-[0.25em]">
          SIGNAL LOCKED
        </span>
      </div>
    </div>
  )
}
