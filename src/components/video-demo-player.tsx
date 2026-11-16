'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Film,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'

// ─── Subtitles (Exact 100% match with Indonesian VO) ───
const SUBTITLES = [
  { start: 0.0, end: 3.5, text: '' },
  { start: 3.5, end: 9.5, text: 'Punya produk UMKM jempolan, tapi bingung cara pasarinnya ke pelanggan yang tepat?' },
  { start: 10.0, end: 17.0, text: 'Jualan di status medsos cepat tenggelam, pembeli ragu, dan biaya platform bikin boncos!' },
  { start: 17.5, end: 23.5, text: 'Kini hadir LapakKita — rumah digital produk UMKM lokal terpercaya.' },
  { start: 24.0, end: 31.5, text: 'Fitur pertama: Kurasi dan Verifikasi Admin. Menjamin setiap produk asli dan bebas penipuan.' },
  { start: 32.5, end: 41.0, text: 'Fitur kedua: Direct WhatsApp Order. Satu klik langsung chat penjual, tanpa biaya perantara!' },
  { start: 42.0, end: 50.2, text: 'Fitur ketiga: Dashboard Mandiri. Upload foto produk dan pantau minat pembeli secara real-time.' },
  { start: 51.0, end: 56.2, text: 'Saatnya produk lokalmu naik kelas dan dipercaya lebih banyak pelanggan!' },
  { start: 56.5, end: 63.2, text: 'Kunjungi www.lapakkita.my.id — Daftarkan usahamu gratis hari ini!' },
  { start: 63.5, end: 68.0, text: '' }
]

const SCENES = [
  { id: 0, name: 'Logo Intro', time: 0.0, end: 3.5 },
  { id: 1, name: 'Beranda', time: 3.5, end: 17.5 },
  { id: 2, name: 'Kurasi', time: 17.5, end: 32.0 },
  { id: 3, name: 'WhatsApp', time: 32.0, end: 41.5 },
  { id: 4, name: 'Dashboard', time: 41.5, end: 50.5 },
  { id: 5, name: 'CTA', time: 50.5, end: 63.5 },
  { id: 6, name: 'Logo Outro', time: 63.5, end: 68.0 }
]

const TOTAL_DURATION = 68.0

// ─── Easing ───
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }
function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }

/** Fade in over `fadeIn` seconds from scene start, fade out over `fadeOut` seconds before scene end */
function sceneOpacity(sceneId: number, time: number, fadeIn = 0.8, fadeOut = 0.8): number {
  const sc = SCENES[sceneId]
  if (time < sc.time || time >= sc.end) return 0
  const inP = clamp01((time - sc.time) / fadeIn)
  const outP = clamp01((sc.end - time) / fadeOut)
  return easeOutCubic(Math.min(inP, outP))
}

/** Stagger entrance for child elements */
function stagger(time: number, sceneStart: number, delay: number, dur = 0.7): number {
  return easeOutCubic(clamp01((time - sceneStart - delay) / dur))
}

// ─── Laptop mockup with real screenshot ───
function LaptopMockup({ src, alt, glow = 'rgba(24,96,73,0.25)' }: { src: string; alt: string; glow?: string }) {
  return (
    <div style={{
      position: 'relative', width: '980px',
    }}>
      {/* Screen bezel */}
      <div style={{
        background: 'linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)',
        borderRadius: '18px 18px 2px 2px',
        padding: '14px 14px 0 14px',
        boxShadow: `0 40px 100px -20px ${glow}, 0 0 0 1px rgba(255,255,255,0.08)`,
      }}>
        {/* Camera dot */}
        <div style={{
          position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#333', border: '1px solid #444'
        }} />
        {/* Screenshot image */}
        <div style={{
          width: '100%', aspectRatio: '16/9',
          borderRadius: '8px 8px 0 0', overflow: 'hidden',
          position: 'relative'
        }}>
          <Image src={src} alt={alt} fill style={{ objectFit: 'cover', objectPosition: 'top' }} sizes="980px" />
        </div>
      </div>
      {/* Base / hinge */}
      <div style={{
        width: '110%', height: '18px', marginLeft: '-5%',
        background: 'linear-gradient(to bottom, #555 0%, #3a3a3e 40%, #2a2a2e 100%)',
        borderRadius: '0 0 12px 12px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '140px', height: '6px',
          background: '#444', borderRadius: '0 0 6px 6px'
        }} />
      </div>
    </div>
  )
}

