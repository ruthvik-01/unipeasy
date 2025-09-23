"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/ai/flows/generate-simple-explanation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle, Award, BookDashed } from "lucide-react";

interface QuizProps {
  questions: QuizQuestion[];
  onQuizFail: () => void;
}

export function Quiz({ questions, onQuizFail }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let finalScore = 0;
    questions.forEach((q, index) => {
      if (q.correctAnswer === selectedAnswers[index]) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setShowResults(true);

    if (finalScore < 3) {
      onQuizFail();
    }
  };

  if (showResults && score !== null) {
    return (
      <Card className="bg-secondary/50">
        <CardContent className="p-6 text-center">
            {score >= 3 ? (
                 <Award className="mx-auto h-12 w-12 text-green-500" />
            ) : (
                <BookDashed className="mx-auto h-12 w-12 text-yellow-500" />
            )}
          <CardTitle className="mt-4 font-headline text-2xl">Quiz Complete!</CardTitle>
          <CardDescription className="mt-2 text-lg">
            You scored {score} out of {questions.length}.
          </CardDescription>
          <div className="mt-6 space-y-4 text-left">
            {questions.map((q, index) => (
              <div key={index} className="rounded-lg border bg-background p-4">
                <p className="font-semibold">{q.question}</p>
                <div className="mt-2 flex items-center gap-2">
                  {selectedAnswers[index] === q.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <p className={selectedAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-destructive'}>
                    Your answer: {selectedAnswers[index] || "Not answered"}
                  </p>
                </div>
                {selectedAnswers[index] !== q.correctAnswer && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Correct answer: {q.correctAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <p className="mt-1 font-semibold text-lg">{currentQuestion.question}</p>
      </div>

      <RadioGroup
        onValueChange={handleAnswerSelect}
        value={selectedAnswers[currentQuestionIndex]}
        className="space-y-3"
      >
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
            <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
            <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="font-normal cursor-pointer flex-1">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={!selectedAnswers[currentQuestionIndex]}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex]}>
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
}
