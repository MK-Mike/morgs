import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "~/components/ui/card"

export default function SkeletonCarousel() {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex space-x-4 animate-scroll">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="w-[300px] flex-shrink-0">
            <CardContent className="p-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[50px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

