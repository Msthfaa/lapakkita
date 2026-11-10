/**
 * Fungsi untuk menormalisasi dan memvalidasi nomor WhatsApp Indonesia.
 * Aturan:
 * 1. Buang semua karakter non-digit.
 * 2. Jika diawali '0', ganti dengan '62'.
 * 3. Jika diawali '8', tambahkan '62' di depan.
 * 4. Jika sudah diawali '62', biarkan.
 * 5. Panjang digit hasil normalisasi harus di antara 10 sampai 15 digit.
 */
export function normalizeWhatsappNumber(raw: string): string | null {
  if (!raw) return null

  // Buang semua karakter non-digit
  let cleaned = raw.replace(/\D/g, '')

  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned
  }

  // Validasi format: harus diawali 62 dan total panjang 10-15 digit
  if (/^62[0-9]{8,13}$/.test(cleaned)) {
    return cleaned
  }

  return null
}

/**
 * Menghasilkan URL direct link WhatsApp dengan pesan otomatis.
 */
export function buildWhatsappLink(nomor: string, namaProduk: string): string {
  const normalized = normalizeWhatsappNumber(nomor) || nomor
  const pesan = `Halo, saya tertarik dengan produk *${namaProduk}* yang saya lihat di LapakKita`
  return `https://wa.me/${normalized}?text=${encodeURIComponent(pesan)}`
}
