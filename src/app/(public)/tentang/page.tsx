import type { Metadata } from 'next'
import { TentangAnimatedView } from '@/components/tentang-animated-view'

export const metadata: Metadata = {
  title: 'Tentang Kami - LapakKita | Etalase Digital UMKM Lokal',
  description:
    'Mengenal LapakKita, platform etalase karya anak bangsa yang menghubungkan pelaku UMKM lokal langsung dengan pembeli tanpa komisi perantara.',
}

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <TentangAnimatedView />
    </div>
  )
}
