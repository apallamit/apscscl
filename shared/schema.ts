import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table schema
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

// Good Seeds table schema
export const goodSeeds = pgTable("good_seeds", {
  id: serial("id").primaryKey(),
  district: text("district").notNull(),
  transportType: text("transport_type").notNull(),
  goodName: text("good_name").notNull(),
  routeAddress: text("route_address").notNull(),
  street: text("street"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const goodSeedSchema = createInsertSchema(goodSeeds, {
  district: z.string().min(1, "District is required"),
  transportType: z.string().min(1, "Transport type is required"),
  goodName: z.string().min(1, "Good name is required"),
  routeAddress: z.string().min(1, "Route address is required"),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
}).omit({ id: true, createdAt: true });

export type InsertGoodSeed = z.infer<typeof goodSeedSchema>;
export type GoodSeed = typeof goodSeeds.$inferSelect;
