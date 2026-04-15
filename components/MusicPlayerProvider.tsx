'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'

type VisMode = 'stereo' | 'alchemy' | 'ribbons' | 'aurora'

const TRACKS = [
  { title: '88.1 FM Dotcom', src: '/music/88.1 FM.m4a' },
  { title: 'Sunrise Static', src: '/music/Sunrise Static.mp3' },
  { title: 'Golden AM', src: '/music/Golden AM.mp3' },
  { title: 'Neon Pavement', src: '/music/Neon Pavement.mp3' },
  { title: 'Dust on the Needle', src: '/music/Dust on the Needle.mp3' },
  { title: 'Cassette Weather', src: '/music/Cassette Weather.mp3' },
  { title: 'Quiet Traffic', src: '/music/Quiet Traffic.mp3' },
  { title: 'Evening Sketch', src: '/music/Evening Sketch.mp3' },
  { title: 'Driftwood', src: '/music/Driftwood.mp3' },
  { title: 'Empty Room No. 3', src: '/music/Empty Room No. 3.mp3' },
  { title: 'Last Train Home', src: '/music/Last Train Home.mp3' },
]

const VIS_MODES: VisMode[] = ['stereo', 'alchemy', 'ribbons', 'aurora']
const FADE_DURATION = 3

type MusicPlayerContextValue = {
  tracks: typeof TRACKS
  track: (typeof TRACKS)[number]
  currentTrack: number
  playing: boolean
  currentTime: number
  duration: number
  volume: number
  visMode: VisMode
  displayTitle: string
  analyserRef: MutableRefObject<AnalyserNode | null>
  attemptAutoplay: () => void
  setVolume: (value: number) => void
  cycleVisMode: () => void
  togglePlay: () => void
  stop: () => void
  prevTrack: () => void
  nextTrack: () => void
  selectTrack: (index: number) => void
  seekToRatio: (ratio: number) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [visMode, setVisMode] = useState<VisMode>('stereo')
  const [scrollOffset, setScrollOffset] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const fadeOutScheduledRef = useRef(false)
  const hasInitializedTrackRef = useRef(false)
  const hasAttemptedAutoplayRef = useRef(false)
  const hasCompletedAutoplayRef = useRef(false)
  const playingRef = useRef(true)

  const track = TRACKS[currentTrack]

  const cycleVisMode = useCallback(() => {
    setVisMode((current) => VIS_MODES[(VIS_MODES.indexOf(current) + 1) % VIS_MODES.length])
  }, [])

  const ensureAudioContext = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return audioCtxRef.current

    const AudioContextCtor =
      window.AudioContext
      ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioContextCtor) return null

    const ctx = new AudioContextCtor()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.85

    const gain = ctx.createGain()
    gain.gain.value = 0

    const source = ctx.createMediaElementSource(audioRef.current)
    source.connect(gain)
    gain.connect(analyser)
    analyser.connect(ctx.destination)

    audioCtxRef.current = ctx
    analyserRef.current = analyser
    sourceRef.current = source
    gainRef.current = gain

    return ctx
  }, [])

  const resumeAudioContext = useCallback(async () => {
    const ctx = ensureAudioContext()
    if (ctx?.state === 'suspended') {
      await ctx.resume()
    }

    return ctx
  }, [ensureAudioContext])

  const fadeIn = useCallback(() => {
    const gain = gainRef.current
    const ctx = audioCtxRef.current
    if (!gain || !ctx) return
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + FADE_DURATION)
    fadeOutScheduledRef.current = false
  }, [])

  const autoplayAudio = useCallback(async () => {
    if (!audioRef.current) return false

    try {
      audioRef.current.load()
      await audioRef.current.play()
      setPlaying(true)
      hasCompletedAutoplayRef.current = true
      return true
    } catch {
      setPlaying(false)
      return false
    }
  }, [])

  const attemptAutoplay = useCallback(() => {
    if (hasCompletedAutoplayRef.current || hasAttemptedAutoplayRef.current) return
    hasAttemptedAutoplayRef.current = true
    void autoplayAudio().finally(() => {
      hasAttemptedAutoplayRef.current = false
    })
  }, [autoplayAudio])

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  const playAudio = useCallback(async () => {
    if (!audioRef.current) return false

    try {
      await resumeAudioContext()
      await audioRef.current.play()
      fadeIn()
      setPlaying(true)
      return true
    } catch {
      setPlaying(false)
      return false
    }
  }, [fadeIn, resumeAudioContext])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      void playAudio()
    }
  }, [playAudio, playing])

  const stop = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setCurrentTime(0)
    fadeOutScheduledRef.current = false
    setPlaying(false)
  }, [])

  const prevTrack = useCallback(() => {
    setCurrentTrack((index) => (index - 1 + TRACKS.length) % TRACKS.length)
    setPlaying(true)
  }, [])

  const nextTrack = useCallback(() => {
    setCurrentTrack((index) => (index + 1) % TRACKS.length)
    setPlaying(true)
  }, [])

  const selectTrack = useCallback((index: number) => {
    setCurrentTrack(index)
    setPlaying(true)
  }, [])

  const seekToRatio = useCallback((ratio: number) => {
    if (!audioRef.current || !duration) return
    audioRef.current.currentTime = ratio * duration
  }, [duration])

  useEffect(() => {
    if (!audioRef.current) return
    if (!hasInitializedTrackRef.current) {
      hasInitializedTrackRef.current = true
      return
    }

    hasCompletedAutoplayRef.current = false
    hasAttemptedAutoplayRef.current = false
    audioRef.current.load()
    setCurrentTime(0)
    setDuration(0)
    fadeOutScheduledRef.current = false

    if (playingRef.current) {
      if (audioCtxRef.current) {
        void playAudio()
      } else {
        void autoplayAudio()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onCanPlay = () => {
      if (!hasCompletedAutoplayRef.current && playingRef.current) {
        attemptAutoplay()
      }
    }

    audio.addEventListener('canplay', onCanPlay)
    return () => {
      audio.removeEventListener('canplay', onCanPlay)
    }
  }, [attemptAutoplay])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => {
      setCurrentTime(audio.currentTime)
      const gain = gainRef.current
      const ctx = audioCtxRef.current
      if (gain && ctx && audio.duration && !fadeOutScheduledRef.current) {
        const timeLeft = audio.duration - audio.currentTime
        if (timeLeft <= FADE_DURATION && timeLeft > 0) {
          gain.gain.cancelScheduledValues(ctx.currentTime)
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + timeLeft)
          fadeOutScheduledRef.current = true
        }
      }
    }

    const onDuration = () => setDuration(audio.duration || 0)
    const onEnded = () => nextTrack()
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [nextTrack])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const interval = setInterval(() => setScrollOffset((offset) => offset + 1), 150)
    return () => clearInterval(interval)
  }, [])

  const displayTitle = useMemo(() => {
    const titleStr = `  *** ${track.title} ***  `
    const repeated = titleStr.repeat(8)
    const idx = scrollOffset % titleStr.length
    return repeated.slice(idx, idx + 72)
  }, [scrollOffset, track.title])

  const value = useMemo<MusicPlayerContextValue>(() => ({
    tracks: TRACKS,
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
  }), [
    currentTime,
    currentTrack,
    displayTitle,
    duration,
    nextTrack,
    playing,
    prevTrack,
    seekToRatio,
    selectTrack,
    stop,
    attemptAutoplay,
    togglePlay,
    track,
    visMode,
    volume,
    cycleVisMode,
  ])

  return (
    <MusicPlayerContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        autoPlay
        playsInline
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  }
  return context
}

export type { VisMode }
