import type { Project } from "@shared/schema";

export const staticProjects: Project[] = [
    {
        id: 1,
        title: "AI-Powered Business Incubator",
        slug: "ai-business-incubator",
        summary: "Automated startup validation and credit insights for founders",
        description:
            "A comprehensive platform that orchestrates 9 specialized AI agents to generate startup assets. Result: Achieved 99% time reduction in asset creation, generating over 15k assets.",
        techStack: ["LangGraph", "Python", "React", "OpenAI"],
        category: "featured",
        imageUrl:
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
        repoUrl: null,
        demoUrl: null,
        featured: true,
        priority: 1,
    },
    {
        id: 2,
        title: "Privacy-First AI Chat Platform",
        slug: "privacy-ai-chat",
        summary: "GDPR-compliant conversational agent with < 100ms latency",
        description:
            "An enterprise-grade chat platform focused on privacy. Implements PII scrubbing (Vision OCR + Text) and multi-provider LLM routing. Result: Zero data leaks reported during beta testing with 500+ users.",
        techStack: ["React", "FastAPI", "Stripe", "Encryption", "OCR"],
        category: "featured",
        imageUrl: "/privacy-chat.png",
        repoUrl: null,
        demoUrl: null,
        featured: true,
        priority: 2,
    },
    {
        id: 3,
        title: "AI Content Automation Platform",
        slug: "content-automation",
        summary: "End-to-end SEO publishing workflow reducing manual effort by 90%",
        description:
            "Automated content pipeline using LangGraph agents for SEO optimization and WordPress publishing. Result: Scaled content production from 5 to 100+ articles per week per editor.",
        techStack: ["LangGraph", "WordPress API", "SEO", "Translation"],
        category: "featured",
        imageUrl:
            "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1000",
        repoUrl: null,
        demoUrl: null,
        featured: true,
        priority: 3,
    },
    {
        id: 4,
        title: "Super Jugga Labs (SJL Bot)",
        slug: "sjl-bot",
        summary: "AI Credit Assistant processing 50+ daily queries",
        description:
            "Telegram-based automation for credit analysis using n8n workflows and OpenAI reasoning. Result: Reduced average query response time from 4 hours to 30 seconds.",
        techStack: ["n8n", "OpenAI", "Telegram API"],
        category: "additional",
        imageUrl:
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000",
        repoUrl: null,
        demoUrl: null,
        featured: false,
        priority: 4,
    },
    {
        id: 5,
        title: "Fake Job Posting Detection",
        slug: "job-detection",
        summary: "BiLSTM model achieving 98.22% detection accuracy",
        description:
            "Deep learning model trained on 18k job listings to detect fraudulent posts. Result: Outperformed traditional ML baselines by 14% F1-score.",
        techStack: ["Python", "TensorFlow", "NLP", "BiLSTM"],
        category: "additional",
        imageUrl:
            "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1000",
        repoUrl: null,
        demoUrl: null,
        featured: false,
        priority: 5,
    },
    {
        id: 6,
        title: "RAG Agent",
        slug: "rag-agent",
        summary: "High-precision retrieval system with sub-second latency",
        description:
            "Retrieval-Augmented Generation agent using FAISS vector indexing and LangChain. Result: Reduced hallucination rate by 40% on technical documentation queries.",
        techStack: ["FAISS", "LangChain", "FastAPI"],
        category: "additional",
        imageUrl:
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000",
        repoUrl: null,
        demoUrl: null,
        featured: false,
        priority: 6,
    },
];
