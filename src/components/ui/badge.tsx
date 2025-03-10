import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        yellow:
          "border-transparent bg-yellow-900 text-yellow-300 hover:bg-yellow-600",
        emerald:
          "border-transparent bg-emerald-900 text-emerald-300 hover:bg-green-600",
        sky: "border-transparent bg-sky-900 text-sky-300 hover:bg-sky-600",
        rose: "border-transparent bg-rose-900 text-rose-300 hover:bg-rose-600",
        pink: "border-transparent bg-pink-900 text-pink-300 hover:bg-pink-600",
        fuschia:
          "border-transparent bg-fuschia-900 text-fuschia-300 hover:bg-fuschia-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
