import { Message } from '@/types';

export async function sendMessage(
  content: string,
  model: 'gpt-4o-mini',
  messages: Message[]
): Promise<Message> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
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
      model,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
