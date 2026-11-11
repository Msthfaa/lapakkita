import { CuteLapakLoader } from '@/components/cute-lapak-loader'

export default function ModerasiLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <CuteLapakLoader
        message="Memuat Antrean Moderasi..."
        subMessage="Mengambil berkas dan data produk UMKM untuk diverifikasi..."
      />
    </div>
  )
}
