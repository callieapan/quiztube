'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSession } from '@/lib/client-auth';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/button';

const formSchema = z.object({
  videoUrl: z.string().min(2, {
    message: 'Need a YouTube URL',
  }),
});

function getYouTubeId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function YoutubeURLForm() {
  const user = useUser();
  const session = useSession();
  const router = useRouter();
  const { isLoggedIn } = useSession();
  const userId = session?.session?.user?.id;

  const addVideo = useMutation(api.videos.addVideo);
  const addQuiz = useMutation(api.videos.addQuiz);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: 'https://www.youtube.com/watch?v=tZVZQLyCDfo',
    },
  });

  const youtubeId = getYouTubeId(form.watch('videoUrl'));
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (user.isSignedIn) {
        // Add Video Info to DB
        addVideo({
          videoUrl: values.videoUrl,
          userId: userId as Id<'users'>,
        });

        // Generate Quiz
        const response = await axios.post('/api/questions', {
          youtubeId: youtubeId,
        });

        console.log(response.data);
        if (response.data && response.data.questions) {
          addQuiz({
            videoId: youtubeId as string,
            questions: response.data.questions,
            createdBy: userId as string,
          });
        }
      } else {
        router.push('/sign-in');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row space-x-2 items-start w-full"
      >
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative h-10 w-full rounded-md">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=tZVZQLyCDfo"
                    {...field}
                    className="h-12 text-md w-full rounded-lg"
                  />
                  <Button
                    type="submit"
                    className="w-fit whitespace-nowrap group mt-0.5 flex flex-row items-center gap-1.5 absolute right-1.5 top-[22px] transform -translate-y-1/2   z-10 cursor-pointer"
                  >
                    <span>Generate Quiz</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 duration-200" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