// ─── Ultra Realistic Flagship Phone Mockup ───
function PhoneMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{
      position: 'relative',
      width: '320px',
      height: '660px',
      background: 'linear-gradient(150deg, #2c2d33 0%, #1c1d22 100%)',
      borderRadius: '46px',
      padding: '12px',
      boxShadow: '0 35px 90px -15px rgba(0,0,0,0.7), 0 0 50px -10px rgba(37,211,102,0.25), 0 0 0 2px rgba(255,255,255,0.12)',
    }}>
      {/* Physical chassis buttons */}
      <div style={{
        position: 'absolute', left: '-3px', top: '90px', width: '3px', height: '30px',
        background: '#484b54', borderRadius: '2px 0 0 2px'
      }} />
      <div style={{
        position: 'absolute', left: '-3px', top: '135px', width: '3px', height: '48px',
        background: '#484b54', borderRadius: '2px 0 0 2px'
      }} />
      <div style={{
        position: 'absolute', left: '-3px', top: '195px', width: '3px', height: '48px',
        background: '#484b54', borderRadius: '2px 0 0 2px'
      }} />
      <div style={{
        position: 'absolute', right: '-3px', top: '145px', width: '3px', height: '70px',
        background: '#484b54', borderRadius: '0 2px 2px 0'
      }} />

      {/* Screen container */}
      <div style={{
        width: '100%', height: '100%',
        borderRadius: '36px', overflow: 'hidden',
        position: 'relative', background: '#0a0f0d'
      }}>
        {/* Real Mobile Screenshot */}
        <Image src={src} alt={alt} fill style={{ objectFit: 'cover', objectPosition: 'top' }} sizes="320px" priority />

        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
          width: '94px', height: '24px', background: '#000', borderRadius: '12px',
          zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          paddingRight: '8px', border: '1px solid rgba(255,255,255,0.06)'
        }}>
          {/* Camera dot reflection */}
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'radial-gradient(circle, #2d4566 20%, #0d1522 80%)',
            boxShadow: '0 0 2px rgba(255,255,255,0.3)'
          }} />
        </div>

        {/* iOS Status bar */}
        <div style={{
          position: 'absolute', top: '12px', left: '22px',
          fontSize: '12px', fontWeight: 700, color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 20, letterSpacing: '-0.2px'
        }}>
          09:41
        </div>
        <div style={{
          position: 'absolute', top: '14px', right: '22px',
          display: 'flex', alignItems: 'center', gap: '5px',
          zIndex: 20
        }}>
          {/* Signal bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '10px' }}>
            <span style={{ width: '2.5px', height: '4px', background: '#fff', borderRadius: '1px' }} />
            <span style={{ width: '2.5px', height: '6px', background: '#fff', borderRadius: '1px' }} />
            <span style={{ width: '2.5px', height: '8px', background: '#fff', borderRadius: '1px' }} />
            <span style={{ width: '2.5px', height: '10px', background: '#fff', borderRadius: '1px' }} />
          </div>
          {/* Battery pill */}
          <div style={{
            width: '20px', height: '10px', border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: '3px', padding: '1px', display: 'flex', alignItems: 'center'
          }}>
            <div style={{ width: '80%', height: '100%', background: '#34C759', borderRadius: '1.5px' }} />
          </div>
        </div>

        {/* Diagonal glass glare highlight */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%)',
          pointerEvents: 'none', zIndex: 15
        }} />

        {/* Bottom iOS Home Indicator */}
        <div style={{
          position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
          width: '110px', height: '4px', background: 'rgba(255,255,255,0.7)',
          borderRadius: '999px', zIndex: 20
        }} />
      </div>
    </div>
  )
}

