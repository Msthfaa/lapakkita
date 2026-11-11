'use client'

import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Color Palette Reference:
// #186049 (Deep Pine Green - Primary)
// #4A943E (Fresh Leaf Green - Accent / Success)
// #D98327 (Warm Terracotta Ochre - Warning / Delete)
// #ECE8AF (Soft Cream Vanilla - Subtle Warm Tint)

function isDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

/**
 * Injeksi inline style langsung ke elemen tombol & popup SweetAlert2
 * untuk menjamin tampilan selalu rapi, berjarak, dan tidak pernah unstyled/cacat
 * tanpa bergantung pada bundle CSS eksternal.
 */
function applyButtonStyles(
  popup: HTMLElement,
  options: {
    confirmBg: string
    cancelBg?: string
    isDark?: boolean
  }
) {
  popup.style.borderRadius = '24px'
  popup.style.padding = '28px 24px 24px'
  popup.style.fontFamily = 'inherit'
  popup.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.35)'

  const actions = popup.querySelector<HTMLElement>('.swal2-actions')
  if (actions) {
    actions.style.display = 'flex'
    actions.style.flexDirection = 'row'
    actions.style.alignItems = 'center'
    actions.style.justifyContent = 'center'
    actions.style.gap = '12px'
    actions.style.marginTop = '24px'
    actions.style.width = '100%'
  }

  const confirmBtn = popup.querySelector<HTMLButtonElement>('.swal2-confirm')
  if (confirmBtn) {
    confirmBtn.style.backgroundColor = options.confirmBg
    confirmBtn.style.color = '#FFFFFF'
    confirmBtn.style.borderRadius = '14px'
    confirmBtn.style.padding = '12px 24px'
    confirmBtn.style.fontSize = '14px'
    confirmBtn.style.fontWeight = '700'
    confirmBtn.style.border = 'none'
    confirmBtn.style.outline = 'none'
    confirmBtn.style.cursor = 'pointer'
    confirmBtn.style.boxShadow = `0 4px 14px ${options.confirmBg}66`
    confirmBtn.style.transition = 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    confirmBtn.style.margin = '0'
    confirmBtn.style.lineHeight = '1.25'
  }

  const cancelBtn = popup.querySelector<HTMLButtonElement>('.swal2-cancel')
  if (cancelBtn) {
    const bg = options.cancelBg || (options.isDark ? '#27272A' : '#E4E4E7')
    const color = options.isDark ? '#F4F4F5' : '#27272A'
    cancelBtn.style.backgroundColor = bg
    cancelBtn.style.color = color
    cancelBtn.style.borderRadius = '14px'
    cancelBtn.style.padding = '12px 22px'
    cancelBtn.style.fontSize = '14px'
    cancelBtn.style.fontWeight = '600'
    cancelBtn.style.border = 'none'
    cancelBtn.style.outline = 'none'
    cancelBtn.style.cursor = 'pointer'
    cancelBtn.style.transition = 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    cancelBtn.style.margin = '0'
    cancelBtn.style.lineHeight = '1.25'
  }
}

/**
 * SweetAlert Konfirmasi Aksi (misal Setujui Produk, Verifikasi, dll.)
 */
export async function swalConfirm({
  title,
  text,
  confirmButtonText = 'Ya, Lanjutkan',
  cancelButtonText = 'Batal',
  icon = 'question',
}: {
  title: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
  icon?: SweetAlertIcon
}): Promise<boolean> {
  const dark = isDark()

  const res: SweetAlertResult = await Swal.fire({
    icon,
    title,
    text,
    background: dark ? '#0A120E' : '#FFFFFF',
    color: dark ? '#F3F4F6' : '#111827',
    showCancelButton: true,
    buttonsStyling: true,
    confirmButtonColor: '#186049',
    cancelButtonColor: dark ? '#27272A' : '#6B7280',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    iconColor: icon === 'warning' ? '#D98327' : '#186049',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      actions: 'lapak-swal-actions',
      confirmButton: 'lapak-swal-btn-pine',
      cancelButton: 'lapak-swal-btn-secondary',
    },
    didOpen: (popup: HTMLElement) => {
      applyButtonStyles(popup, {
        confirmBg: '#186049',
        isDark: dark,
      })
    },
  })

  return res.isConfirmed
}

