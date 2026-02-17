import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// ============ Configuration ============

export const maxDuration = 30;

// ============ Handler ============

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
