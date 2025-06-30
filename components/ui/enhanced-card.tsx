"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "floating"
  interactive?: boolean
  children: React.ReactNode
}

export function EnhancedCard({
  className,
  variant = "default",
  interactive = false,
  children,
  ...props
}: EnhancedCardProps) {
  const baseClasses = "rounded-2xl border transition-all duration-300"

  const variantClasses = {
    default: "bg-card text-card-foreground border-border shadow-sm",
    glass: "glass-card text-card-foreground",
    gradient: "gradient-primary text-white border-transparent shadow-lg",
    floating: "bg-card text-card-foreground border-border shadow-lg animate-float",
  }

  const interactiveClasses = interactive ? "interactive-hover cursor-pointer hover:shadow-xl hover:scale-[1.02]" : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(baseClasses, variantClasses[variant], interactiveClasses, className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function EnhancedCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}

export function EnhancedCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export function EnhancedCardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
}
