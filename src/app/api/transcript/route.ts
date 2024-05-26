import { NextResponse } from 'next/server';

import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { youtubeId } = await req.json();

    const transcript = YoutubeTranscript.fetchTranscript(youtubeId, {
      lang: 'en-US',
    });
    const data = (await transcript).map((t) => t.text);
    return NextResponse.json({ data: data });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
