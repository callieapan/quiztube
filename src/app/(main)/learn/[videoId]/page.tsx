'use client';

import React, { useState } from 'react';

import { YouTubeEmbed } from '@next/third-parties/google';
import { useQuery } from 'convex/react';

import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

interface Answers {
  [key: number]: string;
}

export default function LearnPage({ params }: { params: { videoId: string } }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const videoId = params.videoId;
  const getVideo = useQuery(api.videos.getVideo, {
    videoId: videoId as Id<'videos'>,
  });
  const getQuiz = useQuery(api.quizzes.getQuiz, {
    videoId: videoId as Id<'videos'>,
  });

  function handleAnswer(questionIndex: number, option: string) {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionIndex]: option };

      // Update score if this is the first time the question is being answered or if the answer is changed
      if (
        !prev[questionIndex] ||
        (prev[questionIndex] && option !== prev[questionIndex])
      ) {
        const correctAnswer = getQuiz?.questions[questionIndex].answer;
        const adjustment = option === correctAnswer ? 1 : -1;
        setScore((prevScore) => prevScore + adjustment);
      }

      // Check if all questions have been answered
      const allAnswered =
        Object.keys(updatedAnswers).length === getQuiz?.questions.length;
      setQuizComplete(allAnswered);

      return updatedAnswers;
    });
  }
  return (
    <div>
      <div className="mt-10 flex items-center justify-center">
        <iframe
          width="620"
          height="315"
          src={`https://www.youtube.com/embed/${getVideo?.youtubeId}`}
          className="rounded-xl"
        />
      </div>
      <div className="mt-10">
        <div className="max-w-2xl mx-auto pb-10 ">
          {getQuiz?.questions?.map((question: any, index: number) => (
            <div key={index} className="my-4 p-5 shadow-lg rounded-lg bg-white">
              <h3 className="font-semibold">{index + 1}. {question.question}</h3>
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
                You got {score} out of {getQuiz?.questions.length} correct!
              </p>
              {getQuiz?.questions.map((question: any, index: number) => (
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
      </div>
    </div>
  );
}
