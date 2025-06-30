"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flower2, Heart, MessageCircle, Users } from "lucide-react"

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bloom-soft to-bloom-mint flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-lg w-full text-center"
      >
        <Card className="backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Logo Animation */}
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
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto floating-gradient rounded-full flex items-center justify-center shadow-lg">
                <Flower2 className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-bloom-primary mb-4">Welcome to Bloom</h1>
              <p className="text-lg font-medium mb-2">You're not alone. Let yourself grow.</p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                A gentle companion for your mental health journey. Track your mood, chat with caring AI friends, and
                connect with a supportive community.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-bloom-soft rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-bloom-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Daily Check-ins</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-bloom-mint rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="h-6 w-6 text-bloom-secondary" />
                </div>
                <p className="text-xs text-muted-foreground">AI Support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-bloom-peach rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-bloom-accent" />
                </div>
                <p className="text-xs text-muted-foreground">Community</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Button
                onClick={onComplete}
                className="w-full floating-gradient text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                size="lg"
              >
                Begin Your Journey
              </Button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-6 text-xs text-muted-foreground"
            >
              <p>Safe • Private • Always here for you</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
