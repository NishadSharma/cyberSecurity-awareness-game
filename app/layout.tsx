import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/navigation'
import { AuthProvider } from '@/hooks/use-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CyberGuard - Cybersecurity Awareness Game',
  description: 'Learn cybersecurity through interactive games and scenarios. Play. Learn. Stay Secure.',
  keywords: 'cybersecurity, security awareness, training, games, education',
  authors: [{ name: 'CyberGuard Team' }],
  openGraph: {
    title: 'CyberGuard - Cybersecurity Awareness Game',
    description: 'Master cybersecurity through interactive games and scenarios',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen antialiased`}>
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Cyberpunk background pattern */}
            <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-emerald-900/20 pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              <Navigation />
              <main>{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}