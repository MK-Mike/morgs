"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart, ChevronDown, ChevronUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Types for difficulty voting
type DifficultyVote = "sandbag" | "staunch" | "stiff" | "fair" | "easy" | "overgraded"

interface VoteCount {
  option: DifficultyVote
  count: number
  percentage: number
}

interface RouteVotingProps {
  routeName: string
  routeGrade: string
  votes: VoteCount[]
  totalVotes: number
  userVote?: DifficultyVote
}

// Helper function to get color based on difficulty vote
const getDifficultyColor = (vote: DifficultyVote): string => {
  switch (vote) {
    case "sandbag":
      return "bg-red-500"
    case "staunch":
      return "bg-orange-500"
    case "stiff":
      return "bg-amber-500"
    case "fair":
      return "bg-green-500"
    case "easy":
      return "bg-blue-500"
    case "overgraded":
      return "bg-purple-500"
    default:
      return "bg-gray-500"
  }
}

// Helper function to get description of difficulty vote
const getDifficultyDescription = (vote: DifficultyVote): string => {
  switch (vote) {
    case "sandbag":
      return "Much harder than the grade suggests"
    case "staunch":
      return "Slightly harder than the grade suggests"
    case "stiff":
      return "On the harder side of the grade"
    case "fair":
      return "Accurately graded"
    case "easy":
      return "On the easier side of the grade"
    case "overgraded":
      return "Easier than the grade suggests"
    default:
      return ""
  }
}

// Mock data for demonstration
const mockData: RouteVotingProps = {
  routeName: "Midnight Lightning",
  routeGrade: "V8",
  totalVotes: 156,
  votes: [
    { option: "sandbag", count: 42, percentage: 27 },
    { option: "staunch", count: 35, percentage: 22 },
    { option: "stiff", count: 28, percentage: 18 },
    { option: "fair", count: 38, percentage: 24 },
    { option: "easy", count: 8, percentage: 5 },
    { option: "overgraded", count: 5, percentage: 3 },
  ],
}

export default function DifficultyConsensus() {
  const [routeData, setRouteData] = useState<RouteVotingProps>(mockData)
  const [showVoteOptions, setShowVoteOptions] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Mock login state

  // Function to handle voting
  const handleVote = (vote: DifficultyVote) => {
    if (!isLoggedIn) return

    // If user already voted, remove their previous vote
    let newVotes = [...routeData.votes]
    let newTotalVotes = routeData.totalVotes

    if (routeData.userVote) {
      const prevVoteIndex = newVotes.findIndex((v) => v.option === routeData.userVote)
      if (prevVoteIndex !== -1) {
        newVotes[prevVoteIndex].count -= 1
        newTotalVotes -= 1
      }
    }

    // Add new vote
    const voteIndex = newVotes.findIndex((v) => v.option === vote)
    if (voteIndex !== -1) {
      newVotes[voteIndex].count += 1
      newTotalVotes += 1
    }

    // Recalculate percentages
    newVotes = newVotes.map((vote) => ({
      ...vote,
      percentage: Math.round((vote.count / newTotalVotes) * 100),
    }))

    // Update route state
    setRouteData({
      ...routeData,
      votes: newVotes,
      totalVotes: newTotalVotes,
      userVote: vote,
    })

    // Hide vote options after voting
    setShowVoteOptions(false)
  }

  // Calculate consensus (most voted option)
  const consensusVote = routeData.votes.reduce((prev, current) => (prev.count > current.count ? prev : current)).option

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {routeData.routeName} ({routeData.routeGrade}) Difficulty Consensus
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {routeData.totalVotes} votes
            </h3>
            {isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVoteOptions(!showVoteOptions)}
                className="text-xs h-8"
              >
                {routeData.userVote ? "Change Vote" : "Add Vote"}
                {showVoteOptions ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </Button>
            )}
          </div>

          {showVoteOptions && (
            <div className="grid grid-cols-3 gap-2 my-2">
              {(["sandbag", "staunch", "stiff", "fair", "easy", "overgraded"] as DifficultyVote[]).map((option) => (
                <TooltipProvider key={option}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn("text-xs h-8 capitalize", routeData.userVote === option && "ring-2 ring-primary")}
                        onClick={() => handleVote(option)}
                      >
                        {option}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getDifficultyDescription(option)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}

          <div className="space-y-1.5 mt-4">
            {routeData.votes.map((vote) => (
              <div key={vote.option} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize">{vote.option}</span>
                  <span>
                    {vote.count} ({vote.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", getDifficultyColor(vote.option))}
                    style={{ width: `${vote.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center text-sm pt-2 border-t">
          <BarChart className="h-4 w-4 mr-1" />
          <span>
            Consensus: <span className="font-medium capitalize">{consensusVote}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

