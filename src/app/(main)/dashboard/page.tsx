'use client';

import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import YoutubeURLForm from '@/components/youtube-url-form';
import { useSession } from '@/lib/client-auth';
import { useQuery } from 'convex/react';
import { EllipsisVertical } from 'lucide-react';

import { DeleteVideoSheet } from '../_components/sheets/delete-video-sheet';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function DashboardPage() {
  const router = useRouter();
  const { session } = useSession();
  const userId = session?.user.id as Id<'users'>;
  const getVideos = useQuery(api.videos.getVideos, { userId: userId });

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

      {getVideos && getVideos?.length > 0 ? (
        <div>
          <div className="flex items-center justify-end">
            <span>{getVideos?.length} items</span>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {getVideos?.map((video, idx) => {
              const thumbnailUrl = video?.thumbnailUrl;
              return (
                <div key={idx}>
                  <Card
                    className="hover:shadow-lg duration-200 cursor-pointer"
                    onClick={() => {
                      router.push(`/learn/${video._id}`);
                    }}
                  >
                    <div className="relative h-full w-full p-4">
                      <Image
                        src={thumbnailUrl}
                        alt="Quiz Icon"
                        layout="responsive"
                        width={500}
                        height={300}
                        objectFit="contain"
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-end">
            <span>0 items</span>
          </div>
          <Separator />
          <div className="flex items-center justify-center pt-10">
            <span className="font-semibold">
              No videos have been added yet.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
