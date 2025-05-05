import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { chatCompletionRequestSchema } from "@shared/schema";
import { generateOpenAIResponse } from "./services/openai";
import { generateDeepSeekResponse } from "./services/openrouter";
import { generateMaverickResponse, handleImageUpload } from "./services/openrouter-maverick";
import { handleSearch } from "./services/search";
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
        // Use OpenAI's GPT-4o-mini
        response = await generateOpenAIResponse(chatRequest);
      } else if (chatRequest.model === "deepseek-r1") {
        response = await generateDeepSeekResponse(chatRequest);
      } else if (chatRequest.model === "llama-4-maverick") {
        // For now, redirect to GPT-4o-mini since we're not using Maverick
        response = await generateOpenAIResponse(chatRequest);
      } else {
        return res.status(400).json({ message: "Invalid model selection" });
      }
      
      // Log the response for debugging
      let previewContent = 'Complex content structure';
      let formattedResponse;
      
      // Handle different response formats with proper type checking
      const hasRole = typeof response === 'object' && response !== null && 'role' in response;
      const hasContent = typeof response === 'object' && response !== null && 'content' in response;
      const hasMessage = typeof response === 'object' && response !== null && 'message' in response;
      
      if (hasRole && hasContent) {
        // Direct format from Maverick service
        const typedResponse = response as { role: string; content: any; model?: string };
        
        if (typeof typedResponse.content === 'string') {
          previewContent = typedResponse.content.substring(0, 50);
        }
        
        formattedResponse = {
          message: {
            role: typedResponse.role,
            content: typedResponse.content
          },
          model: typedResponse.model || chatRequest.model
        };
      } else if (hasMessage) {
        // Already in message format
        const typedResponse = response as { message: { role: string; content: string }; model: string };
        formattedResponse = typedResponse;
        
        if (typeof typedResponse.message.content === 'string') {
          previewContent = typedResponse.message.content.substring(0, 50);
        }
      } else {
        // Unknown format, try to adapt
        formattedResponse = {
          message: {
            role: 'assistant',
            content: JSON.stringify(response)
          },
          model: chatRequest.model
        };
      }
      
      log(`Model ${chatRequest.model} response: ${previewContent}...`);
      
      // Return the standardized response
      return res.status(200).json(formattedResponse);
    } catch (error: any) {
      log(`Error in chat endpoint: ${error.message}`, "error");
      return res.status(500).json({ message: error.message || "Something went wrong" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      await handleSearch(req, res);
    } catch (error: any) {
      log(`Error in search endpoint: ${error.message}`, "error");
      return res.status(500).json({ message: error.message || "Error performing search" });
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
