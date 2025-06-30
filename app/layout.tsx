import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bloom - You're not alone. Let yourself grow.",
  description:
    "A gentle mental health companion that helps you track your mood, grow your garden, and connect with caring AI friends.",
  manifest: "/manifest.json",
  themeColor: "#6C63FF",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-bg text-text">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
