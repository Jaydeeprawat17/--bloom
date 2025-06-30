"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, Target, Award, Sparkles, ChevronRight } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function DailyInsights() {
  const [streak] = useLocalStorage("mood-streak", 0)
  const [totalMoods] = useLocalStorage("total-moods", 0)
  const [weeklyGoal, setWeeklyGoal] = useLocalStorage("weekly-goal", 5)
  const [achievements, setAchievements] = useLocalStorage("achievements", [])

  const insights = [
    {
      icon: TrendingUp,
      title: "Mood Trend",
      value: "Improving",
      description: "Your mood has been trending upward this week",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: Calendar,
      title: "Check-in Streak",
      value: `${streak} days`,
      description: "Keep up the consistent self-care!",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Target,
      title: "Weekly Goal",
      value: `${Math.min(totalMoods, weeklyGoal)}/${weeklyGoal}`,
      description: "Mood check-ins completed this week",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ]

  const recentAchievements = [
    {
      id: "first-checkin",
      title: "First Steps",
      description: "Completed your first mood check-in",
      icon: "🌱",
      unlocked: totalMoods >= 1,
    },
    {
      id: "week-streak",
      title: "Week Warrior",
      description: "7-day check-in streak",
      icon: "🔥",
      unlocked: streak >= 7,
    },
    {
      id: "month-milestone",
      title: "Monthly Milestone",
      description: "30 mood check-ins completed",
      icon: "🏆",
      unlocked: totalMoods >= 30,
    },
    {
      id: "consistency-king",
      title: "Consistency Champion",
      description: "14-day check-in streak",
      icon: "👑",
      unlocked: streak >= 14,
    },
  ]

  const motivationalQuotes = [
    "Every small step forward is progress worth celebrating.",
    "Your mental health journey is unique and valuable.",
    "Consistency in self-care creates lasting positive change.",
    "You're building resilience one day at a time.",
    "Growth happens in the quiet moments of self-reflection.",
  ]

  const [todaysQuote] = useState(() => {
    const today = new Date().getDate()
    return motivationalQuotes[today % motivationalQuotes.length]
  })

  return (
    <div className="space-y-4">
      {/* Daily Quote */}
      <Card className="bg-gradient-to-r from-bloom-primary/10 to-bloom-secondary/10 border-bloom-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-bloom-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-foreground mb-1">Daily Inspiration</h3>
              <p className="text-sm text-muted-foreground italic">"{todaysQuote}"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${insight.bgColor} flex items-center justify-center`}>
                    <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <span className="text-lg font-bold text-foreground">{insight.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-bloom-accent" />
            <h3 className="font-semibold text-foreground">Achievements</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {recentAchievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  achievement.unlocked ? "bg-bloom-soft border border-bloom-primary/20" : "bg-muted/30 opacity-60"
                }`}
              >
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && <div className="w-2 h-2 bg-bloom-primary rounded-full animate-pulse"></div>}
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-bloom-primary hover:bg-bloom-primary/10"
            onClick={() => (window.location.href = "/insights")}
          >
            View All Progress
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground mb-3">This Week</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-bloom-primary">{Math.min(totalMoods, 7)}</div>
              <div className="text-xs text-muted-foreground">Check-ins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bloom-secondary">{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
