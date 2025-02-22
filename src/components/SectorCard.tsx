import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

type GradeBucket = {
  label: string
  color: string
  count: number
}

type SectorCardProps = {
  name: string
  slug: string
  gradeBuckets: GradeBucket[]
  routeTypes: string[]
}

const getRandomWaves = () => {
  const waves = []
  const numWaves = Math.floor(Math.random() * 2) + 2 // 2 or 3 waves
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"]

  for (let i = 0; i < numWaves; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    waves.push(
      <svg
        key={i}
        className="absolute bottom-0 left-0 right-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        style={{ zIndex: 1 }} // Set a low z-index for all waves
      >
        <path
          fill={randomColor}
          fillOpacity="0.1"
          d={`M0,${32 * i}L48,${53.3 + i * 10}C96,${74.7 + i * 20},192,${117.3 + i * 30},288,${138.7 + i * 20}C384,${160 + i * 10},480,${160 - i * 10},576,${138.7 - i * 20}C672,${117.3 - i * 30},768,${74.7 - i * 20},864,${53.3 - i * 10}C960,${32 + i * 5},1056,${32 - i * 5},1152,${53.3 + i * 15}C1248,${74.7 + i * 25},1344,${117.3 + i * 15},1392,${138.7 + i * 5}L1440,${160 - i * 5}L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z`}
        ></path>
      </svg>,
    )
  }
  return waves
}

export default function SectorCard({ name, slug, gradeBuckets, routeTypes }: SectorCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        {" "}
        {/* Add z-index to ensure content is above waves */}
        <div className="flex space-x-2 mb-4">
          {gradeBuckets.map((bucket, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: bucket.color }}
                  >
                    {bucket.count}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{bucket.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        {routeTypes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Route Types:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {routeTypes.map((type, index) => (
                <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
        <Link href={`/sectors/${slug}`} className="text-primary hover:text-primary-hover relative z-20">
          View routes
        </Link>
      </CardContent>
      <div className="absolute inset-0 z-0">
        {" "}
        {/* Wrap waves in a div with z-index 0 */}
        {getRandomWaves()}
      </div>
    </Card>
  )
}

