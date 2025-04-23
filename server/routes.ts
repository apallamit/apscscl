import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { goodSeedSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Good Seeds API routes
  app.get("/api/good-seeds", async (req, res) => {
    try {
      const goodSeeds = await storage.getAllGoodSeeds();
      res.json(goodSeeds);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/good-seeds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const goodSeed = await storage.getGoodSeed(id);
      if (!goodSeed) {
        return res.status(404).json({ message: "Good seed not found" });
      }

      res.json(goodSeed);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/good-seeds", async (req, res) => {
    try {
      const validatedData = goodSeedSchema.parse(req.body);
      const newGoodSeed = await storage.createGoodSeed(validatedData);
      res.status(201).json(newGoodSeed);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create good seed" });
    }
  });

  app.put("/api/good-seeds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const validatedData = goodSeedSchema.parse(req.body);
      const updatedGoodSeed = await storage.updateGoodSeed(id, validatedData);
      
      if (!updatedGoodSeed) {
        return res.status(404).json({ message: "Good seed not found" });
      }

      res.json(updatedGoodSeed);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update good seed" });
    }
  });

  app.delete("/api/good-seeds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const deleted = await storage.deleteGoodSeed(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Good seed not found" });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
