import OpenAI from "openai";
import { ChatCompletionRequest, ChatCompletionResponse } from "@shared/schema";
import { log } from "../vite";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o-mini";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateOpenAIResponse(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured.");
    }

    log(`Sending request to ${MODEL}`);
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: request.messages,
    });

    if (!response.choices[0].message.content) {
      throw new Error("OpenAI returned an empty response");
    }

    return {
      message: {
        role: "assistant",
        content: response.choices[0].message.content,
      },
      model: "gpt-4o-mini",
    };
  } catch (error: any) {
    log(`OpenAI API error: ${error.message}`, "error");
    
    if (error.response) {
      // If it's an OpenAI API error with a response
      const status = error.response.status;
      const errorData = error.response.data || {};
      
      if (status === 401) {
        throw new Error("Invalid API key or authentication error");
      } else if (status === 429) {
        throw new Error("Rate limit exceeded or quota reached");
      } else {
        throw new Error(`OpenAI API error (${status}): ${errorData.error?.message || 'Unknown error'}`);
      }
    }
    
    // For any other error
    throw new Error(`Error generating response: ${error.message}`);
  }
}
