import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "../styles/wave-animations.css";
import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Morgans Bay Climbing",
  description: "Discover the best climbing routes at Morgans Bay",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-text bg-background`}>
        <ClerkProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
