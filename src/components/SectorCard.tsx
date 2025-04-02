import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type GradeBucketsMeta = {
  label: string;
  color: string;
  range: string;
};

type GradeBucketsProperties = Record<string, GradeBucketsMeta>;
type GradeBucket = {
  name: string;
  count: number;
};

type SectorCardProps = {
  name: string;
  slug: string;
  gradeBuckets: GradeBucket[];
  routeTypes: string[];
};

const getRandomWaves = () => {
  const waves: JSX.Element[] = [];
  const numWaves = Math.floor(Math.random() * 2) + 2; // 2 or 3 waves
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"];

  for (let i = 0; i < numWaves; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    waves.push(
      <svg
        key={i}
        className="absolute bottom-0 left-0 right-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ zIndex: 1 }}
      >
        <path
          fill={randomColor}
          fillOpacity="0.1"
          d={`M0,${32 * i}L48,${53.3 + i * 10}C96,${74.7 + i * 20},192,${117.3 + i * 30},288,${138.7 + i * 20}C384,${160 + i * 10},480,${160 - i * 10},576,${138.7 - i * 20}C672,${117.3 - i * 30},768,${74.7 - i * 20},864,${53.3 - i * 10}C960,${32 + i * 5},1056,${32 - i * 5},1152,${53.3 + i * 15}C1248,${74.7 + i * 25},1344,${117.3 + i * 15},1392,${138.7 + i * 5}L1440,${160 - i * 5}L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z`}
        ></path>
      </svg>,
    );
  }
  return waves;
};
const gradeBucketsProperties: GradeBucketsProperties = {
  easy: { label: "Easy (0-16)", color: "#4CAF50", range: "0-16" },
  medium: { label: "Medium (17-24)", color: "#2196F3", range: "17-24" },
  hard: { label: "Hard (25-32)", color: "#F44336", range: "25-32" },
  veryHard: { label: "Very Hard (33+)", color: "#000000", range: "33+" },
};

export default function SectorCard({
  name,
  slug,
  gradeBuckets,
  routeTypes,
}: SectorCardProps) {
  return (
    <Card className="relative h-full max-w-sm overflow-hidden bg-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="truncate">
          <div className="flex items-center justify-between gap-2">
            {name}
            {routeTypes.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {routeTypes.map((type, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 pb-12">
        <div className="my-4 flex flex-wrap justify-evenly gap-4">
          {gradeBuckets.map(
            (bucket, index) =>
              bucket.count > 0 && (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className="flex h-8 w-8 items-center justify-center text-sm font-bold"
                        style={{
                          border: `2px solid ${gradeBucketsProperties[bucket.name]?.color}`,
                          transform: "rotate(45deg)",
                          color: `${gradeBucketsProperties[bucket.name].color}`,
                        }}
                      >
                        <div
                          style={{
                            transform: "rotate(-45deg)", // Rotate the content back to normal
                          }}
                        >
                          {bucket.count}
                        </div>
                      </div>
                      <span
                        className="mt-6 sm:hidden"
                        style={{
                          fontSize: "0.8rem",
                          color: `${gradeBucketsProperties[bucket.name].color}`,
                        }}
                      >
                        {gradeBucketsProperties[bucket.name].range}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{gradeBucketsProperties[bucket.name].label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ),
          )}
        </div>

        <Link
          href={`/sectors/${slug}`}
          className="absolute bottom-4 left-6 z-20 text-primary hover:text-blue-500"
        >
          View routes
        </Link>
      </CardContent>

      <div className="absolute inset-0 z-0 w-full overflow-hidden">
        {getRandomWaves()}
      </div>
    </Card>
  );
}
