import { 
  users, 
  type User, 
  type InsertUser, 
  puzzles, 
  type Puzzle, 
  type InsertPuzzle 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Puzzle CRUD operations
  getPuzzles(): Promise<Puzzle[]>;
  getPuzzle(id: number): Promise<Puzzle | undefined>;
  createPuzzle(puzzle: InsertPuzzle): Promise<Puzzle>;
  updatePuzzle(id: number, puzzle: Partial<InsertPuzzle>): Promise<Puzzle | undefined>;
  deletePuzzle(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Puzzle methods
  async getPuzzles(): Promise<Puzzle[]> {
    return await db.select().from(puzzles);
  }

  async getPuzzle(id: number): Promise<Puzzle | undefined> {
    const [puzzle] = await db.select().from(puzzles).where(eq(puzzles.id, id));
    return puzzle || undefined;
  }

  async createPuzzle(insertPuzzle: InsertPuzzle): Promise<Puzzle> {
    const [puzzle] = await db
      .insert(puzzles)
      .values(insertPuzzle)
      .returning();
    return puzzle;
  }

  async updatePuzzle(id: number, updateData: Partial<InsertPuzzle>): Promise<Puzzle | undefined> {
    const [updatedPuzzle] = await db
      .update(puzzles)
      .set(updateData)
      .where(eq(puzzles.id, id))
      .returning();
    return updatedPuzzle || undefined;
  }

  async deletePuzzle(id: number): Promise<boolean> {
    const result = await db
      .delete(puzzles)
      .where(eq(puzzles.id, id))
      .returning({ id: puzzles.id });
    
    // Reset the sequence after deletion to ensure new IDs are sequential
    if (result.length > 0) {
      await this.resetSequence();
    }
    
    return result.length > 0;
  }
  
  // Reset the auto-increment sequence to ensure new IDs are sequential
  async resetSequence(): Promise<void> {
    try {
      // This SQL will reset the sequence for the puzzles table
      await db.execute(
        `SELECT setval(pg_get_serial_sequence('puzzles', 'id'), COALESCE((SELECT MAX(id) FROM puzzles), 0) + 1, false);`
      );
    } catch (error) {
      console.error('Failed to reset sequence:', error);
    }
  }
}

// Initialize with default puzzles if none exist
const initializeDefaultPuzzles = async () => {
  const storage = new DatabaseStorage();
  const existingPuzzles = await storage.getPuzzles();
  
  if (existingPuzzles.length === 0) {
    console.log('Initializing default puzzles...');
    
    await storage.createPuzzle({
      rule: "Add 2 to each number and multiply by 3",
      inputs: ["2", "5", "8", "11", "14", "17"],
      outputs: ["12", "21", "30", "39", "48", "57"]
    });
    
    await storage.createPuzzle({
      rule: "Square the number and subtract 1",
      inputs: ["1", "2", "3", "4", "5", "6"],
      outputs: ["0", "3", "8", "15", "24", "35"]
    });
    
    await storage.createPuzzle({
      rule: "Multiply by 3 and add the original number",
      inputs: ["2", "4", "6", "8", "10", "12"],
      outputs: ["8", "16", "24", "32", "40", "48"]
    });
  }
};

// Create storage instance
export const storage = new DatabaseStorage();

// Initialize default puzzles
initializeDefaultPuzzles().catch(err => {
  console.error('Failed to initialize default puzzles:', err);
});
