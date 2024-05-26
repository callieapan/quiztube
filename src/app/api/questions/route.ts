import { NextResponse } from 'next/server';

import { YoutubeTranscript } from 'youtube-transcript';
import { generateQuiz } from '../../services/gemini';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { youtubeId } = await req.json();

    const transcript = YoutubeTranscript.fetchTranscript(youtubeId, {
      lang: 'en',
    });
    let completeTranscript = '';
    (await transcript).map((t) => completeTranscript += t.text);
    const videoCleanTranscript = completeTranscript.replace(/[^\x00-\x7F]/g, '');


    const generatedQuestions = await generateQuiz(videoCleanTranscript);

    return NextResponse.json({ data: generatedQuestions });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
