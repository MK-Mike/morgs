import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  json,
  pgEnum,
  serial,
  real,
  unique,
} from "drizzle-orm/pg-core";
import { object } from "zod";

/**
 * Note, set up to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `morgan-bay-climbing_${name}`,
);

export const roleEnum = pgEnum("role", ["admin", "user", "manager"]);

export const users = createTable("user", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  role: roleEnum("role").notNull(),
  preferences: json("preferences"),
});

export const routeStyleEnum = pgEnum("route_style", [
  "trad",
  "sport",
  "solo",
  "bouldering",
  "mixed",
  "aid",
]);

export const headlands = createTable("headland", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
});

export const sectors = createTable(
  "sector",
  {
    id: serial("id").primaryKey(),
    headlandId: integer("headland_id")
      .notNull()
      .references(() => headlands.id),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
  },
  (sector) => ({
    headlandIdIdx: index("headland_id_idx").on(sector.headlandId),
  }),
);

export const routes = createTable(
  "route",
  {
    id: serial("id").primaryKey(),
    sectorId: integer("sector_id")
      .notNull()
      .references(() => sectors.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    routeNumber: integer("route_number"),
    grade: integer("grade"),
    stars: real("stars"),
    description: text("description").notNull(),
    firstAscent: varchar("first_ascent", { length: 255 }),
    date: timestamp("date", { mode: "date" }),
    info: varchar("info", { length: 255 }),
    routeStyle: routeStyleEnum("route_style"),
  },
  (route) => ({
    sectorIdIdx: index("sector_id_idx").on(route.sectorId),
  }),
);

export const tags = createTable("tag", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const routeTagVotes = createTable(
  "route_tag_vote",
  {
    id: serial("id").primaryKey(),
    routeId: integer("route_id")
      .notNull()
      .references(() => routes.id),
    tagId: varchar("tag_id", { length: 255 })
      .notNull()
      .references(() => tags.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id), // Assuming you have a users table
  },
  (routeTagVote) => ({
    // Enforce that a user can only vote once for a specific tag on a specific route
    uniqueVote: unique("unique_vote").on(
      routeTagVote.routeId,
      routeTagVote.tagId,
      routeTagVote.userId,
    ),
    routeIdIdx: index("route_tag_votes_route_id_idx").on(routeTagVote.routeId),
    tagIdIdx: index("tag_id_idx").on(routeTagVote.tagId),
    userIdIdx: index("user_id_idx").on(routeTagVote.userId),
  }),
);

export const difficultyEnum = pgEnum("difficulty_option", [
  "sandbag",
  "staunch",
  "stiff",
  "fair",
  "easy",
  "overgraded",
]);

export const routeDifficultyVotes = createTable(
  "route_difficulty_vote",
  {
    id: serial("id").primaryKey(),
    routeId: integer("route_id")
      .notNull()
      .references(() => routes.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    difficulty: difficultyOptionEnum("difficulty_option").notNull(),
  },
  (routeDifficultyVote) => ({
    // Enforce that a user can only vote once per route
    uniqueVote: unique("unique_difficulty_vote").on(
      routeDifficultyVote.routeId,
      routeDifficultyVote.userId,
    ),
    routeIdIdx: index("route_difficulty_votes_route_id_idx").on(
      routeDifficultyVote.routeId,
    ),
    userIdIdx: index("user_id_idx").on(routeDifficultyVote.userId),
  }),
);

export const commentTagEnum = pgEnum("comment_tag", [
  "beta",
  "update",
  "warning",
  "question",
  "gear",
]);

export const comments = createTable(
  "comment",
  {
    id: serial("id").primaryKey(),
    routeId: integer("route_id")
      .notNull()
      .references(() => routes.id),
    userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (comment) => ({
    routeIdIdx: index("route_id_idx").on(comment.routeId),
    userIdIdx: index("user_id_idx").on(comment.userId),
  }),
);

export const commentTags = createTable(
  "comment_tag",
  {
    id: serial("id").primaryKey(),
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    tag: commentTagEnum("tag").notNull(),
  },
  (commentTag) => ({
    commentIdIdx: index("comment_id_idx").on(commentTag.commentId),
    uniqueCommentTag: unique("unique_comment_tag").on(
      commentTag.commentId,
      commentTag.tag,
    ),
  }),
);
