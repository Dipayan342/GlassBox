import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/toast-provider"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Glassbox AI - AI-Powered Career Intelligence Platform",
  description:
    "Transform your career with advanced AI that analyzes your CV, matches you with perfect jobs, and provides personalized recommendations for skills, education, and career growth.",
  keywords: "AI, career, CV analysis, job matching, skill development, interview preparation",
  authors: [{ name: "Glassbox AI Team" }],
  openGraph: {
    title: "Glassbox AI - AI-Powered Career Intelligence",
    description: "Transform your career with AI-powered CV analysis and job matching",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glassbox AI - AI-Powered Career Intelligence",
    description: "Transform your career with AI-powered CV analysis and job matching",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>{children}</ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