/**
 * SweetAlert Khusus Konfirmasi Hapus Data (Destructive / Danger)
 * Menggunakan aksen Terracotta Ochre (#D98327) dengan tombol tegas & ramah
 */
export async function swalDeleteConfirm({
  title = 'Konfirmasi Hapus Data',
  text = 'Tindakan ini permanen dan tidak dapat dibatalkan.',
  confirmButtonText = 'Ya, Hapus Data',
  cancelButtonText = 'Batal',
}: {
  title?: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
}): Promise<boolean> {
  const dark = isDark()

  const res: SweetAlertResult = await Swal.fire({
    icon: 'warning',
    title,
    text,
    background: dark ? '#0A120E' : '#FFFFFF',
    color: dark ? '#F3F4F6' : '#111827',
    showCancelButton: true,
    buttonsStyling: true,
    confirmButtonColor: '#D98327',
    cancelButtonColor: dark ? '#27272A' : '#6B7280',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    iconColor: '#D98327',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      actions: 'lapak-swal-actions',
      confirmButton: 'lapak-swal-btn-danger',
      cancelButton: 'lapak-swal-btn-secondary',
    },
    didOpen: (popup: HTMLElement) => {
      applyButtonStyles(popup, {
        confirmBg: '#D98327',
        isDark: dark,
      })
    },
  })

  return res.isConfirmed
}

/**
 * SweetAlert Sukses (Cepat, Ringan & Non-blocking)
 * Default timer 1200ms agar aplikasi terasa gesit dan tidak menunda reload
 */
export async function swalSuccess({
  title,
  text,
  timer = 1200,
  showConfirmButton = false,
  confirmButtonText = 'Selesai',
}: {
  title: string
  text?: string
  timer?: number
  showConfirmButton?: boolean
  confirmButtonText?: string
}): Promise<SweetAlertResult> {
  const dark = isDark()

  return Swal.fire({
    icon: 'success',
    title,
    text,
    background: dark ? '#0A120E' : '#FFFFFF',
    color: dark ? '#F3F4F6' : '#111827',
    buttonsStyling: true,
    confirmButtonColor: '#4A943E',
    timer: showConfirmButton ? undefined : timer,
    timerProgressBar: !showConfirmButton,
    showConfirmButton,
    confirmButtonText,
    iconColor: '#4A943E',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      actions: 'lapak-swal-actions',
      confirmButton: 'lapak-swal-btn-leaf',
    },
    didOpen: (popup: HTMLElement) => {
      applyButtonStyles(popup, {
        confirmBg: '#4A943E',
        isDark: dark,
      })
    },
  })
}

/**
 * SweetAlert Gagal / Kendala
 */
export async function swalError({
  title = 'Terjadi Kendala',
  text,
}: {
  title?: string
  text?: string
}): Promise<SweetAlertResult> {
  const dark = isDark()

  return Swal.fire({
    icon: 'error',
    title,
    text: text || 'Silakan coba beberapa saat lagi.',
    background: dark ? '#0A120E' : '#FFFFFF',
    color: dark ? '#F3F4F6' : '#111827',
    buttonsStyling: true,
    confirmButtonColor: '#186049',
    confirmButtonText: 'Tutup',
    iconColor: '#DC2626',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      actions: 'lapak-swal-actions',
      confirmButton: 'lapak-swal-btn-pine',
    },
    didOpen: (popup: HTMLElement) => {
      applyButtonStyles(popup, {
        confirmBg: '#186049',
        isDark: dark,
      })
    },
  })
}

/**
 * SweetAlert Peringatan / Info
 */
export async function swalInfo({
  title,
  text,
}: {
  title: string
  text?: string
}): Promise<SweetAlertResult> {
  const dark = isDark()

  return Swal.fire({
    icon: 'info',
    title,
    text,
    background: dark ? '#0A120E' : '#FFFFFF',
    color: dark ? '#F3F4F6' : '#111827',
    buttonsStyling: true,
    confirmButtonColor: '#186049',
    confirmButtonText: 'Mengerti',
    iconColor: '#186049',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      actions: 'lapak-swal-actions',
      confirmButton: 'lapak-swal-btn-pine',
    },
    didOpen: (popup: HTMLElement) => {
      applyButtonStyles(popup, {
        confirmBg: '#186049',
        isDark: dark,
      })
    },
  })
}

export default Swal
