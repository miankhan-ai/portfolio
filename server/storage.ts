import { db } from "./db";
import { projects, skills, messages, type Project, type InsertProject, type Skill, type InsertSkill, type InsertMessage } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;

  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;

  createMessage(message: InsertMessage): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return await db!.select().from(projects).orderBy(asc(projects.priority));
  }

  async getProject(slug: string): Promise<Project | undefined> {
    const [project] = await db!.select().from(projects).where(eq(projects.slug, slug));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db!.insert(projects).values(insertProject).returning();
    return project;
  }

  async getSkills(): Promise<Skill[]> {
    return await db!.select().from(skills);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db!.insert(skills).values(insertSkill).returning();
    return skill;
  }

  async createMessage(insertMessage: InsertMessage): Promise<void> {
    await db!.insert(messages).values(insertMessage);
  }
}

export class MemStorage implements IStorage {
  private projects: Project[] = [];
  private skills: Skill[] = [];
  private messages: any[] = [];
  private projectId = 1;
  private skillId = 1;
  private messageId = 1;

  async getProjects(): Promise<Project[]> {
    return this.projects.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  async getProject(slug: string): Promise<Project | undefined> {
    return this.projects.find((p) => p.slug === slug);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = {
      ...insertProject,
      id: this.projectId++,
      repoUrl: insertProject.repoUrl || null,
      demoUrl: insertProject.demoUrl || null,
      featured: insertProject.featured || false,
      priority: insertProject.priority || 0,
    };
    this.projects.push(project);
    return project;
  }

  async getSkills(): Promise<Skill[]> {
    return this.skills;
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const skill: Skill = {
      ...insertSkill,
      id: this.skillId++,
      icon: insertSkill.icon || null,
    };
    this.skills.push(skill);
    return skill;
  }

  async createMessage(insertMessage: InsertMessage): Promise<void> {
    const message = {
      ...insertMessage,
      id: this.messageId++,
      createdAt: new Date(),
    };
    this.messages.push(message);
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
