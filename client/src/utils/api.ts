import { Message } from '@/types';

export interface ImageData {
  type: 'image';
  image_data: string;
}

export interface TextData {
  type: 'text';
  text: string;
}

export type MessageContent = string | (TextData | ImageData)[];

export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64Data = reader.result as string;
      resolve(base64Data);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

export async function sendMessageWithImage(
  content: string,
  imageData: string | null,
  model: 'gpt-4o-mini' | 'llama-4-maverick',
  messages: Message[]
): Promise<Message> {
  try {
    let messageContent: MessageContent;
    
    // If there's an image, create a multimodal message
    if (imageData) {
      messageContent = [
        { type: 'text', text: content },
        { type: 'image', image_data: imageData }
      ];
    } else {
      messageContent = content;
    }
    
    // Convert messages for API format
    const apiMessages = messages.map(({ role, content }) => ({ 
      role, 
      content 
    }));
    
    // Add the new message with possibly multimodal content
    const newMessage = {
      role: 'user' as const,
      content: messageContent
    };
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [...apiMessages, newMessage],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error communicating with API');
    }

    const data = await response.json();
    
    return {
      role: data.message.role,
      content: data.message.content,
      model,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error sending message with image:', error);
    throw error;
  }
}

export async function sendMessage(
  content: string,
  model: 'gpt-4o-mini' | 'llama-4-maverick',
  messages: Message[]
): Promise<Message> {
  try {
    // Use the model parameter directly (GPT-4o-mini as requested)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error communicating with API');
    }

    const data = await response.json();
    
    return {
      role: data.message.role,
      content: data.message.content,
      model: model,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
