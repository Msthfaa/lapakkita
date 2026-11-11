import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { FloatingRouteLoader } from '@/components/floating-route-loader'
import { PublicFooter } from '@/components/public-footer'
import { getUserAndProfile } from '@/features/auth/actions'
import { Toaster } from 'sonner'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

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
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Suspense fallback={null}>
            <FloatingRouteLoader />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-16 w-full border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-black" />
            }
          >
            <NavbarSlot />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <PublicFooter />
          </Suspense>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
