"use server";
import { db } from "@/server/db/index";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function createNewUserFromClerk(
  clerkUserId: string,
  username: string,
) {
  try {
    const result = await db
      .insert(users)
      .values({
        id: clerkUserId,
        username,
        role: "user",
      })
      .returning({ insertedId: users.id });

    console.log("Server Action: Inserted ID", result[0]?.insertedId);
    return result; // Or return something more meaningful
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to create user.");
  }
}
export async function getAllUsers() {
  try {
    const result = await db.select().from(users);
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to fetch users.");
  }
}
export async function updateUserRole(clerkUserId: string, role: string) {
  const safeRole = role.toLowerCase();
  if (!["admin", "user", "manager"].includes(safeRole)) {
    throw new Error("Invalid role");
  }
  try {
    const result = await db
      .update(users)
      .set({ role: safeRole })
      .where(eq(users.id, clerkUserId));
    console.log(
      `Server action: updated user role for ${clerkUserId} to ${role}`,
    );
    return result[0];
  } catch (error) {
    console.error("Server Action Error:", error);
    // Re-throw or return an error object/message
    throw new Error("Failed to update user role.");
  }
}
export async function getUserRole(clerkUserId: string) {
  console.log(`Server action: fetching user role for ${clerkUserId}`);
  try {
    // Execute the query and await the result
    const result = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, clerkUserId))
      .limit(1);

    // Check if a user was found
    if (result.length === 0) {
      console.log(`Server action: No user found for ${clerkUserId}`);
      return null;
    }

    // Extract the role from the first object in the array
    const userRole = result[0].role;

    console.log(
      `Server action: fetched user role for ${clerkUserId} as ${userRole}`,
    );
    return userRole; // Return the actual role string
  } catch (err) {
    console.error("Error fetching user role:", err); // Use console.error for errors
    // Re-throw or handle the error appropriately
    throw new Error("Failed to fetch user role");
  }
}
