"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MessageSquare, X, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Story {
  id: string
  content: string
  timestamp: number
}

export function CommunityStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [showNewStory, setShowNewStory] = useState(false)
  const [newStoryContent, setNewStoryContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = () => {
    const savedStories = localStorage.getItem("community-stories")
    let existingStories: Story[] = []

    if (savedStories) {
      try {
        existingStories = JSON.parse(savedStories)
      } catch (e) {
        console.error("Error parsing stories:", e)
      }
    }

    if (existingStories.length === 0) {
      existingStories = [
        {
          id: "1",
          content: "I smiled today for the first time in a week. It was small, but it felt huge.",
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
        },
        {
          id: "2",
          content: "Called my mom instead of isolating. She reminded me I'm loved.",
          timestamp: Date.now() - 5 * 60 * 60 * 1000,
        },
        {
          id: "3",
          content: "Made my bed this morning. It's not much, but it's something I could control.",
          timestamp: Date.now() - 8 * 60 * 60 * 1000,
        },
        {
          id: "4",
          content: "Went for a 10-minute walk. The fresh air reminded me I'm still here.",
          timestamp: Date.now() - 24 * 60 * 60 * 1000,
        },
      ]
    }

    setStories(existingStories.sort((a, b) => b.timestamp - a.timestamp))
    setIsLoading(false)
  }

  const handleSubmitStory = () => {
    if (!newStoryContent.trim() || newStoryContent.length > 150) return

    const lastPost = localStorage.getItem("last-story-post")
    const now = Date.now()
    if (lastPost && now - Number.parseInt(lastPost) < 12 * 60 * 60 * 1000) {
      toast({
        title: "Please wait",
        description: "You can share another story in a few hours.",
        variant: "destructive",
      })
      return
    }

    const newStory: Story = {
      id: Date.now().toString(),
      content: newStoryContent.trim(),
      timestamp: now,
    }

    const updatedStories = [newStory, ...stories]
    setStories(updatedStories)
    localStorage.setItem("community-stories", JSON.stringify(updatedStories))
    localStorage.setItem("last-story-post", now.toString())

    setNewStoryContent("")
    setShowNewStory(false)

    toast({
      title: "Story shared! 💚",
      description: "Thank you for sharing your growth with the community.",
    })
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diffInHours = Math.floor((now - timestamp) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-bloom-secondary" />
            <h3 className="text-xl font-semibold text-foreground">Community Growth Stories</h3>
          </div>
          <Button
            onClick={() => setShowNewStory(true)}
            size="sm"
            className="bg-bloom-secondary hover:bg-bloom-secondary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence>
          {showNewStory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Share Your Growth</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowNewStory(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    value={newStoryContent}
                    onChange={(e) => setNewStoryContent(e.target.value)}
                    placeholder="Share a small victory, moment of hope, or step forward..."
                    className="mb-3 resize-none"
                    rows={3}
                    maxLength={150}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{newStoryContent.length}/150 characters</span>
                    <Button
                      onClick={handleSubmitStory}
                      disabled={!newStoryContent.trim() || newStoryContent.length > 150}
                      size="sm"
                      className="bg-bloom-secondary hover:bg-bloom-secondary/90"
                    >
                      Share Anonymously
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-bloom-secondary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-foreground">Anonymous</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(story.timestamp)}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">{story.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {stories.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Be the first to share your growth story!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
