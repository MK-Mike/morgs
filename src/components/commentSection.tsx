"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { selectCommentsForRoute } from "@/utils/commentSelector";

// Comment type definition
type Comment = {
  id: string;
  userId: string;
  username: string;
  userImage?: string;
  content: string;
  createdAt: string;
  tags: string[];
};

// Tag options
const tagOptions = ["beta", "update", "warning", "question", "gear"];

export default function CommentsSection({ routeSlug }: { routeSlug: string }) {
  const { user, isSignedIn } = useUser();
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("beta");
  const [isLoading, setIsLoading] = useState(true);
  const [hiddenBetas, setHiddenBetas] = useState<Record<string, boolean>>({});

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // In a real app, this would be an API call
        const response = await import("@/data/comments.json");
        const comments = response.comments;

        setAllComments(comments);

        // Select a consistent subset of comments based on route ID
        const selectedComments = selectCommentsForRoute(comments, routeSlug);
        setDisplayedComments(selectedComments);

        // Initialize hidden state for beta comments
        const initialHiddenState: Record<string, boolean> = {};
        selectedComments.forEach((comment) => {
          if (comment.tags.includes("beta")) {
            initialHiddenState[comment.id] = true;
          }
        });
        setHiddenBetas(initialHiddenState);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [routeSlug]);

  const addComment = () => {
    if (!newComment.trim() || !isSignedIn) return;

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      userId: user?.id || "unknown",
      username: user?.username || user?.firstName || "Anonymous",
      userImage: user?.imageUrl,
      content: newComment,
      createdAt: new Date().toISOString(),
      tags: [selectedTag],
    };

    // Add to displayed comments
    setDisplayedComments([comment, ...displayedComments]);

    // Initialize hidden state if it's a beta comment
    if (selectedTag === "beta") {
      setHiddenBetas((prev) => ({
        ...prev,
        [comment.id]: true,
      }));
    }

    // Also add to all comments (in a real app, this would be an API call)
    setAllComments([comment, ...allComments]);
    setNewComment("");
  };

  // Toggle beta visibility
  const toggleBetaVisibility = (commentId: string) => {
    setHiddenBetas((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Format date as "Feb 26, 2025"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <div className="w-full py-8 text-center">Loading comments...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-6">
      <h2 className="mb-2 text-2xl font-bold">Route Comments</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Showing {displayedComments.length} comments for this route
      </p>

      {isSignedIn ? (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {user?.username || user?.firstName || "You"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your beta, updates, or tips about this route..."
              className="min-h-24 resize-none"
            />
            <div className="mt-4 flex items-center justify-between">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  {tagOptions.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addComment}>Post Comment</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 p-4 text-center">
          <p>Sign in to leave a comment</p>
          <Button className="mt-2" variant="outline">
            Sign In
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {displayedComments.map((comment) => {
          const hasBetaTag = comment.tags.includes("beta");
          const isBetaHidden = hasBetaTag && hiddenBetas[comment.id];

          return (
            <Card key={comment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.userImage} />
                      <AvatarFallback>
                        {comment.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {comment.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {hasBetaTag && (
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-600">
                      Beta information
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => toggleBetaVisibility(comment.id)}
                    >
                      {isBetaHidden ? (
                        <EyeIcon className="mr-1 h-4 w-4" />
                      ) : (
                        <EyeOffIcon className="mr-1 h-4 w-4" />
                      )}
                      {isBetaHidden ? "Show Beta" : "Hide Beta"}
                    </Button>
                  </div>
                )}

                {isBetaHidden ? (
                  <div
                    className="cursor-pointer rounded bg-gray-100 p-4 text-center dark:bg-gray-800"
                    onClick={() => toggleBetaVisibility(comment.id)}
                  >
                    <p className="text-sm text-muted-foreground">
                      Beta hidden. Click to reveal.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm">{comment.content}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Reply
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Like
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
