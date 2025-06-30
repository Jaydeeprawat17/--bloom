"use client"

import { Badge } from "@/components/ui/badge"

import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Flower2, MessageCircle, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full glass border-b border-border/50"
    >
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-3">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg">
              <Flower2 className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl gradient-primary opacity-50 blur-lg animate-pulse-glow" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-bloom-primary to-bloom-secondary bg-clip-text text-transparent">
              Bloom
            </h1>
            <p className="text-xs text-muted-foreground">You're not alone. Let yourself grow.</p>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          <Link href="/chat">
            <Button variant="ghost" size="sm" className="relative group">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Chat</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                AI
              </Badge>
            </Button>
          </Link>

          <Link href="/insights">
            <Button variant="ghost" size="sm" className="relative group">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Insights</span>
            </Button>
          </Link>

          <Link href="/exercises">
            <Button variant="ghost" size="sm" className="relative group">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exercises</span>
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
