import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertScheduleSchema, insertLearningNoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Levels
  app.get("/api/levels", async (req, res) => {
    try {
      const levels = await storage.getLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch levels" });
    }
  });

  app.get("/api/levels/:id", async (req, res) => {
    try {
      const level = await storage.getLevel(req.params.id);
      if (!level) {
        return res.status(404).json({ message: "Level not found" });
      }
      res.json(level);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch level" });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const { levelId } = req.query;
      let tasks;
      
      if (levelId) {
        tasks = await storage.getTasksByLevel(levelId as string);
      } else {
        tasks = await storage.getTasks();
      }
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Schedules
  app.get("/api/schedules", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let schedules;
      
      if (startDate && endDate) {
        schedules = await storage.getSchedulesByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        schedules = await storage.getSchedules();
      }
      
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse({
        ...req.body,
        targetDate: new Date(req.body.targetDate)
      });
      const schedule = await storage.createSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ message: "Invalid schedule data" });
    }
  });

  app.patch("/api/schedules/:id", async (req, res) => {
    try {
      const updates = { ...req.body };
      if (updates.targetDate) {
        updates.targetDate = new Date(updates.targetDate);
      }
      
      const schedule = await storage.updateSchedule(req.params.id, updates);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to update schedule" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSchedule(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  });

  // Learning Notes
  app.get("/api/learning-notes", async (req, res) => {
    try {
      const notes = await storage.getLearningNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning notes" });
    }
  });

  app.post("/api/learning-notes", async (req, res) => {
    try {
      const validatedData = insertLearningNoteSchema.parse(req.body);
      const note = await storage.createLearningNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid learning note data" });
    }
  });

  app.patch("/api/learning-notes/:id", async (req, res) => {
    try {
      const note = await storage.updateLearningNote(req.params.id, req.body);
      if (!note) {
        return res.status(404).json({ message: "Learning note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to update learning note" });
    }
  });

  app.delete("/api/learning-notes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLearningNote(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Learning note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete learning note" });
    }
  });

  // User Stats
  app.get("/api/user-stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.patch("/api/user-stats", async (req, res) => {
    try {
      const stats = await storage.updateUserStats(req.body);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
