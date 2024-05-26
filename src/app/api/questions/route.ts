import { NextResponse } from 'next/server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { YoutubeTranscript } from 'youtube-transcript';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { youtubeId } = await req.json();

    const transcript = YoutubeTranscript.fetchTranscript(youtubeId, {
      lang: 'en',
    });
    const data = (await transcript).map((t) => t.text);

    const result = await generateText({
      model: google('models/gemini-pro'),
      messages: [
        { role: 'user', content: 'Hi!' },
        { role: 'assistant', content: 'Hello, how can I help?' },
        {
          role: 'user',
          content: 'Where can I buy the best Currywurst in Berlin? return in json',
        },
      ],
    });

    return NextResponse.json({ data: result.text });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
