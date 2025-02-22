"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

export default function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors duration-200">
            Home
          </Link>
        </li>
        {paths.map((path, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            {index < paths.length - 1 ? (
              <Link
                href={`/${paths.slice(0, index + 1).join("/")}`}
                className="text-primary hover:text-primary-dark transition-colors duration-200"
              >
                {path.replace(/-/g, " ")}
              </Link>
            ) : (
              <span className="text-muted-foreground font-medium">{path.replace(/-/g, " ")}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

