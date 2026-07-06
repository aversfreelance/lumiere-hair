import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  time,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const stylists = pgTable("stylists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  specialties: text("specialties").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stylistServices = pgTable("stylist_services", {
  id: serial("id").primaryKey(),
  stylistId: integer("stylist_id")
    .notNull()
    .references(() => stylists.id, { onDelete: "cascade" }),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
});

export const workingHours = pgTable("working_hours", {
  id: serial("id").primaryKey(),
  stylistId: integer("stylist_id")
    .notNull()
    .references(() => stylists.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  stylistId: integer("stylist_id")
    .notNull()
    .references(() => stylists.id),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone").notNull(),
  bookingDate: date("booking_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const openingHours = pgTable("opening_hours", {
  dayOfWeek: integer("day_of_week").primaryKey(),
  isOpen: boolean("is_open").notNull().default(true),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export const stylistsRelations = relations(stylists, ({ many }) => ({
  stylistServices: many(stylistServices),
  workingHours: many(workingHours),
  bookings: many(bookings),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  stylistServices: many(stylistServices),
  bookings: many(bookings),
}));

export const stylistServicesRelations = relations(stylistServices, ({ one }) => ({
  stylist: one(stylists, {
    fields: [stylistServices.stylistId],
    references: [stylists.id],
  }),
  service: one(services, {
    fields: [stylistServices.serviceId],
    references: [services.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  stylist: one(stylists, {
    fields: [bookings.stylistId],
    references: [stylists.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));
