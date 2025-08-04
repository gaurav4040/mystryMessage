

import { streamText } from "ai";
// import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const prompt =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
  try {
    const  result = streamText({
      model: "openai/gpt-4.1",
      prompt: prompt
    });

    for await (const textPart of result.textStream) {
      console.log('ai stream is here==>>>',textPart);
      return textPart;
    }

  } catch (error) {
    
      console.log(`an unexpected error occured`, error);
      throw error;
    }
  }

