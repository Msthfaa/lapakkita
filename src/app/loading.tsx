import { InteractiveLoadingScreen } from '@/components/interactive-loading-screen'

export default function Loading() {
  return (
    <div className="w-full">
      <InteractiveLoadingScreen
        context="general"
        title="Mempersiapkan Etalase LapakKita"
        subtitle="Memuat kurasi produk UMKM lokal pilihan untuk Anda..."
      />
    </div>
  )
}
