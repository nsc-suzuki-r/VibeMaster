import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const levels = pgTable("levels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  levelNumber: integer("level_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  color: text("color").notNull(),
  isCompleted: boolean("is_completed").default(false),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  levelId: varchar("level_id").notNull().references(() => levels.id),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: timestamp("target_date").notNull(),
  levelId: varchar("level_id").references(() => levels.id),
  taskId: varchar("task_id").references(() => tasks.id),
  isCompleted: boolean("is_completed").default(false),
  type: text("type").notNull(), // 'weekly' | 'monthly' | 'custom'
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const learningNotes = pgTable("learning_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  content: text("content").notNull(),
  levelId: varchar("level_id").references(() => levels.id),
  taskId: varchar("task_id").references(() => tasks.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  streakDays: integer("streak_days").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  totalTasksCompleted: integer("total_tasks_completed").default(0),
  overallProgress: integer("overall_progress").default(0),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertLevelSchema = createInsertSchema(levels).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export const insertLearningNoteSchema = createInsertSchema(learningNotes).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true,
});

export type Level = typeof levels.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;
export type LearningNote = typeof learningNotes.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;

export type InsertLevel = z.infer<typeof insertLevelSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type InsertLearningNote = z.infer<typeof insertLearningNoteSchema>;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
