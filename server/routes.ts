import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPuzzleSchema } from "@shared/schema";
import { z } from "zod";

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

  // Bulk import puzzles
  app.post("/api/puzzles/import", async (req, res) => {
    try {
      // Validate request body structure
      const bulkImportSchema = z.object({
        puzzles: z.array(insertPuzzleSchema)
      });
      
      const parsedBody = bulkImportSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid import data", 
          errors: parsedBody.error.format() 
        });
      }

      const { puzzles } = parsedBody.data;
      
      // Create each puzzle and collect results
      const results = [];
      for (const puzzleData of puzzles) {
        try {
          const newPuzzle = await storage.createPuzzle(puzzleData);
          results.push({
            success: true,
            puzzle: newPuzzle
          });
        } catch (error) {
          results.push({
            success: false,
            error: "Failed to create puzzle"
          });
        }
      }
      
      res.status(201).json({ 
        success: true,
        imported: results.filter(r => r.success).length,
        total: puzzles.length,
        results
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ message: "Failed to import puzzles" });
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
