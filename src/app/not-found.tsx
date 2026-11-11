import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Store, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#186049]/15 text-[#186049] dark:text-[#ECE8AF] border border-[#186049]/20 mb-4">
        <Store className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#186049] dark:text-[#ECE8AF] font-serif tracking-tight sm:text-5xl">404</h1>
      <h2 className="mt-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">Halaman atau Produk Tidak Ditemukan</h2>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
        Produk yang Anda cari mungkin telah dihapus, belum disetujui, atau tautan yang Anda buka keliru.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild className="bg-[#186049] hover:bg-[#124b39] text-[#ECE8AF] border border-[#ECE8AF]/20">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Katalog
          </Link>
        </Button>
      </div>
    </div>
  )
}
