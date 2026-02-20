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
      summary: "Automated startup validation and credit insights for founders",
      description: "A comprehensive platform that orchestrates 9 specialized AI agents to generate startup assets. Result: Achieved 99% time reduction in asset creation, generating over 15k assets.",
      techStack: ["LangGraph", "Python", "React", "OpenAI"],
      category: "featured",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
      featured: true,
      priority: 1
    });

    await storage.createProject({
      title: "Privacy-First AI Chat Platform",
      slug: "privacy-ai-chat",
      summary: "GDPR-compliant conversational agent with < 100ms latency",
      description: "An enterprise-grade chat platform focused on privacy. Implements PII scrubbing (Vision OCR + Text) and multi-provider LLM routing. Result: Zero data leaks reported during beta testing with 500+ users.",
      techStack: ["React", "FastAPI", "Stripe", "Encryption", "OCR"],
      category: "featured",
      imageUrl: "/privacy-chat.png",
      featured: true,
      priority: 2
    });

    await storage.createProject({
      title: "AI Content Automation Platform",
      slug: "content-automation",
      summary: "End-to-end SEO publishing workflow reducing manual effort by 90%",
      description: "Automated content pipeline using LangGraph agents for SEO optimization and WordPress publishing. Result: Scaled content production from 5 to 100+ articles per week per editor.",
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
      summary: "AI Credit Assistant processing 50+ daily queries",
      description: "Telegram-based automation for credit analysis using n8n workflows and OpenAI reasoning. Result: Reduced average query response time from 4 hours to 30 seconds.",
      techStack: ["n8n", "OpenAI", "Telegram API"],
      category: "additional",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      priority: 4
    });

    await storage.createProject({
      title: "Fake Job Posting Detection",
      slug: "job-detection",
      summary: "BiLSTM model achieving 98.22% detection accuracy",
      description: "Deep learning model trained on 18k job listings to detect fraudulent posts. Result: Outperformed traditional ML baselines by 14% F1-score.",
      techStack: ["Python", "TensorFlow", "NLP", "BiLSTM"],
      category: "additional",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      priority: 5
    });

    await storage.createProject({
      title: "RAG Agent",
      slug: "rag-agent",
      summary: "High-precision retrieval system with sub-second latency",
      description: "Retrieval-Augmented Generation agent using FAISS vector indexing and LangChain. Result: Reduced hallucination rate by 40% on technical documentation queries.",
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

import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  seedDatabase();

  // Configure nodemailer
  let transporter = null;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email service connection error:", error);
        console.log("📧 Email credentials found but connection failed. Emails will be logged to console instead.");
      } else {
        console.log("✅ Email service is ready to send messages");
      }
    });
  } else {
    console.warn("⚠️  Email service not configured. Set EMAIL_USER and EMAIL_PASS environment variables to enable contact form emails.");
  }

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

      // Prepare email content
      const emailContent = {
        from: process.env.EMAIL_USER || 'noreply@portfolio.dev',
        to: "miankhan.dev@gmail.com",
        subject: `New Portfolio Message from ${input.name}`,
        text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
        html: `
          <h3>New Portfolio Message</h3>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Message:</strong></p>
          <p>${input.message.replace(/\n/g, '<br>')}</p>
        `,
      };

      // Always log the email to console for debugging
      console.log('\n📧 ===== NEW CONTACT FORM SUBMISSION =====');
      console.log(`From: ${input.name} (${input.email})`);
      console.log(`Message: ${input.message}`);
      console.log('==========================================\n');

      // Send email if configured
      if (transporter) {
        try {
          console.log(`📤 Attempting to send email to miankhan.dev@gmail.com...`);
          const info = await transporter.sendMail(emailContent);
          console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
        } catch (mailError: any) {
          console.error("❌ Error sending email:", mailError.message);
          console.error("Full error:", mailError);
          // We don't fail the request if email fails, as message is already saved in DB
        }
      } else {
        console.log("⚠️  Email transporter not configured - email logged above");
      }

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
