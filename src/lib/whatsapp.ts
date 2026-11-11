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

export interface WhatsappDetails {
  harga?: number
  satuan?: string
  kondisiStok?: string
  varian?: string
  jumlah?: number
}

/**
 * Menghasilkan URL direct link WhatsApp dengan format pemesanan resmi terstruktur.
 */
export function buildWhatsappLink(
  nomor: string,
  namaProduk: string,
  details?: WhatsappDetails
): string {
  const normalized = normalizeWhatsappNumber(nomor) || nomor
  let pesan = `Halo, saya ingin memesan *${namaProduk}* via LapakKita.`

  if (details?.varian) {
    pesan += `\n*Pilihan Varian:* ${details.varian}`
  }

  if (details?.jumlah && details.jumlah > 1) {
    pesan += `\n*Jumlah:* ${details.jumlah}`
  }

  if (details?.harga) {
    const qty = details.jumlah || 1
    const totalHarga = details.harga * qty
    const formattedHarga = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(details.harga)
    const satuanText = details.satuan ? ` / ${details.satuan}` : ''

    if (qty > 1) {
      const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(totalHarga)
      pesan += `\n*Harga Satuan:* ${formattedHarga}${satuanText}`
      pesan += `\n*Total Estimasi:* ${formattedTotal}`
    } else {
      pesan += `\n*Harga:* ${formattedHarga}${satuanText}`
    }
  }

  if (details?.kondisiStok) {
    const stokText =
      details.kondisiStok === 'pre_order'
        ? 'Pre-Order (PO)'
        : details.kondisiStok === 'stok_terbatas'
          ? 'Stok Terbatas'
          : 'Ready Stock'
    pesan += `\n*Status Stok:* ${stokText}`
  }

  pesan += `\n\nMohon informasi ketersediaan stok & proses pemesanannya. Terima kasih!`
  return `https://wa.me/${normalized}?text=${encodeURIComponent(pesan)}`
}
