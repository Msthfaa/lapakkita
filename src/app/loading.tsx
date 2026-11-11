import { InteractiveLoadingScreen } from '@/components/interactive-loading-screen'

export default function Loading() {
  return (
    <div className="w-full pt-20 sm:pt-24 pb-16">
      <InteractiveLoadingScreen
        context="general"
        title="Mempersiapkan Etalase LapakKita"
        subtitle="Memuat kurasi produk UMKM lokal pilihan untuk Anda..."
      />
    </div>
  )
}
