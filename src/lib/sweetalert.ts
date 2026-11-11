'use client'

import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Color Palette Reference:
// #186049 (Deep Pine Green - Primary)
// #4A943E (Fresh Leaf Green - Accent/Success)
// #D98327 (Warm Terracotta Ochre - Warning/Delete)
// #ECE8AF (Soft Cream Vanilla - Subtle warm tint)

function isDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

/**
 * SweetAlert Konfirmasi Aksi (misal Setujui Produk, Ubah Data)
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
    buttonsStyling: false,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    iconColor: icon === 'warning' ? '#D98327' : '#186049',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      confirmButton: 'lapak-swal-btn-pine',
      cancelButton: 'lapak-swal-btn-secondary',
      actions: 'lapak-swal-actions',
    },
  })

  return res.isConfirmed
}

/**
 * SweetAlert Khusus Konfirmasi Hapus Data (Destructive / Danger)
 * Ramah, jelas, dengan peringatan hangat menggunakan warna #D98327
 */
export async function swalDeleteConfirm({
  title = 'Konfirmasi Hapus Data',
  text = 'Tindakan ini permanen dan tidak dapat dibatalkan.',
  confirmButtonText = 'Ya, Hapus Sekarang',
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
    buttonsStyling: false,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    iconColor: '#D98327',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      confirmButton: 'lapak-swal-btn-danger',
      cancelButton: 'lapak-swal-btn-secondary',
      actions: 'lapak-swal-actions',
    },
  })

  return res.isConfirmed
}

/**
 * SweetAlert Sukses (Friendly & Cute Bouncing Animation)
 */
export async function swalSuccess({
  title,
  text,
  timer = 2400,
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
    buttonsStyling: false,
    timer: showConfirmButton ? undefined : timer,
    timerProgressBar: !showConfirmButton,
    showConfirmButton,
    confirmButtonText,
    iconColor: '#4A943E',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      confirmButton: 'lapak-swal-btn-pine',
      actions: 'lapak-swal-actions',
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
    buttonsStyling: false,
    confirmButtonText: 'Tutup',
    iconColor: '#DC2626',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      confirmButton: 'lapak-swal-btn-secondary',
      actions: 'lapak-swal-actions',
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
    buttonsStyling: false,
    confirmButtonText: 'Mengerti',
    iconColor: '#186049',
    customClass: {
      popup: 'lapak-swal-popup',
      title: 'lapak-swal-title',
      htmlContainer: 'lapak-swal-html',
      confirmButton: 'lapak-swal-btn-pine',
      actions: 'lapak-swal-actions',
    },
  })
}

export default Swal
