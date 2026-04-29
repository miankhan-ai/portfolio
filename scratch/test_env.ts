import * as dotenv from "dotenv";
dotenv.config();
console.log("AI_PROVIDER:", process.env.AI_PROVIDER);
console.log("AI_MODEL:", process.env.AI_MODEL);
console.log("AI_BASE_URL:", process.env.AI_BASE_URL);
console.log("AI_API_KEY set:", !!process.env.AI_API_KEY);
