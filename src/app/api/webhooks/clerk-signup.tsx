import { Webhook } from "svix";
import { buffer } from "micro";
import { createNewUserFromClerk } from "@/server/models/users";

import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookEvent } from "@clerk/nextjs/server";
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Example function to check for unique constraint violation (adjust for your DB)
function isUniqueConstraintError(error) {
  // For PostgreSQL, unique violation error code is '23505'
  return error.code === "23505";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (req.method === "POST") {
    const rawBody = await buffer(req);
    const svix_id = req.headers["svix-id"] as string | undefined;
    const svix_timestamp = req.headers["svix-timestamp"] as string | undefined;
    const svix_signature = req.headers["svix-signature"] as string | undefined;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ message: "Missing Svix headers" });
    }

    const svix = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = svix.verify(rawBody, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook verification error:", err?.message || err);
      return res.status(400).json({ message: "Webhook verification failed" });
    }

    const { data, type } = evt;

    console.log(`Received webhook event: ${type}`); // Log received event type

    if (type === "user.created") {
      const clerkUserId = data.id;

      // Handle potentially null names (ensure DB schema allows NULLs)
      const username = data.username ?? null;

      try {
        // Insert user into database
        await createNewUserFromClerk(clerkUserId, username);

        console.log(
          `Webhook event: User created in database for Clerk user ID: ${clerkUserId}`,
        );
        return res.status(200).json({ message: "User created successfully" });
      } catch (dbError) {
        // Handle Idempotency: Check for unique constraint violation
        if (isUniqueConstraintError(dbError)) {
          console.log(
            `Webhook event: User ${clerkUserId} already exists in database (idempotency handled).`,
          );
          return res
            .status(200)
            .json({ message: "User already exists (idempotent)" });
        } else {
          console.error(`Webhook event: Database error:`, dbError);
          return res
            .status(500)
            .json({ message: "Failed to create user in database" });
        }
      }
    } else {
      // Log other event types if needed
      console.log(`Webhook event: Received unhandled event type: ${type}`);
    }

    // Acknowledge receipt for handled or unhandled events
    return res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }
}
