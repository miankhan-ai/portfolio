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
  let transporter: nodemailer.Transporter | null = null;

  const getTransporter = () => {
    if (transporter) return transporter;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      return transporter;
    }
    return null;
  };

  // Initial check
  if (getTransporter()) {
    transporter!.verify((error) => {
      if (error) {
        console.error("❌ Email service connection error:", error.message);
      } else {
        console.log("✅ Email service is ready to send messages via Gmail");
      }
    });
  } else {
    console.warn("⚠️  Email service not configured. Ensure EMAIL_USER and EMAIL_PASS are set in your deployment environment.");
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
        from: `"${input.name}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: input.email,
        subject: `New Portfolio Message from ${input.name}`,
        text: `Name: ${input.name}\nEmail: ${input.email}\nCompany: ${input.company || 'N/A'}\n\nMessage:\n${input.message}`,
        html: `
          <h3>New Portfolio Message</h3>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Company:</strong> ${input.company || 'N/A'}</p>
          <hr />
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
      const currentTransporter = getTransporter();
      if (currentTransporter) {
        try {
          console.log(`📤 Attempting to send email to ${process.env.EMAIL_USER}...`);
          const info = await currentTransporter.sendMail(emailContent);
          console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
        } catch (mailError: any) {
          console.error("❌ Error sending email:", mailError.message);
          // We don't fail the request if email fails, as message is already saved in DB
        }
      } else {
        console.warn("⚠️ Email not sent: EMAIL_USER or EMAIL_PASS not set in environment.");
      }

      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("❌ Submission error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chatbot-query", async (req, res) => {
    const inputSchema = api.chat.complete.input ?? z.any();

    const parsed = inputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0]?.message || "Invalid request",
        field: parsed.error.errors[0]?.path?.join("."),
      });
    }

    const { messages } = parsed.data;
    const userText = [...messages].reverse().find((m: any) => m.role === "user")?.content ?? "";

    // Build a grounded context from DB content
    const [projects, skills] = await Promise.all([
      storage.getProjects(),
      storage.getSkills(),
    ]);

    const q = userText.toLowerCase();
    const tokenize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s+#.-]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

    const qTokens = new Set(tokenize(q));

    const scoreText = (text: string) => {
      const tokens = tokenize(text);
      let score = 0;
      for (const t of tokens) if (qTokens.has(t)) score += 1;
      return score;
    };

    const topProjects = [...projects]
      .map((p) => ({
        p,
        score:
          scoreText(p.title) * 3 +
          scoreText(p.summary) * 2 +
          scoreText(p.description) +
          scoreText(p.techStack.join(" ")) * 2,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ p }) => p);

    const topSkills = [...skills]
      .map((s) => ({
        s,
        score: scoreText(s.category) * 2 + scoreText(s.items.join(" ")) * 2,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ s }) => s);

    const baseSystem = `You are an AI assistant representing Mian Khan, an ML engineer based in Lahore, Pakistan.
Your job is to answer questions from recruiters, employers, and collaborators about Mian Khan's background, skills, projects, and availability.
Be concise, professional, and friendly. 

STRICT FORMATTING RULES:
- Use structured Markdown (bullet points, bold text, headers).
- NEVER use large blocks of text.
- Use bolding for key tech stack items and metrics.
- Break down information into clear, scannable sections.

About Mian Khan:
- Specializes in **ML pipelines**, **model deployment**, and **AI infrastructure**
- Has deployed **50+ models** in production environments
- Achieved **95% automation** of manual processes and **98% error reduction**
- Maintains **99.9% uptime** across monitored systems
- Tech stack: **Python**, **PyTorch**, **TensorFlow**, **Kubernetes**, **Docker**, **MLflow**, **Airflow**, **FastAPI**
- Open to freelance projects, consulting, and full-time remote roles
- Based in Lahore, PK — available for international remote work
- Booking link: https://calendly.com/miankhan-dev/30min

When someone asks to book a call or schedule a meeting, share the booking link above and ask for their preferred time zone.`;

    const groundedContext = `Portfolio context (use this to stay relevant; do not invent projects/claims not present here):

Top projects:
${topProjects
  .map(
    (p) =>
      `- ${p.title}: ${p.summary}\n  Tech: ${p.techStack.join(", ")}\n  Details: ${p.description}`,
  )
  .join("\n")}

Top skills:
${topSkills.map((s) => `- ${s.category}: ${s.items.join(", ")}`).join("\n")}
`;

    const system = `${baseSystem}\n\n${groundedContext}`;

    const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
    const model =
      process.env.AI_MODEL ||
      (provider === "ollama" ? "llama3" : "gpt-4o-mini");

    // Stream back as SSE
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    const sendDelta = (delta: string) => {
      res.write(`data: ${JSON.stringify({ delta })}\n\n`);
    };
    const sendDone = () => {
      res.write(`event: done\ndata: {}\n\n`);
      res.end();
    };

    try {
      if (provider === "ollama") {
        const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
        const r = await fetch(`${ollamaUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: system },
              ...messages.map((m: any) => ({ role: m.role, content: m.content })),
            ],
            stream: true,
          }),
        });

        if (!r.ok || !r.body) {
          const text = await r.text().catch(() => "");
          throw new Error(`Ollama error ${r.status}: ${text}`);
        }

        const reader = r.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const data = JSON.parse(trimmed);
              const delta = data?.message?.content;
              if (typeof delta === "string" && delta.length) sendDelta(delta);
              if (data?.done) {
                sendDone();
                return;
              }
            } catch {
              // ignore malformed chunks
            }
          }
        }

        sendDone();
        return;
      }

      // OpenAI-compatible providers (OpenAI/Groq/Together/etc.)
      const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
      const apiKey = process.env.AI_API_KEY || process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
      if (!apiKey) throw new Error("Missing AI_API_KEY / GROQ_API_KEY");

      const r = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          stream: true,
          messages: [
            { role: "system", content: system },
            ...messages.map((m: any) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!r.ok || !r.body) {
        const text = await r.text().catch(() => "");
        throw new Error(`Provider error ${r.status}: ${text}`);
      }

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE parsing
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const lines = part.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") {
              sendDone();
              return;
            }
            try {
              const json = JSON.parse(payload);
              const delta = json?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length) {
                console.log("💬 AI Delta:", delta);
                sendDelta(delta);
              }
            } catch {
              // ignore
            }
          }
        }
      }

      sendDone();
    } catch (e: any) {
      console.error("❌ Chat API error:", e.message);
      if (e.stack) console.error(e.stack);
      const msg = e?.message || "Chat error";
      res.write(`event: error\ndata: ${JSON.stringify({ message: msg })}\n\n`);
      res.end();
    }
  });

  return httpServer;
}
