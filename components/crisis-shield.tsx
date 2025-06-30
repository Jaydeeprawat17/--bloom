"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, MessageCircle, X, Heart } from "lucide-react"

interface CrisisShieldProps {
  isVisible: boolean
  onDismiss: () => void
}

const hotlines = [
  {
    country: "India",
    name: "AASRA",
    phone: "91-9820466726",
    hours: "24/7",
  },
  {
    country: "US/Canada",
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    hours: "24/7",
  },
  {
    country: "UK",
    name: "Samaritans",
    phone: "116 123",
    hours: "24/7",
  },
]

export function CrisisShield({ isVisible, onDismiss }: CrisisShieldProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-danger text-white shadow-soft-lg"
        >
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">You're Not Alone - Help is Here</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  If you're having thoughts of self-harm, please reach out for support immediately. You matter, your
                  life has value, and there are people who want to help.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {hotlines.map((hotline, index) => (
                    <Card key={index} className="p-4 bg-white text-text-primary border-0 shadow-soft">
                      <div className="text-xs font-medium text-text-muted mb-1">{hotline.country}</div>
                      <div className="font-semibold text-sm mb-2">{hotline.name}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-4 h-4 text-healing-mint" />
                        <a
                          href={`tel:${hotline.phone}`}
                          className="font-bold text-healing-mint hover:underline text-lg"
                        >
                          {hotline.phone}
                        </a>
                      </div>
                      <div className="text-xs text-text-muted">{hotline.hours}</div>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={onDismiss}
                    className="bg-white text-text-primary hover:bg-white/90 border-white shadow-soft"
                  >
                    I'm safe for now
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-white text-text-primary hover:bg-white/90 shadow-soft"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Talk to AI Friend
                  </Button>
                  <span className="text-white/80 text-sm">Crisis support is always available</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-white hover:bg-white/20 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
