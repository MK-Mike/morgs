import { Skeleton } from "~/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "~/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";

export function SectorTitleSkeleton() {
  return <Skeleton className="mb-6 h-10 w-64" />;
}

export function DescriptionCardSkeleton() {
  return (
    <Card className="flex flex-col items-center md:col-span-2 md:row-span-2">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="w-full">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="w-full flex-1">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center p-4 text-center">
      <Skeleton className="mb-2 h-8 w-8 rounded-full" />
      <Skeleton className="mb-2 h-10 w-16" />
      <Skeleton className="h-4 w-24" />
    </Card>
  );
}

export function ConditionsCardSkeleton() {
  return (
    <Card className="md:col-span-2 md:col-start-3">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="h-10 w-20 sm:w-32" />
      </div>
      <div>
        <Skeleton className="mb-2 h-4 w-16" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div>
        <Skeleton className="mb-2 h-4 w-20" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
    </div>
  );
}

export function RoutesTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <TableBody>
        {Array(rows)
          .fill(0)
          .map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              <TableCell>
                <span>
                  <Skeleton className="h-4 w-8" />
                </span>
              </TableCell>
              <TableCell>
                <span>
                  <Skeleton className="h-4 w-32" />
                </span>
              </TableCell>
              <TableCell>
                <span>
                  <Skeleton className="h-4 w-8" />
                </span>
              </TableCell>
              <TableCell>
                <span>
                  <Skeleton className="h-4 w-16" />
                </span>
              </TableCell>
              <TableCell className="text-end">
                <span className="flex flex-wrap justify-end gap-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span>
                  <Skeleton className="h-4 w-24" />
                </span>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export function SectorImageSkeleton() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
