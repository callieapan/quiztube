'use client';

import React from 'react';

import { Separator } from '@/components/ui/separator';
import YoutubeURLForm from '@/components/youtube-url-form';

export default function DashboardPage() {
  return (
    <div className="flex-1 h-full flex flex-col space-y-4">
      <div className="flex flex-col space-y-6 mt-24 mb-10 items-center justify-center">
        <span className="font-medium text-3xl">
          Enter a YouTube Video you would like to generate a quiz from
        </span>
        <div className="w-full max-w-2xl flex flex-row space-x-2 items-center justify-center">
          <YoutubeURLForm />
        </div>
      </div>
      <Separator />
    </div>
  );
}
