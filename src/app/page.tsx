'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  youtubeId: z.string().min(2, {
    message: 'Need a youtubeId',
  }),
});

export default function Home() {
  const [transcript, setTranscript] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeId: 'tZVZQLyCDfo',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await axios.post('/api/transcript', {
      youtubeId: values.youtubeId,
    });

    setTranscript(response.data.data);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center space-y-8 w-full">
        <span className="font-bold text-3xl">QuizTube</span>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="youtubeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Id</FormLabel>
                  <FormControl>
                    <Input placeholder="tZVZQLyCDfo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <p>{transcript}</p>
      </div>
    </main>
  );
}
