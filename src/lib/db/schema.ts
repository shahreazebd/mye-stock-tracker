import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const prefixedId = (prefix: string) => `${prefix}_${createId()}`;

/**
 * Platforms Table
 */
export const platforms = pgTable("platforms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => prefixedId("plt")),
  name: text("name").notNull().unique(),
  description: text("description"),
  image: text("image").notNull(),
  accuracy: integer("accuracy").default(0),
  totalTest: integer("totalTest").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
 * Stores Table
 */
export const stores = pgTable("stores", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => prefixedId("str")),
  platformId: text("platformId")
    .notNull()
    .references(() => platforms.id, { onDelete: "cascade" }),
  myeStoreId: text("myeStoreId").notNull(),
  locationId: text("locationId").notNull(),
  companyId: text("companyId").notNull(),
  name: text("name").notNull(),
  accuracy: integer("accuracy").default(0),
  totalTest: integer("totalTest").default(0),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
 * Inventory Reports Table
 */
export const inventoryReports = pgTable("inventoryReports", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => prefixedId("ivr")),
  platformId: text("platformId")
    .notNull()
    .references(() => platforms.id, { onDelete: "cascade" }),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  accuracy: doublePrecision("accuracy").default(0.0),
  total: integer("total").default(0),
  success: integer("success").default(0),
  failed: integer("failed").default(0),
  unmapped: integer("unmapped").default(0),
  failedSKU: text("failedSku").array().default([]),
  unmappedSKU: text("unmappedSku").array().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
 * Relations
 */
export const platformRelations = relations(platforms, ({ many }) => ({
  stores: many(stores),
  inventoryReports: many(inventoryReports),
}));

export const storeRelations = relations(stores, ({ one, many }) => ({
  platform: one(platforms, {
    fields: [stores.platformId],
    references: [platforms.id],
  }),
  inventoryReports: many(inventoryReports),
}));

export const inventoryReportRelations = relations(inventoryReports, ({ one }) => ({
  platform: one(platforms, {
    fields: [inventoryReports.platformId],
    references: [platforms.id],
  }),
  store: one(stores, {
    fields: [inventoryReports.storeId],
    references: [stores.id],
  }),
}));

/**
 * Types (aligned with table names)
 */
export type Platform = typeof platforms.$inferSelect;
export type NewPlatform = typeof platforms.$inferInsert;

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type InventoryReport = typeof inventoryReports.$inferSelect;
export type NewInventoryReport = typeof inventoryReports.$inferInsert;
