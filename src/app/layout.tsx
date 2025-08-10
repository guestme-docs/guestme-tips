import type { Metadata } from 'next'
import './globals.css'
import { Inter, Inter_Tight } from 'next/font/google'
import NavigationErrorBoundary from '@/components/NavigationErrorBoundary'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const interDisplay = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-display' })

export const metadata: Metadata = {
  title: 'GuestMe Tips',
  description: 'Чаевые и отзывы для вашего бизнеса. Прототип GuestMe.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${interDisplay.variable}`}>
      <body className="min-h-dvh bg-white text-neutral-900 antialiased">
        <NavigationErrorBoundary>
          {children}
        </NavigationErrorBoundary>
      </body>
    </html>
  )
}