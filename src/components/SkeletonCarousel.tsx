"use client";

import { useState, type TouchEvent } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SkeletonCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Create an array of skeleton cards
  const totalCards = 5;
  const cardsPerView = {
    mobile: 1,
    desktop: 3,
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? totalCards - 1 : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= totalCards ? 0 : newIndex;
    });
  };

  // Swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }

    if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Function to get visible card indices based on current index and screen size
  const getVisibleCards = () => {
    const indices = [];
    for (let i = 0; i < totalCards; i++) {
      indices.push((currentIndex + i) % totalCards);
    }
    return indices;
  };

  const visibleCards = getVisibleCards();

  return (
    <div className="relative mx-auto w-full max-w-[280px] px-8 md:max-w-full">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile view (1 card) */}
        <div className="md:hidden">
          <Card className="w-full">
            <CardContent className="p-4">
              <Skeleton className="h-[140px] w-full rounded-lg" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[40px]" />
            </CardFooter>
          </Card>
        </div>

        {/* Desktop view (3 cards) */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
          {[0, 1, 2].map((offset) => {
            const cardIndex = (currentIndex + offset) % totalCards;
            return (
              <Card key={cardIndex} className="w-full">
                <CardContent className="p-4">
                  <Skeleton className="h-[140px] w-full rounded-lg" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[40px]" />
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center gap-1">
          {[...Array(totalCards)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border-muted bg-background shadow-md"
        onClick={handlePrevious}
        aria-label="Previous card"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border-muted bg-background shadow-md"
        onClick={handleNext}
        aria-label="Next card"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
