import { Webhook } from "svix";
import { headers } from "next/headers"; // Import headers helper
import { NextResponse } from "next/server"; // Import NextResponse
import { createNewUserFromClerk } from "@/server/models/users";

import type { WebhookEvent } from "@clerk/nextjs/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

// Example function to check for unique constraint violation (adjust for your DB)
// Consider typing the error more specifically if possible
function isUniqueConstraintError(error: any): boolean {
  // For PostgreSQL, unique violation error code is '23505'
  // Add checks for other DBs if necessary
  return typeof error === "object" && error !== null && error.code === "23505";
}

// Export the POST function for the App Router
export async function POST(req: Request) {
  // 1. Check for webhook secret
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 },
    );
  }

  // 2. Get headers using the 'headers' helper
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { message: "Missing Svix headers" },
      { status: 400 },
    );
  }

  // 3. Get the raw body
  // Svix needs the raw text body for verification
  const payload = await req.text();

  // 4. Verify webhook
  const svix = new Webhook(webhookSecret);
  let evt: WebhookEvent;
  try {
    evt = svix.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err: any) {
    console.error("Webhook verification error:", err?.message || err);
    return NextResponse.json(
      { message: "Webhook verification failed" },
      { status: 400 },
    );
  }

  // 5. Handle the event
  const { data, type } = evt;
  console.log(`Received webhook event: ${type}`);

  if (type === "user.created") {
    const clerkUserId = data.id;
    const username = data.username ?? null; // Use appropriate fields

    try {
      // Insert user into database
      await createNewUserFromClerk(clerkUserId, username); // Pass necessary data

      console.log(
        `Webhook event: User created in database for Clerk user ID: ${clerkUserId}`,
      );
      // Return NextResponse on success
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 200 },
      );
    } catch (dbError: any) {
      if (isUniqueConstraintError(dbError)) {
        console.log(
          `Webhook event: User ${clerkUserId} already exists in database (idempotency handled).`,
        );
        // Return NextResponse even if user already exists (idempotent success)
        return NextResponse.json(
          { message: "User already exists (idempotent)" },
          { status: 200 },
        );
      } else {
        console.error(`Webhook event: Database error:`, dbError);
        // Return NextResponse on database error
        return NextResponse.json(
          { message: "Failed to create user in database" },
          { status: 500 },
        );
      }
    }
  } else {
    console.log(`Webhook event: Received unhandled event type: ${type}`);
    // Acknowledge receipt for unhandled events
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
