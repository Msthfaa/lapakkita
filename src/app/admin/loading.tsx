import { InteractiveLoadingScreen } from '@/components/interactive-loading-screen'

export default function AdminLoading() {
  return (
    <div className="w-full">
      <InteractiveLoadingScreen
        context="admin"
        title="Menyiapkan Panel Administrator"
        subtitle="Memuat antrean moderasi produk, grafik mingguan, dan direktori UMKM..."
      />
    </div>
  )
}
