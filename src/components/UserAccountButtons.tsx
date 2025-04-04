"use client";

import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function UserAccountButtons() {
  const { userId, sessionId } = useAuth();
  const { isSignedIn, user } = useUser();

  return (
    <div className="mt-auto border-t border-border p-4 pb-8">
      <SignedOut>
        <div className="flex items-center justify-between space-x-3 rounded p-2">
          <SignInButton>
            <Button variant="outline" size="default">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="secondary" size="default">
              Sign up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center space-x-3 rounded p-2 hover:bg-secondary hover:text-white">
          <UserButton />
          <div>
            <p className="font-medium">{user?.username ?? "User"}</p>
            <Link href="/account">
              <p className="text-sm text-muted-foreground hover:underline">
                Settings
              </p>
            </Link>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
