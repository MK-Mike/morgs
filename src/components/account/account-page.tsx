"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logbook from "./logbook";
import RoutePreferences from "./route-preferences";
import { useAuth, useUser } from "@clerk/nextjs";

export default function AccountPage() {
  const { userId } = useAuth();
  const { isSignedIn, user } = useUser();
  console.log(user);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-border p-4">
        <Link
          href="/sectors"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Routes
        </Link>
        <Button variant="ghost" className="text-sm">
          Sign out
        </Button>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center md:w-64">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full">
              <Image
                src={user?.imageUrl}
                alt="Profile picture"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="mb-2 text-muted-foreground">
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
            <div className="mb-6 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
              Admin
            </div>

            <div className="w-full space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-card-foreground">
                    Recent Climbs
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lekker Time</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Snapdragon</span>
                    <span className="font-medium">25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">The Arch</span>
                    <span className="font-medium">19</span>
                  </div>
                </div>

                <Button
                  variant="link"
                  className="mt-4 h-auto p-0 text-sm text-primary"
                >
                  View full logbook →
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h4 className="mb-4 font-semibold text-card-foreground">
                  Stats Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Climbs</span>
                    <span>247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hardest Route</span>
                    <span>24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Most Active Sector
                    </span>
                    <span>Bishop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span>12 climbs</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h4 className="mb-4 font-semibold text-card-foreground">
                  Keyboard Shortcuts
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Search</span>
                    <div className="flex gap-1">
                      <kbd className="rounded bg-muted px-2 py-1 text-xs">
                        Ctrl
                      </kbd>
                      <kbd className="rounded bg-muted px-2 py-1 text-xs">
                        K
                      </kbd>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Log a climb</span>
                    <div className="flex gap-1">
                      <kbd className="rounded bg-muted px-2 py-1 text-xs">
                        Ctrl
                      </kbd>
                      <kbd className="rounded bg-muted px-2 py-1 text-xs">
                        L
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6 rounded-lg bg-muted p-1 text-muted-foreground">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="logbook">Logbook</TabsTrigger>
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-8">
                <div className="rounded-lg border border-border bg-card p-6">
                  <h4 className="mb-2 font-semibold text-destructive">
                    Danger Zone
                  </h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </TabsContent>
              <TabsContent value="preferences" className="space-y-8">
                <RoutePreferences />
              </TabsContent>
              <TabsContent value="logbook" className="space-y-8">
                <Logbook />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
