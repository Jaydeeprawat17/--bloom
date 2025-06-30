"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MessageSquare, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Story {
  id: string
  body: string
  created_at: string
  user_id: string
}

export function CommunityStoriesFeed() {
  const [stories, setStories] = useState<Story[]>([])
  const [showNewPost, setShowNewPost] = useState(false)
  const [newStory, setNewStory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      // Simulate loading from Supabase
      const mockStories: Story[] = [
        {
          id: "1",
          body: "I called a friend instead of isolating today. Small step, but it felt huge.",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user_id: "anonymous",
        },
        {
          id: "2",
          body: "Went for a 10-minute walk. The fresh air reminded me that I'm still here and that matters.",
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          user_id: "anonymous",
        },
        {
          id: "3",
          body: "Made my bed this morning. It's not much, but it's something I can control.",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user_id: "anonymous",
        },
      ]

      setStories(mockStories)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading stories:", error)
      setIsLoading(false)
    }
  }

  const handleSubmitStory = async () => {
    if (!newStory.trim() || newStory.length > 250) return

    // Rate limiting check
    const lastPost = localStorage.getItem("last_community_post")
    const now = Date.now()
    if (lastPost && now - Number.parseInt(lastPost) < 12 * 60 * 60 * 1000) {
      toast({
        title: "Please wait",
        description: "You can share another story in a few hours.",
        variant: "destructive",
      })
      return
    }

    try {
      const newStoryObj: Story = {
        id: Date.now().toString(),
        body: newStory.trim(),
        created_at: new Date().toISOString(),
        user_id: "anonymous",
      }

      setStories((prev) => [newStoryObj, ...prev])
      setNewStory("")
      setShowNewPost(false)
      localStorage.setItem("last_community_post", now.toString())

      toast({
        title: "Story shared",
        description: "Thank you for sharing your growth with the community.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share your story. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h2 font-semibold">How Others Are Growing</h3>
        <Button onClick={() => setShowNewPost(true)} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Share Your Story
        </Button>
      </div>

      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Share Your Growth</h4>
                <Button variant="ghost" size="sm" onClick={() => setShowNewPost(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                value={newStory}
                onChange={(e) => setNewStory(e.target.value)}
                placeholder="Share a small victory, a moment of hope, or a step forward..."
                className="mb-3 resize-none"
                rows={3}
                maxLength={250}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">{newStory.length}/250 characters</span>
                <Button onClick={handleSubmitStory} disabled={!newStory.trim() || newStory.length > 250} size="sm">
                  Share Anonymously
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-border rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-border rounded animate-pulse"></div>
                    <div className="h-4 bg-border rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-border rounded animate-pulse w-1/4"></div>
                  </div>
                </div>
              </Card>
            ))
          : stories.map((story) => (
              <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} layout>
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-muted mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Anonymous</span>
                        <span className="text-xs text-muted">•</span>
                        <span className="text-xs text-muted">{formatTimeAgo(story.created_at)}</span>
                      </div>
                      <p className="text-sm leading-relaxed">"{story.body}"</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  )
}
