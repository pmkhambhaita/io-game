import { 
  users, 
  type User, 
  type InsertUser, 
  puzzles, 
  type Puzzle, 
  type InsertPuzzle 
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private puzzlesMap: Map<number, Puzzle>;
  currentUserId: number;
  currentPuzzleId: number;

  constructor() {
    this.users = new Map();
    this.puzzlesMap = new Map();
    this.currentUserId = 1;
    this.currentPuzzleId = 1;
    
    // Add some default puzzles
    this.createPuzzle({
      rule: "Add 2 to each number and multiply by 3",
      inputs: ["2", "5", "8", "11", "14", "17"],
      outputs: ["12", "21", "30", "39", "48", "57"]
    });
    
    this.createPuzzle({
      rule: "Square the number and subtract 1",
      inputs: ["1", "2", "3", "4", "5", "6"],
      outputs: ["0", "3", "8", "15", "24", "35"]
    });
    
    this.createPuzzle({
      rule: "Multiply by 3 and add the original number",
      inputs: ["2", "4", "6", "8", "10", "12"],
      outputs: ["8", "16", "24", "32", "40", "48"]
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Puzzle methods
  async getPuzzles(): Promise<Puzzle[]> {
    return Array.from(this.puzzlesMap.values());
  }

  async getPuzzle(id: number): Promise<Puzzle | undefined> {
    return this.puzzlesMap.get(id);
  }

  async createPuzzle(insertPuzzle: InsertPuzzle): Promise<Puzzle> {
    const id = this.currentPuzzleId++;
    const puzzle: Puzzle = { ...insertPuzzle, id };
    this.puzzlesMap.set(id, puzzle);
    return puzzle;
  }

  async updatePuzzle(id: number, updateData: Partial<InsertPuzzle>): Promise<Puzzle | undefined> {
    const existingPuzzle = this.puzzlesMap.get(id);
    if (!existingPuzzle) return undefined;
    
    const updatedPuzzle: Puzzle = {
      ...existingPuzzle,
      ...updateData
    };
    
    this.puzzlesMap.set(id, updatedPuzzle);
    return updatedPuzzle;
  }

  async deletePuzzle(id: number): Promise<boolean> {
    return this.puzzlesMap.delete(id);
  }
}

export const storage = new MemStorage();
