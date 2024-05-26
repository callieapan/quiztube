import React from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';

const formSchema = z.object({
  videoUrl: z.string().min(2, {
    message: 'Need a YouTube URL',
  }),
});

export default function YoutubeURLForm() {
  const addVideo = useMutation(api.videos.addVideo);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
<<<<<<< HEAD
    try {
      addVideo({ videoUrl: values.videoUrl });
    } catch (error) {
      console.log(error);
    }
=======
    const response = await axios.post('/api/questions', {
      youtubeId: values.youtubeId,
    });
>>>>>>> c6bd1f9357dd72a37376426659665d319fe2b723
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
