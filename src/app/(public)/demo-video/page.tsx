import type { Metadata } from 'next'
import { VideoDemoPlayer } from '@/components/video-demo-player'

export const metadata: Metadata = {
  title: 'Video Demo Motion Graphics - LapakKita',
  description:
    'Saksikan video demo motion graphics resmi LapakKita: etalase digital UMKM lokal terverifikasi langsung via WhatsApp tanpa perantara.',
}

export default function DemoVideoPage() {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 pt-24 pb-20 sm:pt-32 sm:pb-28">
      <VideoDemoPlayer />
    </div>
  )
}