// ─── Component ───
export function VideoDemoPlayer() {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [scale, setScale] = useState(1)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)

  // Responsive scale
  useEffect(() => {
    const onResize = () => {
      if (wrapperRef.current) setScale(wrapperRef.current.clientWidth / 1920)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Audio synchronization with playback
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.muted = !audioEnabled
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay may be restricted until user interacts
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, audioEnabled])

  // RAF loop
  useEffect(() => {
    const loop = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts

      if (isPlaying) {
        // Sync with audio element if available and playing
        if (audioRef.current && !audioRef.current.paused && audioRef.current.currentTime > 0) {
          const aTime = audioRef.current.currentTime
          setCurrentTime(aTime)
          if (aTime >= TOTAL_DURATION) {
            setIsPlaying(false)
            audioRef.current.pause()
          }
        } else {
          setCurrentTime(prev => {
            const next = prev + dt
            if (next >= TOTAL_DURATION) {
              setIsPlaying(false)
              return TOTAL_DURATION
            }
            return next
          })
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isPlaying])

  const togglePlay = () => {
    if (!isPlaying && currentTime >= TOTAL_DURATION) {
      setCurrentTime(0)
      if (audioRef.current) audioRef.current.currentTime = 0
    }
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setCurrentTime(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const jumpTo = (t: number) => {
    setCurrentTime(t)
    if (audioRef.current) {
      audioRef.current.currentTime = t
    }
  }

  // Derived state
  const activeIdx = useMemo(() => {
    for (let i = SCENES.length - 1; i >= 0; i--) { if (currentTime >= SCENES[i].time) return i }
    return 0
  }, [currentTime])

  const subtitle = SUBTITLES.find(s => currentTime >= s.start && currentTime < s.end)
  const ops = useMemo(() => SCENES.map((_, i) => sceneOpacity(i, currentTime)), [currentTime])

  const clickCount = (currentTime >= 41.5 && currentTime < 50.5)
    ? Math.floor(40 + clamp01((currentTime - 41.5) / 5.0) * 108)
    : 148

  // Scene base style
  const sBase = (op: number): React.CSSProperties => ({
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    opacity: op,
    transform: `scale(${0.96 + 0.04 * op})`,
    willChange: 'opacity, transform',
    pointerEvents: op > 0.05 ? 'auto' : 'none'
  })

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Studio Audio Element */}
      <audio
        ref={audioRef}
        src="/demo_audio_track.mp3"
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#186049]/10 text-[#186049] dark:bg-[#186049]/20 dark:text-[#4A943E] mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>Motion Graphics Video Demo (1080p 60FPS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900 dark:text-white">
            LapakKita — Video Presentasi &amp; Motion Demo
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Visualisasi profesional dengan voiceover aksen Indonesia fasih dan tampilan mobile responsif asli.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/lapakita_video_demo_1080p.mp4"
            download="LapakKita_Video_Demo_1080p.mp4"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#D98327] hover:bg-[#b56c1e] text-white shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Video MP4 (1080p)</span>
          </a>
          <a href="/lapakita_demo_subtitle.srt" download className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors border border-neutral-300 dark:border-neutral-700">
            <Download className="w-4 h-4 text-[#186049]" />
            <span>Download Subtitle (.srt)</span>
          </a>
          <a href="/video-demo.html" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#186049] hover:bg-[#134d3a] text-white shadow-sm transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span>Buka Studio Mandiri</span>
          </a>
        </div>
      </div>

      {/* 16:9 Stage */}
      <div ref={wrapperRef} className="relative w-full aspect-video bg-[#0a0f0d] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 select-none">
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '1920px', height: '1080px',
          transform: `scale(${scale})`, transformOrigin: 'top left',
          overflow: 'hidden',
          background: '#0a0f0d',
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
          color: '#fff'
        }}>
          {/* Ambient gradient background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(24,96,73,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(217,131,39,0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />

          {/* Timecode badge */}
          <div style={{
            position: 'absolute', top: '32px', right: '40px', zIndex: 100,
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
            padding: '8px 20px', borderRadius: '999px',
            fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px',
            color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
            {Math.floor(currentTime % 60).toString().padStart(2, '0')} / 01:08
          </div>

          {/* ═══ SCENE 0: LOGO INTRO (0–3.5s) ═══ */}
          <div style={sBase(ops[0])}>
            {(() => {
              const p = stagger(currentTime, 0, 0.2, 1.2)
              const pTag = stagger(currentTime, 0, 0.8, 0.8)
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                  <div style={{
                    opacity: p, transform: `scale(${0.8 + 0.2 * p})`,
                    filter: `blur(${(1 - p) * 4}px)`,
                  }}>
                    <Image src="/logo-dark.png" alt="LapakKita Logo" width={480} height={120} style={{ objectFit: 'contain' }} priority />
                  </div>
                  <div style={{
                    opacity: pTag, transform: `translateY(${(1 - pTag) * 16}px)`,
                    fontSize: '26px', fontWeight: 500, color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '4px', textTransform: 'uppercase'
                  }}>
                    Etalase Digital UMKM Lokal
                  </div>
                </div>
              )
            })()}
          </div>

          {/* ═══ SCENE 1: BERANDA & MASALAH (3.5–17.5s) ═══ */}
          <div style={sBase(ops[1])}>
            {(() => {
              const t = currentTime
              const pBadge = stagger(t, 3.5, 0, 0.6)
              const pTitle = stagger(t, 3.5, 0.2, 0.7)
              const pLaptop = stagger(t, 3.5, 0.5, 1.0)
              const zoomProgress = clamp01((t - 10) / 2.0)
              const laptopScale = 1 + easeInOutCubic(zoomProgress) * 0.08
              return (
                <>
                  <div style={{
                    opacity: pBadge, transform: `translateY(${(1 - pBadge) * 16}px)`,
                    background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                    padding: '8px 24px', borderRadius: '999px',
                    fontSize: '16px', fontWeight: 700, letterSpacing: '1px',
                    color: '#4A943E', marginBottom: '12px',
                    border: '1px solid rgba(74,148,62,0.2)'
                  }}>
                    BERANDA LAPAKKITA
                  </div>
                  <h2 style={{
                    opacity: pTitle, transform: `translateY(${(1 - pTitle) * 20}px)`,
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: '48px', textAlign: 'center', marginBottom: '24px',
                    lineHeight: 1.2, maxWidth: '900px'
                  }}>
                    Karya Anak Bangsa, Kualitas Juara,{' '}
                    <span style={{ color: '#4A943E' }}>Harga Bersahaja</span>
                  </h2>
                  <div style={{
                    opacity: pLaptop,
                    transform: `translateY(${(1 - pLaptop) * 40}px) scale(${laptopScale})`,
                  }}>
                    <LaptopMockup src="/demo-screenshots/homepage.png" alt="Homepage LapakKita" />
                  </div>
                </>
              )
            })()}
          </div>

          {/* ═══ SCENE 2: KURASI & KATALOG (17.5–32.0s) ═══ */}
          <div style={sBase(ops[2])}>
            {(() => {
              const t = currentTime
              const pBadge = stagger(t, 17.5, 0, 0.6)
              const pTitle = stagger(t, 17.5, 0.2, 0.7)
              const showDetail = t >= 24.0
              const pKatalog = showDetail ? clamp01(1 - (t - 24.0) / 0.8) : stagger(t, 17.5, 0.5, 0.9)
              const pDetail = showDetail ? easeOutCubic(clamp01((t - 24.0) / 0.8)) : 0
              return (
                <>
                  <div style={{
                    opacity: pBadge, transform: `translateY(${(1 - pBadge) * 16}px)`,
                    background: 'rgba(74,148,62,0.15)', backdropFilter: 'blur(10px)',
                    padding: '8px 24px', borderRadius: '999px',
                    fontSize: '16px', fontWeight: 700, letterSpacing: '1px',
                    color: '#4A943E', marginBottom: '12px',
                    border: '1px solid rgba(74,148,62,0.2)'
                  }}>
                    FITUR 01 — KURASI &amp; VERIFIKASI ADMIN
                  </div>
                  <h2 style={{
                    opacity: pTitle, transform: `translateY(${(1 - pTitle) * 20}px)`,
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: '44px', textAlign: 'center', marginBottom: '28px',
                    lineHeight: 1.2, maxWidth: '900px'
                  }}>
                    Setiap Produk Diverifikasi{' '}
                    <span style={{ color: '#4A943E' }}>Langsung oleh Tim Admin</span>
                  </h2>
                  <div style={{
                    position: 'absolute', top: '280px', left: '50%',
                    transform: `translateX(-50%) scale(${0.92 + 0.08 * pKatalog})`,
                    opacity: pKatalog,
                    transition: 'none'
                  }}>
                    <LaptopMockup src="/demo-screenshots/katalog.png" alt="Katalog UMKM" />
                  </div>
                  <div style={{
                    position: 'absolute', top: '280px', left: '50%',
                    transform: `translateX(-50%) scale(${0.92 + 0.08 * pDetail})`,
                    opacity: pDetail,
                    transition: 'none'
                  }}>
                    <LaptopMockup src="/demo-screenshots/product-detail.png" alt="Detail Produk Terverifikasi" glow="rgba(74,148,62,0.35)" />
                  </div>
                </>
              )
            })()}
          </div>

          {/* ═══ SCENE 3: WHATSAPP ORDER (32.0–41.5s) ═══ */}
          <div style={sBase(ops[3])}>
            {(() => {
              const t = currentTime
              const pBadge = stagger(t, 32.0, 0, 0.6)
              const pTitle = stagger(t, 32.0, 0.2, 0.7)
              const pPhone = stagger(t, 32.0, 0.4, 0.9)
              const pArrow = stagger(t, 32.0, 1.0, 0.5)
              const pLaptop = stagger(t, 32.0, 0.7, 0.9)
              return (
                <>
                  <div style={{
                    opacity: pBadge, transform: `translateY(${(1 - pBadge) * 16}px)`,
                    background: 'rgba(37,211,102,0.12)', backdropFilter: 'blur(10px)',
                    padding: '8px 24px', borderRadius: '999px',
                    fontSize: '16px', fontWeight: 700, letterSpacing: '1px',
                    color: '#25D366', marginBottom: '12px',
                    border: '1px solid rgba(37,211,102,0.2)'
                  }}>
                    FITUR 02 — DIRECT WHATSAPP ORDER
                  </div>
                  <h2 style={{
                    opacity: pTitle, transform: `translateY(${(1 - pTitle) * 20}px)`,
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: '44px', textAlign: 'center', marginBottom: '32px',
                    lineHeight: 1.2, maxWidth: '900px'
                  }}>
                    Satu Klik Langsung{' '}
                    <span style={{ color: '#25D366' }}>Terhubung ke WhatsApp Penjual</span>
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
                    <div style={{
                      opacity: pPhone,
                      transform: `translateX(${(1 - pPhone) * -60}px)`,
                    }}>
                      {/* Ultra sleek authentic mobile view */}
                      <PhoneMockup src="/demo-screenshots/mobile-whatsapp.png" alt="Tampilan Mobile WhatsApp Order" />
                    </div>
                    <div style={{
                      opacity: pArrow, transform: `scale(${0.5 + 0.5 * pArrow})`,
                      color: '#25D366'
                    }}>
                      <ArrowRight className="w-14 h-14 stroke-[2.5]" />
                    </div>
                    <div style={{
                      opacity: pLaptop,
                      transform: `translateX(${(1 - pLaptop) * 60}px)`,
                      width: '680px'
                    }}>
                      <LaptopMockup src="/demo-screenshots/product-whatsapp.png" alt="Pesan via WhatsApp Desktop" glow="rgba(37,211,102,0.3)" />
                    </div>
                  </div>
                </>
              )
            })()}
          </div>

          {/* ═══ SCENE 4: DASHBOARD MANDIRI (41.5–50.5s) ═══ */}
          <div style={sBase(ops[4])}>
            {(() => {
              const t = currentTime
              const pBadge = stagger(t, 41.5, 0, 0.6)
              const pTitle = stagger(t, 41.5, 0.2, 0.7)
              const pLaptop = stagger(t, 41.5, 0.5, 0.9)
              const pCounter = stagger(t, 41.5, 1.2, 0.8)
              return (
                <>
                  <div style={{
                    opacity: pBadge, transform: `translateY(${(1 - pBadge) * 16}px)`,
                    background: 'rgba(217,131,39,0.12)', backdropFilter: 'blur(10px)',
                    padding: '8px 24px', borderRadius: '999px',
                    fontSize: '16px', fontWeight: 700, letterSpacing: '1px',
                    color: '#D98327', marginBottom: '12px',
                    border: '1px solid rgba(217,131,39,0.2)'
                  }}>
                    FITUR 03 — DASHBOARD MANDIRI
                  </div>
                  <h2 style={{
                    opacity: pTitle, transform: `translateY(${(1 - pTitle) * 20}px)`,
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: '44px', textAlign: 'center', marginBottom: '28px',
                    lineHeight: 1.2, maxWidth: '900px'
                  }}>
                    Upload Mudah &amp;{' '}
                    <span style={{ color: '#D98327' }}>Pantau Minat Pelanggan Real-Time</span>
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{
                      opacity: pLaptop,
                      transform: `translateY(${(1 - pLaptop) * 40}px) scale(${0.94 + 0.06 * pLaptop})`,
                      width: '780px'
                    }}>
                      <LaptopMockup src="/demo-screenshots/tentang.png" alt="Dashboard & Tentang LapakKita" glow="rgba(217,131,39,0.3)" />
                    </div>
                    {/* Live counter card */}
                    <div style={{
                      opacity: pCounter,
                      transform: `translateX(${(1 - pCounter) * 40}px) scale(${0.9 + 0.1 * pCounter})`,
                      background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
                      borderRadius: '24px', padding: '36px 32px', textAlign: 'center',
                      border: '1px solid rgba(217,131,39,0.2)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      minWidth: '220px'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                        Minat Pembeli
                      </div>
                      <div style={{ fontSize: '64px', fontWeight: 900, color: '#D98327', fontFamily: 'monospace', lineHeight: 1 }}>
                        {clickCount}
                      </div>
                      <div style={{
                        marginTop: '12px', fontSize: '13px', fontWeight: 700,
                        color: '#4A943E', background: 'rgba(74,148,62,0.1)',
                        padding: '6px 16px', borderRadius: '999px'
                      }}>
                        💬 Klik WhatsApp
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>

          {/* ═══ SCENE 5: CTA (50.5–63.5s) ═══ */}
          <div style={sBase(ops[5])}>
            {(() => {
              const t = currentTime
              const pBadge = stagger(t, 50.5, 0, 0.6)
              const pTitle = stagger(t, 50.5, 0.3, 0.8)
              const pSub = stagger(t, 50.5, 0.5, 0.7)
              const pUrl = stagger(t, 50.5, 1.0, 0.8)
              const pCta = stagger(t, 50.5, 1.5, 0.8)
              const pulse = 1 + Math.sin(t * 3) * 0.015
              return (
                <>
                  <div style={{
                    opacity: pBadge, transform: `translateY(${(1 - pBadge) * 16}px)`,
                    background: 'rgba(24,96,73,0.15)', backdropFilter: 'blur(10px)',
                    padding: '10px 28px', borderRadius: '999px',
                    fontSize: '18px', fontWeight: 700, letterSpacing: '1.5px',
                    color: '#4A943E', marginBottom: '16px',
                    border: '1px solid rgba(74,148,62,0.2)'
                  }}>
                    DARI UMKM UNTUK INDONESIA
                  </div>
                  <h2 style={{
                    opacity: pTitle, transform: `translateY(${(1 - pTitle) * 24}px) scale(${0.95 + 0.05 * pTitle})`,
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: '64px', textAlign: 'center', marginBottom: '12px', lineHeight: 1.15
                  }}>
                    Saatnya Produk Lokalmu<br /><span style={{ color: '#4A943E' }}>Naik Kelas!</span>
                  </h2>
                  <p style={{
                    opacity: pSub, transform: `translateY(${(1 - pSub) * 16}px)`,
                    fontSize: '22px', color: 'rgba(255,255,255,0.5)', marginBottom: '40px',
                    textAlign: 'center', maxWidth: '700px'
                  }}>
                    Pajang tokomu sekarang, raih kepercayaan ribuan pelanggan tanpa biaya perantara.
                  </p>
                  <div style={{
                    opacity: pUrl, transform: `translateY(${(1 - pUrl) * 24}px) scale(${0.92 + 0.08 * pUrl})`,
                    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
                    padding: '20px 56px', borderRadius: '20px', marginBottom: '28px',
                    border: '2px solid rgba(74,148,62,0.3)',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    boxShadow: '0 20px 60px rgba(24,96,73,0.2)'
                  }}>
                    <span style={{ fontSize: '36px' }}>🌐</span>
                    <span style={{ fontSize: '36px', fontWeight: 900, color: '#4A943E', letterSpacing: '-0.5px' }}>
                      www.lapakkita.my.id
                    </span>
                  </div>
                  <div style={{
                    opacity: pCta, transform: `translateY(${(1 - pCta) * 24}px) scale(${pulse})`,
                    background: 'linear-gradient(135deg, #D98327 0%, #c47320 100%)',
                    color: '#fff', fontSize: '26px', fontWeight: 800,
                    padding: '20px 52px', borderRadius: '16px',
                    boxShadow: '0 16px 48px rgba(217,131,39,0.4)',
                  }}>
                    Daftarkan Usahamu Gratis Sekarang! 🚀
                  </div>
                </>
              )
            })()}
          </div>

          {/* ═══ SCENE 6: LOGO OUTRO (63.5–68.0s) ═══ */}
          <div style={sBase(ops[6])}>
            {(() => {
              const p = stagger(currentTime, 63.5, 0.2, 1.2)
              const pTag = stagger(currentTime, 63.5, 0.8, 0.8)
              const pUrl = stagger(currentTime, 63.5, 1.2, 0.8)
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    opacity: p, transform: `scale(${0.8 + 0.2 * p})`,
                    filter: `blur(${(1 - p) * 4}px)`,
                  }}>
                    <Image src="/logo-dark.png" alt="LapakKita Logo" width={480} height={120} style={{ objectFit: 'contain' }} />
                  </div>
                  <div style={{
                    opacity: pTag, transform: `translateY(${(1 - pTag) * 12}px)`,
                    fontSize: '22px', fontWeight: 500, color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '3px', textTransform: 'uppercase'
                  }}>
                    Etalase Digital UMKM Lokal Terpercaya
                  </div>
                  <div style={{
                    opacity: pUrl, transform: `translateY(${(1 - pUrl) * 12}px)`,
                    fontSize: '18px', fontWeight: 600, color: '#4A943E',
                    marginTop: '8px'
                  }}>
                    www.lapakkita.my.id
                  </div>
                </div>
              )
            })()}
          </div>

          {/* ═══ Subtitle Bar ═══ */}
          <div style={{
            position: 'absolute', bottom: '36px', left: '50%',
            transform: `translateX(-50%) translateY(${subtitle?.text ? '0' : '16px'})`,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(16px)',
            padding: '14px 36px', borderRadius: '14px',
            color: '#fff', fontSize: '24px', fontWeight: 500,
            textAlign: 'center', maxWidth: '1300px',
            border: '1px solid rgba(255,255,255,0.08)',
            opacity: subtitle?.text ? 1 : 0,
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            zIndex: 500, letterSpacing: '0.2px', lineHeight: 1.4
          }}>
            {subtitle?.text ?? '\u00A0'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-semibold text-neutral-500 w-24">
            {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
            {Math.floor(currentTime % 60).toString().padStart(2, '0')} / 01:08
          </span>
          <div
            className="flex-1 h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full cursor-pointer relative overflow-hidden"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              jumpTo(((e.clientX - rect.left) / rect.width) * TOTAL_DURATION)
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-[#186049] via-[#4A943E] to-[#D98327] rounded-full"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%`, transition: 'width 0.05s linear' }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#186049] hover:bg-[#134d3a] text-white transition-all shadow-sm active:scale-95">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Jeda' : 'Putar Video'}</span>
            </button>
            <button onClick={reset} className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors" title="Mulai Ulang">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setAudioEnabled(!audioEnabled)} className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors">
              {audioEnabled ? <Volume2 className="w-4 h-4 text-[#186049]" /> : <VolumeX className="w-4 h-4 text-red-500" />}
              <span className="text-xs">{audioEnabled ? 'Audio ON' : 'Audio OFF'}</span>
            </button>
            <a
              href="/lapakita_video_demo_1080p.mp4"
              download="LapakKita_Video_Demo_1080p.mp4"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#D98327] hover:bg-[#b56c1e] text-white transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download MP4</span>
            </a>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {SCENES.map(sc => (
              <button
                key={sc.id}
                onClick={() => jumpTo(sc.time)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeIdx === sc.id
                    ? 'bg-[#186049] text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
