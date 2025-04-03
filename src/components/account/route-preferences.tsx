"use client"

import { useState } from "react"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface RouteTag {
  id: string
  name: string
}

export default function RoutePreferences() {
  const [isOpen, setIsOpen] = useState(false)
  const [gradeRange, setGradeRange] = useState([15, 25])
  const [starRating, setStarRating] = useState(3)
  const [selectedTags, setSelectedTags] = useState<string[]>(["3"])
  const [tags] = useState<RouteTag[]>([
    { id: "1", name: "crimpy" },
    { id: "2", name: "overhang" },
    { id: "3", name: "technical" },
    { id: "4", name: "dynamic" },
    { id: "5", name: "slopers" },
    { id: "6", name: "exposed" },
    { id: "7", name: "pumpy" },
    { id: "8", name: "balancy" },
  ])

  const toggleTag = (id: string) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((tagId) => tagId !== id))
    } else {
      setSelectedTags([...selectedTags, id])
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Route Preferences</h3>
        <p className="text-sm text-muted-foreground">Customize your climbing experience and route recommendations</p>
      </div>

      <div className="space-y-6 bg-card p-6 rounded-lg border border-border">
        <div className="space-y-4">
          <h4 className="font-medium">Grade Range</h4>
          <div className="pt-6 pb-2">
            <div className="relative">
              <Slider
                defaultValue={gradeRange}
                min={8}
                max={36}
                step={1}
                onValueChange={setGradeRange}
                className="w-full"
              />

              <div className="flex justify-between mt-2">
                <div className="text-sm text-muted-foreground">
                  Min Grade: <span className="text-foreground font-medium">{gradeRange[0]}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Max Grade: <span className="text-foreground font-medium">{gradeRange[1]}</span>
                </div>
              </div>

              <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
                <span>8</span>
                <span>12</span>
                <span>16</span>
                <span>20</span>
                <span>24</span>
                <span>28</span>
                <span>32</span>
                <span>36</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stars and Route Styles in parallel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          <div className="space-y-4">
            <h4 className="font-medium">Climbing Disciplines</h4>
            <div className="grid grid-cols-2 gap-3">
              {["Sport", "Trad"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Switch id={`discipline-${type}`} defaultChecked={true} />
                  <Label htmlFor={`discipline-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Minimum Star Rating</h4>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} type="button" onClick={() => setStarRating(rating)} className="focus:outline-none">
                  {rating <= starRating ? (
                    <Star className="w-8 h-8 text-chart-4 fill-chart-4" />
                  ) : (
                    <Star className="w-8 h-8 text-muted" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Only show routes with {starRating} star{starRating !== 1 ? "s" : ""} or more
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-medium">Route Tags</h4>
          <p className="text-sm text-muted-foreground mb-3">Select the types of routes you prefer</p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className={`cursor-pointer text-sm py-1.5 px-3 ${
                  selectedTags.includes(tag.id)
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}

