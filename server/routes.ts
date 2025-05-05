import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { chatCompletionRequestSchema } from "@shared/schema";
import { generateOpenAIResponse } from "./services/openai";
import { generateDeepSeekResponse } from "./services/openrouter";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat completion endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      // Validate request payload
      const validationResult = chatCompletionRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request format", 
          errors: validationResult.error.format() 
        });
      }
      
      const chatRequest = validationResult.data;
      let response;
      
      // Route to appropriate model
      if (chatRequest.model === "gpt-4o-mini") {
        response = await generateOpenAIResponse(chatRequest);
      } else if (chatRequest.model === "deepseek-r1") {
        response = await generateDeepSeekResponse(chatRequest);
      } else {
        return res.status(400).json({ message: "Invalid model selection" });
      }
      
      log(`Model ${chatRequest.model} response: ${response.message.content.substring(0, 50)}...`);
      
      // Return the response
      return res.status(200).json(response);
    } catch (error: any) {
      log(`Error in chat endpoint: ${error.message}`, "error");
      return res.status(500).json({ message: error.message || "Something went wrong" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const missingKeys = [];
    
    if (!process.env.OPENAI_API_KEY) {
      missingKeys.push("OPENAI_API_KEY");
    }
    
    if (!process.env.OPENROUTER_API_KEY) {
      missingKeys.push("OPENROUTER_API_KEY");
    }
    
    if (missingKeys.length > 0) {
      return res.status(500).json({ 
        status: "error", 
        message: `Missing API keys: ${missingKeys.join(", ")}` 
      });
    }
    
    return res.status(200).json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
