"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent, // Initialize tags only once with the specified tags filter applied
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircle, Tag, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Types for route tags
interface RouteTag {
  id: string;
  name: string;
  votes: number;
  userVoted: boolean;
}

interface RouteTagCardProps {
  specifiedTags: string[];
}

//mapping for tag colours
const tagColours = new Map([
  ["pumpy", "emerald"],
  ["run out", "rose"],
  ["technical", "yellow"],
  ["slabby", "sky"],
  ["juggy", "pink"],
  ["crimpy", "emerald"],
  ["exposed", "rose"],
  ["vertical", "yellow"],
  ["overhang", "sky"],
  ["sustained", "pink"],
]);

// Mock data for demonstration
const mockTags: RouteTag[] = [
  { id: "1", name: "crimpy", votes: 24, userVoted: false },
  { id: "2", name: "overhang", votes: 18, userVoted: false },
  { id: "3", name: "technical", votes: 15, userVoted: true },
  { id: "4", name: "dynamic", votes: 12, userVoted: false },
  { id: "5", name: "slopers", votes: 8, userVoted: false },
  { id: "6", name: "exposed", votes: 36, userVoted: false },
  { id: "7", name: "pumpy", votes: 5, userVoted: false },
  { id: "8", name: "balancy", votes: 22, userVoted: false },
];

export default function RouteTags({ specifiedTags }: RouteTagCardProps) {
  const [tags, setTags] = useState<RouteTag[]>();
  const [newTagName, setNewTagName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state

  // Initialize tags only once with the specified tags filter applied
  useEffect(() => {
    // Create a deep copy of mockTags to avoid modifying the original data
    const initialTags = mockTags.map((tag) => ({
      ...tag,
      votes: specifiedTags.includes(tag.name) ? tag.votes : 0,
    }));

    setTags(initialTags);
  }, [specifiedTags]);

  // Function to handle voting for a tag
  const handleVote = (tagId: string) => {
    if (!isLoggedIn) return;

    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === tagId
          ? {
              ...tag,
              votes: tag.userVoted ? tag.votes - 1 : tag.votes + 1,
              userVoted: !tag.userVoted,
            }
          : tag,
      ),
    );
  };

  // Function to add a new tag
  const handleAddTag = () => {
    // If a tag is selected from the dropdown
    if (selectedTag) {
      const existingTag = tags.find((tag) => tag.name === selectedTag);
      if (existingTag) {
        // If user hasn't already voted for this tag, increment its vote
        if (!existingTag.userVoted) {
          handleVote(existingTag.id);
        }
        setSelectedTag("");
        setIsDialogOpen(false);
        return;
      }
    }

    // Otherwise, create a new tag from the input
    const tagName = selectedTag || newTagName;
    if (!tagName.trim() || !isLoggedIn) return;

    // Check if tag already exists (case insensitive)
    const normalizedTagName = tagName.toLowerCase().trim();
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === normalizedTagName,
    );

    if (existingTag) {
      // If tag exists but user hasn't voted for it, increment its vote
      if (!existingTag.userVoted) {
        handleVote(existingTag.id);
      }
    } else {
      // Create new tag
      const newTag: RouteTag = {
        id: `tag-${Date.now()}`,
        name: normalizedTagName,
        votes: 1,
        userVoted: true,
      };
      setTags((prevTags) => [...prevTags, newTag]);
    }

    // Reset form
    setNewTagName("");
    setSelectedTag("");
    setIsDialogOpen(false);
  };

  // Get all unique tag names for suggestions
  const allTagNames = tags.map((tag) => tag.name);

  // Sort tags by vote count (descending)
  const sortedTags = [...tags].sort((a, b) => b.votes - a.votes);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Route Tags
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a new tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Select from existing tags:
                  </p>
                  <Popover
                    open={isComboboxOpen}
                    onOpenChange={setIsComboboxOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isComboboxOpen}
                        className="w-full justify-between"
                      >
                        {selectedTag ? selectedTag : "Select a tag..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {allTagNames.map((tagName) => (
                              <CommandItem
                                key={tagName}
                                value={tagName}
                                onSelect={(currentValue) => {
                                  setSelectedTag(
                                    currentValue === selectedTag
                                      ? ""
                                      : currentValue,
                                  );
                                  setIsComboboxOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedTag === tagName
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {tagName}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Or create a new tag:
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter new tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddTag();
                      }}
                    />
                    <Button onClick={handleAddTag}>Add</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedTags
            .filter((tag) => tag.votes > 0)
            .map((tag) => (
              <Badge
                key={tag.id}
                variant={tagColours.get(tag.name)}
                className={cn(
                  "flex cursor-pointer items-center gap-1 px-2 py-1 transition-all",
                  tag.userVoted && "border-primary bg-primary/10",
                )}
                onClick={() => handleVote(tag.id)}
              >
                <span>{tag.name}</span>
                <span className="ml-1 flex items-center rounded-full bg-muted px-1.5 py-0.5 text-xs font-normal text-primary">
                  {tag.votes}
                  <ThumbsUp
                    className={cn(
                      "ml-0.5 h-3 w-3",
                      tag.userVoted
                        ? "fill-primary stroke-primary"
                        : "stroke-muted-foreground",
                    )}
                  />
                </span>
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
