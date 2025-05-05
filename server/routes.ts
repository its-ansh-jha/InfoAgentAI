import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { chatCompletionRequestSchema } from "@shared/schema";
import { generateOpenAIResponse } from "./services/openai";
import { generateDeepSeekResponse } from "./services/openrouter";
import { generateMaverickResponse, handleImageUpload } from "./services/openrouter-maverick";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Image upload endpoint
  app.post("/api/upload-image", async (req, res) => {
    try {
      await handleImageUpload(req, res);
    } catch (error: any) {
      log(`Error in image upload endpoint: ${error.message}`, "error");
      return res.status(500).json({ message: error.message || "Error processing image" });
    }
  });
  
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
        // Use Llama-4-Maverick model from OpenRouter instead
        response = await generateMaverickResponse(chatRequest);
      } else if (chatRequest.model === "deepseek-r1") {
        response = await generateDeepSeekResponse(chatRequest);
      } else if (chatRequest.model === "llama-4-maverick") {
        // Direct call to Llama-4-Maverick
        response = await generateMaverickResponse(chatRequest);
      } else {
        return res.status(400).json({ message: "Invalid model selection" });
      }
      
      // Log the response for debugging
      let previewContent = 'Complex content structure';
      
      if (response.content && typeof response.content === 'string') {
        previewContent = response.content.substring(0, 50);
      } else if (response.message && typeof response.message.content === 'string') {
        previewContent = response.message.content.substring(0, 50);
      }
      
      log(`Model ${chatRequest.model} response: ${previewContent}...`);
      
      // Return the response with compatibility for message format
      return res.status(200).json({
        message: response
      });
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
