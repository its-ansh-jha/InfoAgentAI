import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
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

// Chat Messages Schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  model: text("model").notNull(), // gpt-4o-mini, deepseek-r1
  timestamp: text("timestamp").notNull(),
  sessionId: text("session_id").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  role: true,
  content: true,
  model: true,
  timestamp: true,
  sessionId: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Define the image content type schema
const imageContentSchema = z.object({
  type: z.literal("image"),
  image_data: z.string(), // Base64 encoded image data
});

// Define the text content type schema
const textContentSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

// Request schema for chat completions
export const chatCompletionRequestSchema = z.object({
  model: z.enum(["gpt-4o-mini", "deepseek-r1", "llama-4-maverick"]),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.union([
        z.string(),
        z.array(z.union([textContentSchema, imageContentSchema]))
      ]),
    })
  ),
  sessionId: z.string().optional(),
});

export type ChatCompletionRequest = z.infer<typeof chatCompletionRequestSchema>;

// Response schema for chat completions
export const chatCompletionResponseSchema = z.object({
  message: z.object({
    role: z.enum(["assistant"]),
    content: z.string(),
  }),
  model: z.enum(["gpt-4o-mini", "deepseek-r1", "llama-4-maverick"]),
});

export type ChatCompletionResponse = z.infer<typeof chatCompletionResponseSchema>;
