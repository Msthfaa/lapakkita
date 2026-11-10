/**
 * Format angka ke format Rupiah standar Indonesia tanpa desimal.
 * Contoh: 25000 -> "Rp 25.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format tanggal ke format tanggal Indonesia.
 * Contoh: "10 November 2026"
 */
export function formatTanggal(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
