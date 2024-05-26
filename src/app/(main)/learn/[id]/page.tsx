'use client';

import { get } from 'http';
import React from 'react';

import { YouTubeEmbed } from '@next/third-parties/google';
import { useQuery } from 'convex/react';

import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

export default function LearnPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const getVideo = useQuery(api.videos.getVideo, {
    videoId: params.id as Id<'videos'>,
  });

  return (
    <div>
      <div className="mt-10 flex items-center justify-center">
        <iframe
          width="620"
          height="315"
          src={`https://www.youtube.com/embed/${ getVideo?.videoId }`}
          className='rounded-xl'
        />
      </div>
      <div className="mt-10">
        <div className="">
          <span className="font-semibold">Questions</span>
        </div>
      </div>
    </div>
  );
}
