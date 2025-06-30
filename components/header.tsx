"use client"

import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Flower2, MessageCircle, BarChart3 } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Flower2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Bloom</h1>
            <p className="text-xs text-muted-foreground">You're not alone. Let yourself grow.</p>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          <Link href="/chat">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
          </Link>

          <Link href="/insights">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
