"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, X, Sparkles } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"

export function BestThingFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

  const [todaysBest, setTodaysBest] = useLocalStorage(`best-thing-${today}`, "")
  const [yesterdaysBest] = useLocalStorage(`best-thing-${yesterday}`, "")
  const [inputValue, setInputValue] = useState(todaysBest)
  const { toast } = useToast()

  const handleSave = () => {
    if (inputValue.trim()) {
      setTodaysBest(inputValue.trim())
      setIsOpen(false)
      toast({
        title: "Gratitude saved! ✨",
        description: "Thank you for finding the good in your day.",
      })
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="floating-gradient w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
          size="lg"
        >
          <Heart className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full floating-gradient flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold">Best Thing Today</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-4">What was one good moment from your day?</p>

                  {yesterdaysBest && (
                    <div className="mb-4 p-3 bg-muted rounded-lg border">
                      <div className="flex items-center space-x-2 mb-1">
                        <Sparkles className="h-3 w-3 text-bloom-accent" />
                        <span className="text-xs text-muted-foreground">Yesterday's best thing:</span>
                      </div>
                      <p className="text-sm italic opacity-75">"{yesterdaysBest}"</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="A smile, a song, a sunset, a kind word..."
                      onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    />

                    <div className="flex space-x-3">
                      <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1">
                        Maybe Later
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={!inputValue.trim()}
                        className="flex-1 bg-bloom-secondary hover:bg-bloom-secondary/90"
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  {!inputValue && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 8 }}
                      className="mt-4 p-3 bg-bloom-peach rounded-lg border border-bloom-accent/20"
                    >
                      <p className="text-xs text-bloom-accent">
                        💡 Stuck? Think of a smell, sound, or small kindness you noticed today.
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
