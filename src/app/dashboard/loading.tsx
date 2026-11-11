import { InteractiveLoadingScreen } from '@/components/interactive-loading-screen'

export default function DashboardLoading() {
  return (
    <div className="w-full">
      <InteractiveLoadingScreen
        context="dashboard"
        title="Menyiapkan Dashboard Toko Anda"
        subtitle="Menyinkronkan data produk, analitik kunjungan, dan direktori WhatsApp..."
      />
    </div>
  )
}
