"use client"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Logbook() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold">Climbing Logbook</h3>
          <p className="text-sm text-muted-foreground">Track your progress and review your climbing history</p>
        </div>

        <div className="flex gap-2">
          <Button>Log a Climb</Button>
        </div>
      </div>

      {/* Filter controls moved to top */}
      <div className="bg-card p-4 rounded-lg border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Input placeholder="Search routes..." className="pl-9" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
          </div>

          <div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Climbing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="trad">Trad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Grade Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="easy">Easy (≤ V2 / 5.9)</SelectItem>
                <SelectItem value="moderate">Moderate (V3-V5 / 5.10-5.11)</SelectItem>
                <SelectItem value="hard">Hard (V6-V8 / 5.12)</SelectItem>
                <SelectItem value="expert">Expert (≥ V9 / 5.13+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Route Name</th>
                <th className="text-left py-3 px-4 font-medium">Grade</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Style</th>
                <th className="text-left py-3 px-4 font-medium">Partner</th>
                <th className="text-left py-3 px-4 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Midnight Lightning",
                  grade: "25",
                  date: "Apr 1, 2025",
                  style: "Send",
                  partner: "Solo",
                  notes: "Finally sent after 3 seasons of projecting!",
                },
                {
                  name: "The Nose",
                  grade: "31",
                  date: "Mar 28, 2025",
                  style: "In Progress",
                  partner: "Sarah",
                  notes: "Made it to Camp 4. Will finish next weekend.",
                },
                {
                  name: "Evilution",
                  grade: "29",
                  date: "Mar 15, 2025",
                  style: "Project",
                  partner: "Mike",
                  notes: "Getting closer! Sticking the crux move now.",
                },
                {
                  name: "Astroman",
                  grade: "27",
                  date: "Mar 10, 2025",
                  style: "Send",
                  partner: "Sarah",
                  notes: "Clean ascent. Perfect weather.",
                },
                {
                  name: "Golden Shower",
                  grade: "32",
                  date: "Feb 22, 2025",
                  style: "Send",
                  partner: "Alex",
                  notes: "Hardest route I've ever climbed!",
                },
                {
                  name: "Freerider",
                  grade: "30",
                  date: "Feb 15, 2025",
                  style: "Project",
                  partner: "Solo",
                  notes: "Working the crux pitch. Need more endurance.",
                },
                {
                  name: "Silverback",
                  grade: "27",
                  date: "Feb 10, 2025",
                  style: "Flash",
                  partner: "John",
                  notes: "Surprised myself with this one!",
                },
                {
                  name: "The Arch",
                  grade: "19",
                  date: "Feb 5, 2025",
                  style: "Onsight",
                  partner: "Lisa",
                  notes: "Easy day out, good warm-up.",
                },
                {
                  name: "Roulette",
                  grade: "21",
                  date: "Jan 28, 2025",
                  style: "Send",
                  partner: "Solo",
                  notes: "Fun route with interesting moves.",
                },
                {
                  name: "Snapdragon",
                  grade: "25",
                  date: "Jan 15, 2025",
                  style: "Redpoint",
                  partner: "Mike",
                  notes: "Took 3 attempts. Tricky sequence in the middle.",
                },
              ].map((climb, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{climb.name}</td>
                  <td className="py-3 px-4">{climb.grade}</td>
                  <td className="py-3 px-4">{climb.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        climb.style === "Send" ||
                        climb.style === "Flash" ||
                        climb.style === "Onsight" ||
                        climb.style === "Redpoint"
                          ? "bg-chart-2/20 text-chart-2"
                          : climb.style === "Project" || climb.style === "In Progress"
                            ? "bg-chart-4/20 text-chart-4"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {climb.style}
                    </span>
                  </td>
                  <td className="py-3 px-4">{climb.partner}</td>
                  <td className="py-3 px-4 text-muted-foreground">{climb.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

