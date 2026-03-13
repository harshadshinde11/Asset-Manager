import { pgTable, text, serial, integer, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: varchar("role", { length: 10 }).notNull(),
  message: text("message").notNull(),
  language: varchar("language", { length: 10 }).default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketSearchHistoryTable = pgTable("market_search_history", {
  id: serial("id").primaryKey(),
  crop: text("crop").notNull(),
  state: text("state").notNull(),
  district: text("district"),
  market: text("market"),
  searchedAt: timestamp("searched_at").defaultNow().notNull(),
});

export const pestCameraScansTable = pgTable("pest_camera_scans", {
  id: serial("id").primaryKey(),
  detectedPest: text("detected_pest").notNull(),
  confidence: real("confidence").notNull(),
  cropType: text("crop_type"),
  location: text("location"),
  severity: varchar("severity", { length: 10 }).notNull(),
  imageData: text("image_data"),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
});

export const farmerMarketplaceTable = pgTable("farmer_marketplace", {
  id: serial("id").primaryKey(),
  crop: text("crop").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull().default("kg"),
  price: real("price").notNull(),
  location: text("location").notNull(),
  state: text("state").notNull(),
  contact: text("contact").notNull(),
  farmerName: text("farmer_name").notNull(),
  harvestDate: text("harvest_date").notNull(),
  quality: text("quality"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const landListingsTable = pgTable("land_listings", {
  id: serial("id").primaryKey(),
  listingType: varchar("listing_type", { length: 10 }).notNull(),
  village: text("village").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  soilType: text("soil_type").notNull(),
  farmSize: real("farm_size").notNull(),
  waterAvailability: text("water_availability").notNull(),
  price: real("price").notNull(),
  priceUnit: text("price_unit").notNull(),
  contact: text("contact").notNull(),
  ownerName: text("owner_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedLanguagePreferencesTable = pgTable("saved_language_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("default"),
  language: varchar("language", { length: 5 }).notNull().default("en"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessagesTable).omit({ id: true, createdAt: true });
export const insertMarketSearchSchema = createInsertSchema(marketSearchHistoryTable).omit({ id: true, searchedAt: true });
export const insertPestScanSchema = createInsertSchema(pestCameraScansTable).omit({ id: true, scannedAt: true });
export const insertFarmerListingSchema = createInsertSchema(farmerMarketplaceTable).omit({ id: true, createdAt: true });
export const insertLandListingSchema = createInsertSchema(landListingsTable).omit({ id: true, createdAt: true });
export const insertLanguagePrefSchema = createInsertSchema(savedLanguagePreferencesTable).omit({ id: true, updatedAt: true });

export type ChatMessage = typeof chatMessagesTable.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type MarketSearchHistory = typeof marketSearchHistoryTable.$inferSelect;
export type PestCameraScan = typeof pestCameraScansTable.$inferSelect;
export type FarmerListing = typeof farmerMarketplaceTable.$inferSelect;
export type LandListing = typeof landListingsTable.$inferSelect;
export type LanguagePreference = typeof savedLanguagePreferencesTable.$inferSelect;
