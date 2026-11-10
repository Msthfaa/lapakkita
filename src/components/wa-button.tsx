'use client'

import { buildWhatsappLink } from '@/lib/whatsapp'
import { recordWaClickAction } from '@/features/products/actions'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

interface WaButtonProps {
  productId: string
  noWa: string
  namaProduk: string
  className?: string
  size?: 'default' | 'sm' | 'lg'
}

export function WaButton({
  productId,
  noWa,
  namaProduk,
  className,
  size = 'lg',
}: WaButtonProps) {
  const waUrl = buildWhatsappLink(noWa, namaProduk)

  function handleClick() {
    // Jalankan pencatatan klik secara paralel tanpa menghalangi pembukaan WA
    recordWaClickAction(productId).catch((err) => {
      console.warn('Gagal mencatat klik WA:', err)
    })

    // Buka tautan WhatsApp di tab baru
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      type="button"
      size={size}
      variant="whatsapp"
      onClick={handleClick}
      className={className}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Hubungi via WhatsApp
    </Button>
  )
}
