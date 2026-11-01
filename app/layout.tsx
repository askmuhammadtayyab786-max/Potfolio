import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ChatWidget } from '@/components/chat-widget'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tayyab Latif | DevOps, DevSecOps & Cloud Engineer',
  description: 'Portfolio of Tayyab Latif, a DevOps, DevSecOps and Cloud engineer in Islamabad, Pakistan, automating CI/CD, cloud infrastructure, and security for fast, safe software delivery.',
  generator: 'v0.app',
  metadataBase: new URL('https://tayyabdevsecops.duckdns.org'),
  openGraph: {
    title: 'Muhammad Tayyab | DevSecOps & Infrastructure Engineer',
    description: 'Production infrastructure, DevSecOps pipelines and cloud projects: Kubernetes, Terraform on AWS, Jenkins CI/CD, pfSense HA and VMware vSphere.',
    url: 'https://tayyabdevsecops.duckdns.org',
    siteName: 'Muhammad Tayyab — Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 627, alt: 'Muhammad Tayyab — DevSecOps & Infrastructure Engineer' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Tayyab | DevSecOps & Infrastructure Engineer',
    description: 'Production infrastructure, DevSecOps pipelines and cloud projects.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#081018' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <ChatWidget />
        <Toaster theme="dark" position="bottom-right" closeButton offset={{ right: 24, bottom: 100 }} mobileOffset={{ right: 16, left: 16, bottom: 88 }} toastOptions={{ className: 'portfolio-toast' }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
