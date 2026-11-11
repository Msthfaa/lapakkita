import { CuteLapakLoader } from '@/components/cute-lapak-loader'

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <CuteLapakLoader
        message="Menyiapkan Panel Administrator..."
        subMessage="Sedang memuat data kurasi, metrik UMKM, dan grafik aktivitas..."
      />
    </div>
  )
}
