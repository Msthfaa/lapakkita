import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { FloatingRouteLoader } from '@/components/floating-route-loader'
import { getUserAndProfile } from '@/features/auth/actions'
import { Toaster } from 'sonner'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { NavbarWrapper } from '@/components/navbar-wrapper'
import { LiquidBackground } from '@/components/liquid-background'
import { connection } from 'next/server'

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
  await connection()
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
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { background-color: #FAF9F5; color-scheme: light dark; }
              html.dark { background-color: #000000; }
              body { background-color: #FAF9F5; }
              .dark body { background-color: #000000; }
            `,
          }}
        />
      </head>
      <body className="relative flex min-h-full flex-col bg-[#FAF9F5] dark:bg-[#000000] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-300 selection:bg-[#186049]/30">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* FULL VIEWPORT AMBIENT LIQUID GRADIENT (GRADASI HIJAU & OREN SEPERTI GAMBAR) */}
          <LiquidBackground />

          <Suspense fallback={null}>
            <FloatingRouteLoader />
          </Suspense>

          <Suspense fallback={null}>
            <NavbarWrapper>
              <Suspense
                fallback={
                  <div className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 sm:px-8 lg:px-12 pointer-events-none">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                      <div className="h-11 w-32 rounded-full glass-pill" />
                      <div className="hidden md:block h-12 w-80 rounded-full glass-pill" />
                      <div className="h-11 w-28 rounded-full glass-pill" />
                    </div>
                  </div>
                }
              >
                <NavbarSlot />
              </Suspense>
            </NavbarWrapper>
          </Suspense>
          <main className="relative z-10 flex-1">{children}</main>
          
          {/* Footer Bersih dan Transparan agar Gradasi Terlihat Seperti Gambar yang Diminta */}
          <footer className="relative z-10 border-t border-neutral-200/50 dark:border-neutral-800/60 bg-transparent py-8 text-center text-xs text-neutral-600 dark:text-neutral-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p>
                &copy; 2026 <strong className="text-neutral-900 dark:text-neutral-200">{SITE_NAME}</strong> &mdash; {SITE_TAGLINE}. Platform etalase promosi UMKM lokal.
              </p>
            </div>
          </footer>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
