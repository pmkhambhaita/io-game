import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPuzzleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for puzzles
  app.get("/api/puzzles", async (req, res) => {
    try {
      const puzzles = await storage.getPuzzles();
      res.json(puzzles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch puzzles" });
    }
  });

  app.get("/api/puzzles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid puzzle ID" });
      }

      const puzzle = await storage.getPuzzle(id);
      if (!puzzle) {
        return res.status(404).json({ message: "Puzzle not found" });
      }

      res.json(puzzle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch puzzle" });
    }
  });

  app.post("/api/puzzles", async (req, res) => {
    try {
      const parsedBody = insertPuzzleSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid puzzle data", 
          errors: parsedBody.error.format() 
        });
      }

      const newPuzzle = await storage.createPuzzle(parsedBody.data);
      res.status(201).json(newPuzzle);
    } catch (error) {
      res.status(500).json({ message: "Failed to create puzzle" });
    }
  });

  app.put("/api/puzzles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid puzzle ID" });
      }

      const parsedBody = insertPuzzleSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid puzzle data", 
          errors: parsedBody.error.format() 
        });
      }

      const updatedPuzzle = await storage.updatePuzzle(id, parsedBody.data);
      if (!updatedPuzzle) {
        return res.status(404).json({ message: "Puzzle not found" });
      }

      res.json(updatedPuzzle);
    } catch (error) {
      res.status(500).json({ message: "Failed to update puzzle" });
    }
  });

  app.delete("/api/puzzles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid puzzle ID" });
      }

      const success = await storage.deletePuzzle(id);
      if (!success) {
        return res.status(404).json({ message: "Puzzle not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete puzzle" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
