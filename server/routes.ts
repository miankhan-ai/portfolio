import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";

async function seedDatabase() {
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    // Featured Projects
    await storage.createProject({
      title: "AI-Powered Business Incubator",
      slug: "ai-business-incubator",
      summary: "9-agent LangGraph orchestration platform for startup generation",
      description: "A comprehensive platform that orchestrates 9 specialized AI agents to generate startup assets. Features state preservation across stages, finance simulations, brand generation, and code generation. Achieved 99% time reduction in asset creation, generating over 15k assets.",
      techStack: ["LangGraph", "Python", "React", "OpenAI"],
      category: "featured",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
      featured: true,
      priority: 1
    });

    await storage.createProject({
      title: "Privacy-First AI Chat Platform",
      slug: "privacy-ai-chat",
      summary: "Secure SaaS with PII scrubbing and multi-provider routing",
      description: "An enterprise-grade chat platform focused on privacy. Implements PII scrubbing (Vision OCR + Text), two-phase review process, end-to-end encryption, and multi-provider LLM routing. Monitored via Stripe integration.",
      techStack: ["React", "FastAPI", "Stripe", "Encryption", "OCR"],
      category: "featured",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000",
      featured: true,
      priority: 2
    });

    await storage.createProject({
      title: "AI Content Automation Platform",
      slug: "content-automation",
      summary: "Multi-agent system for SEO and WordPress publishing",
      description: "Automated content pipeline using LangGraph agents for SEO optimization, translation, and direct WordPress publishing. Includes human-in-the-loop workflows for quality assurance.",
      techStack: ["LangGraph", "WordPress API", "SEO", "Translation"],
      category: "featured",
      imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1000",
      featured: true,
      priority: 3
    });

    // Additional Projects
    await storage.createProject({
      title: "Super Jugga Labs (SJL Bot)",
      slug: "sjl-bot",
      summary: "AI Credit Assistant via Telegram",
      description: "Telegram-based automation for credit analysis using n8n workflows and OpenAI reasoning. Integrates with SmartCredit and PDF parsing tools.",
      techStack: ["n8n", "OpenAI", "Telegram API"],
      category: "additional",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      priority: 4
    });

    await storage.createProject({
      title: "Fake Job Posting Detection",
      slug: "job-detection",
      summary: "BiLSTM model with 98.22% accuracy",
      description: "Deep learning model trained on 18k job listings to detect fraudulent posts. Uses NLP preprocessing and BiLSTM architecture. Improved accuracy from 1.1% baseline to 98.22%.",
      techStack: ["Python", "TensorFlow", "NLP", "BiLSTM"],
      category: "additional",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      priority: 5
    });

    await storage.createProject({
      title: "RAG Agent",
      slug: "rag-agent",
      summary: "High-precision retrieval system",
      description: "Retrieval-Augmented Generation agent using FAISS vector indexing and LangChain orchestration. Deployed via FastAPI. Significantly reduced hallucinations in technical queries.",
      techStack: ["FAISS", "LangChain", "FastAPI"],
      category: "additional",
      imageUrl: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      priority: 6
    });
  }

  const existingSkills = await storage.getSkills();
  if (existingSkills.length === 0) {
    await storage.createSkill({ category: "AI & ML", items: ["LLMs", "RAG", "Agentic AI", "Deep Learning", "NLP", "Computer Vision"], icon: "Brain" });
    await storage.createSkill({ category: "Backend & APIs", items: ["FastAPI", "REST", "Async Systems", "Background Workers"], icon: "Server" });
    await storage.createSkill({ category: "Data & MLOps", items: ["Vector Databases", "Embeddings", "Model Evaluation"], icon: "Database" });
    await storage.createSkill({ category: "Automation", items: ["n8n", "Scheduled Pipelines", "Workflow Orchestration"], icon: "Workflow" });
    await storage.createSkill({ category: "Security & SaaS", items: ["Auth", "JWT", "OTP", "Encryption", "Stripe", "RBAC"], icon: "Shield" });
    await storage.createSkill({ category: "Tools", items: ["OpenAI", "LangChain", "LangGraph", "FAISS", "Qdrant", "MongoDB"], icon: "Wrench" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  seedDatabase();

  app.get(api.projects.list.path, async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  app.get(api.skills.list.path, async (_req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = insertMessageSchema.parse(req.body);
      await storage.createMessage(input);
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
