import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { TopLoadingBar } from '@/components/top-loading-bar'
import { getUserAndProfile } from '@/features/auth/actions'
import { Toaster } from 'sonner'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants'
import { Suspense } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: `${SITE_NAME} - ${SITE_TAGLINE}`,
  description:
    'Etalase digital produk UMKM lokal terverifikasi. Dukung pengusaha lokal, hubungi langsung via WhatsApp tanpa perantara.',
}

async function NavbarSlot() {
  const { user, profile } = await getUserAndProfile()
  return <Navbar user={user} profile={profile} />
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900 font-sans">
        <Suspense fallback={null}>
          <TopLoadingBar />
        </Suspense>
        <Suspense fallback={<div className="h-16 w-full border-b border-neutral-200 bg-white" />}>
          <NavbarSlot />
        </Suspense>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 bg-white py-6 text-center text-xs text-neutral-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p>
              &copy; 2026 <strong>{SITE_NAME}</strong> &mdash; {SITE_TAGLINE}. Platform etalase promosi UMKM lokal.
            </p>
          </div>
        </footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
