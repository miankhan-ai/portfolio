import type { Skill } from "@shared/schema";

export const staticSkills: Skill[] = [
    {
        id: 1,
        category: "AI & ML",
        items: ["LLMs", "RAG", "Agentic AI", "Deep Learning", "NLP", "Computer Vision"],
        icon: "Brain",
    },
    {
        id: 2,
        category: "Backend & APIs",
        items: ["FastAPI", "REST", "Async Systems", "Background Workers"],
        icon: "Server",
    },
    {
        id: 3,
        category: "Data & MLOps",
        items: ["Vector Databases", "Embeddings", "Model Evaluation"],
        icon: "Database",
    },
    {
        id: 4,
        category: "Automation",
        items: ["n8n", "Scheduled Pipelines", "Workflow Orchestration"],
        icon: "Workflow",
    },
    {
        id: 5,
        category: "Security & SaaS",
        items: ["Auth", "JWT", "OTP", "Encryption", "Stripe", "RBAC"],
        icon: "Shield",
    },
    {
        id: 6,
        category: "Tools",
        items: ["OpenAI", "LangChain", "LangGraph", "FAISS", "Qdrant", "MongoDB"],
        icon: "Wrench",
    },
];
