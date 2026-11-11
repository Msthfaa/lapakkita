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
 * Format angka ke format ribuan dengan titik untuk input form.
 * Contoh: 120000 -> "120.000", 1500000 -> "1.500.000"
 */
export function formatRibuanInput(val: number | string): string {
  if (val === '' || val === null || val === undefined) return ''
  const cleanDigits = String(val).replace(/\D/g, '')
  if (!cleanDigits) return ''
  return new Intl.NumberFormat('id-ID').format(Number(cleanDigits))
}

/**
 * Konversi teks berformat ribuan (contoh: "120.000") menjadi angka murni (120000).
 */
export function parseRibuanInput(val: string): number {
  if (!val) return 0
  const cleanDigits = String(val).replace(/\D/g, '')
  return cleanDigits ? Number(cleanDigits) : 0
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
