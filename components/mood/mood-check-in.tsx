"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoodSelector } from "@/components/ui/mood-selector";
import { Heart, Sparkles, Camera, Mic } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

interface MoodCheckInProps {
  onCrisisDetected: () => void;
}

export function MoodCheckIn({ onCrisisDetected }: MoodCheckInProps) {
  const today = new Date().toISOString().split("T")[0];
  const [todaysMood, setTodaysMood] = useLocalStorage(`mood-${today}`, null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const detectCrisis = (text: string): boolean => {
    const crisisKeywords = [
      "kill myself",
      "end it all",
      "want to die",
      "suicide",
      "hurt myself",
    ];
    return crisisKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );
  };

  const handleSave = () => {
    if (selectedMood) {
      if (note && detectCrisis(note)) {
        onCrisisDetected();
      }

      const moodEntry = {
        mood: selectedMood,
        note: note.trim(),
        timestamp: Date.now(),
      };

      setTodaysMood(moodEntry);
      setSelectedMood(null);
      setNote("");
      setShowNote(false);

      toast({
        title: "Mood saved! 🌱",
        description: "Your daily check-in helps your garden grow.",
      });
    }
  };

  if (todaysMood) {
    return (
      <EnhancedCard variant="gradient" className="text-center">
        <EnhancedCardContent className="p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            {["😢", "😔", "😐", "🙂", "😊"][todaysMood.mood - 1]}
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">
            Today's Check-in Complete!
          </h3>
          <p className="text-white/80 mb-4">
            Feeling:{" "}
            {
              ["Struggling", "Down", "Okay", "Good", "Great"][
                todaysMood.mood - 1
              ]
            }
          </p>
          {todaysMood.note && (
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-sm italic">"{todaysMood.note}"</p>
            </div>
          )}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Your garden is growing!</span>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard variant="glass">
      <EnhancedCardHeader className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Heart className="h-12 w-12 text-bloom-primary mx-auto mb-4" />
        </motion.div>
        <EnhancedCardTitle>How are you feeling today?</EnhancedCardTitle>
        <p className="text-muted-foreground">
          Your daily check-in helps track your emotional journey
        </p>
      </EnhancedCardHeader>

      <EnhancedCardContent>
        <div className="space-y-6">
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />

          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNote(!showNote)}
                    className="flex-1"
                  >
                    {showNote ? "Hide Note" : "Add a note"}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsRecording(!isRecording)}
                    className={isRecording ? "bg-red-500 text-white" : ""}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>

                {showNote && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <Textarea
                      placeholder="What's on your mind? How are you feeling right now?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="resize-none min-h-[100px] text-gray-950"
                      rows={4}
                    />
                  </motion.div>
                )}

                <Button
                  onClick={handleSave}
                  className="w-full gradient-primary text-white font-semibold py-3"
                  size="lg"
                >
                  Save My Check-in ✨
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}
