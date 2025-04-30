import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Puzzle Schema - using jsonb for array storage
export const puzzles = pgTable("puzzles", {
  id: serial("id").primaryKey(),
  rule: text("rule").notNull(),
  inputs: jsonb("inputs").notNull().$type<string[]>(),
  outputs: jsonb("outputs").notNull().$type<string[]>(),
});

export const insertPuzzleSchema = createInsertSchema(puzzles).pick({
  rule: true,
  inputs: true,
  outputs: true,
});

export type InsertPuzzle = z.infer<typeof insertPuzzleSchema>;
export type Puzzle = typeof puzzles.$inferSelect;

// Validation for puzzle form
export const puzzleFormSchema = z.object({
  rule: z.string().min(1, { message: "Rule is required" }),
  inputs: z.array(
    z.string().min(1, { message: "Input value is required" })
  ).length(6, { message: "Exactly 6 inputs are required" }),
  outputs: z.array(
    z.string().min(1, { message: "Output value is required" })
  ).length(6, { message: "Exactly 6 outputs are required" }),
});
