'use client';

import React, { useState } from 'react';

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
import { ArrowRight, Loader2 } from 'lucide-react';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';

interface Answers {
  [key: number]: string;
}

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
  const [answers, setAnswers] = useState<Answers>({});
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  function handleAnswer(questionIndex: number, option: string) {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionIndex]: option };

      // Update score if this is the first time the question is being answered or if the answer is changed
      if (
        !prev[questionIndex] ||
        (prev[questionIndex] && option !== prev[questionIndex])
      ) {
        const correctAnswer = data[questionIndex].answer;
        const adjustment = option === correctAnswer ? 1 : -1;
        setScore((prevScore) => prevScore + adjustment);
      }

      // Check if all questions have been answered
      const allAnswered = Object.keys(updatedAnswers).length === data.length;
      setQuizComplete(allAnswered);

      return updatedAnswers;
    });
  }

  const user = useUser();
  const session = useSession();
  const router = useRouter();
  const { isLoggedIn } = useSession();
  const userId = session?.session?.user?.id;
  const [videoUrl, setVideoUrl] = useState('');
  const addVideo = useMutation(api.videos.addVideo);
  const addQuiz = useMutation(api.videos.addQuiz);
  function getYouTubeId(url: string): string | null {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: 'https://www.youtube.com/watch?v=tZVZQLyCDfo',
    },
  });
  const isLoading = form.formState.isSubmitting;
  const youtubeId = getYouTubeId(form.watch('videoUrl'));
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const [data, setData] = useState<any>(null);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (user.isSignedIn) {
        setVideoUrl(values.videoUrl);
        // Generate Quiz
        const response = await axios.post('/api/questions', {
          youtubeId: youtubeId,
        });
        setData(response.data.data);
      } else {
        router.push('/sign-in');
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(data);
  return (
    <div className="flex flex-col space-y-10 w-full">
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

      {videoUrl && (
        <div className="mt-10">
          <iframe
            width="620"
            height="315"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            className="rounded-xl"
          />
          {isLoading && (
            <div className="mt-10">
              <div className="flex flex-col space-y-1 items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="font-semibold">Generating Quiz...</span>
              </div>
            </div>
          )}
          {data?.map((question: any, index: number) => (
            <div key={index} className="my-4 p-5 shadow-lg rounded-lg bg-white">
              <h3 className="font-semibold">{question.question}</h3>
              <div className="mt-2">
                {question.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(index, option)}
                    className={`block p-2 my-2 text-left w-full border rounded hover:bg-gray-100 ${answers[index] === option ? 'bg-blue-100' : ''}`}
                  >
                    {option}
                    {answers[index] === option && (
                      <span
                        className={`font-bold ${option === question.answer ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {option === question.answer ? ' Correct' : ' Incorrect'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {quizComplete && (
            <div className="text-center p-5">
              <h2 className="text-lg font-semibold">
                Quiz Completed! Here are your results:
              </h2>
              <p>
                You got {score} out of {data.length} correct!
              </p>
              {data.map((question: any, index: number) => (
                <div
                  key={index}
                  className={`text-${answers[index] === question.answer ? 'green' : 'red'}-500`}
                >
                  Question {index + 1}:{' '}
                  {answers[index] === question.answer ? 'Correct' : 'Incorrect'}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
