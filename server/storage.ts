import { users, type User, type InsertUser, type GoodSeed, type InsertGoodSeed } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Good Seeds methods
  getGoodSeed(id: number): Promise<GoodSeed | undefined>;
  getAllGoodSeeds(): Promise<GoodSeed[]>;
  createGoodSeed(goodSeed: InsertGoodSeed): Promise<GoodSeed>;
  updateGoodSeed(id: number, goodSeed: InsertGoodSeed): Promise<GoodSeed | undefined>;
  deleteGoodSeed(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private goodSeeds: Map<number, GoodSeed>;
  private userId: number;
  private goodSeedId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.goodSeeds = new Map();
    this.userId = 1;
    this.goodSeedId = 1;
    this.sessionStore = new (createMemoryStore(session))({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
    
    // Seed initial data
    this.seedInitialData();
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
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Good Seeds methods
  async getGoodSeed(id: number): Promise<GoodSeed | undefined> {
    return this.goodSeeds.get(id);
  }
  
  async getAllGoodSeeds(): Promise<GoodSeed[]> {
    return Array.from(this.goodSeeds.values());
  }
  
  async createGoodSeed(goodSeed: InsertGoodSeed): Promise<GoodSeed> {
    const id = this.goodSeedId++;
    const createdAt = new Date().toISOString();
    const newGoodSeed: GoodSeed = { ...goodSeed, id, createdAt };
    this.goodSeeds.set(id, newGoodSeed);
    return newGoodSeed;
  }
  
  async updateGoodSeed(id: number, goodSeed: InsertGoodSeed): Promise<GoodSeed | undefined> {
    const existingGoodSeed = this.goodSeeds.get(id);
    if (!existingGoodSeed) {
      return undefined;
    }
    
    const updatedGoodSeed: GoodSeed = { 
      ...existingGoodSeed, 
      ...goodSeed,
      id, 
      createdAt: existingGoodSeed.createdAt 
    };
    
    this.goodSeeds.set(id, updatedGoodSeed);
    return updatedGoodSeed;
  }
  
  async deleteGoodSeed(id: number): Promise<boolean> {
    return this.goodSeeds.delete(id);
  }
  
  // Seed initial data for demo purposes
  private seedInitialData() {
    // Seed sample good seeds
    const goodSeeds: InsertGoodSeed[] = [
      {
        district: "Hyderabad",
        transportType: "Truck",
        goodName: "Rice",
        routeAddress: "123 Main St, Hyderabad",
        street: "123 Main St",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        latitude: 17.385044,
        longitude: 78.486671,
      },
      {
        district: "Bangalore",
        transportType: "Train",
        goodName: "Wheat",
        routeAddress: "456 Park Ave, Bangalore",
        street: "456 Park Ave",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        latitude: 12.971599,
        longitude: 77.594563,
      },
    ];
    
    // Add sample good seeds
    goodSeeds.forEach(goodSeed => {
      this.createGoodSeed(goodSeed);
    });
  }
}

// Export a singleton instance
export const storage = new MemStorage();
