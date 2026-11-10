export const SITE_NAME = 'LapakKita'
export const SITE_TAGLINE = 'Etalase Digital Produk UMKM Lokal'
export const SITE_DESCRIPTION =
  'LapakKita membantu UMKM lokal memasang produk terverifikasi agar mudah ditemukan dan langsung terhubung dengan calon pembeli via WhatsApp.'

export const MAX_PHOTO_SIZE = 2 * 1024 * 1024 // 2 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const PRODUCT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export type ProductStatus = typeof PRODUCT_STATUSES[keyof typeof PRODUCT_STATUSES]

export const ITEMS_PER_PAGE = 12
export const MAX_FEATURED_PRODUCTS = 6
