"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generateSimpleExplanation,
  type GenerateSimpleExplanationOutput,
} from "@/ai/flows/generate-simple-explanation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, BookText, Compass, Waypoints, HelpCircle } from "lucide-react";
import { Quiz } from "./quiz";
import { generateEvenSimplerExplanation } from "@/ai/flows/generate-even-simpler-explanation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const learnSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});

type LearnFormValues = z.infer<typeof learnSchema>;

export function LearnForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateSimpleExplanationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [simplerExplanation, setSimplerExplanation] = useState<string | null>(null);
  const [isGeneratingSimpler, setIsGeneratingSimpler] = useState(false);

  const form = useForm<LearnFormValues>({
    resolver: zodResolver(learnSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: LearnFormValues) {
    setLoading(true);
    setResult(null);
    setError(null);
    setSimplerExplanation(null);
    try {
      const explanation = await generateSimpleExplanation({
        topic: values.topic,
        preferredExplanationLength: "medium",
      });
      setResult(explanation);
    } catch (e) {
      setError("Failed to generate explanation. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuizFail() {
    if (!result) return;
    setIsGeneratingSimpler(true);
    setSimplerExplanation(null);
    try {
      const response = await generateEvenSimplerExplanation({ topic: result.simpleExplanation });
      setSimplerExplanation(response.simplerExplanation);
    } catch (e) {
      console.error("Failed to generate simpler explanation", e);
      // You could set an error state here as well
    } finally {
      setIsGeneratingSimpler(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Enter a topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Quantum Entanglement' or 'The Krebs Cycle'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Explain It Simply
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center rounded-lg border bg-card p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating your explanation...</p>
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <BookText className="w-6 h-6 text-primary" />
              <CardTitle className="font-headline">Simple Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{result.simpleExplanation}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Compass className="w-6 h-6 text-primary" />
              <CardTitle className="font-headline">Real-life Analogy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{result.analogy}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Waypoints className="w-6 h-6 text-primary" />
              <CardTitle className="font-headline">Mind Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-code">
                {result.mindMap}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <HelpCircle className="w-6 h-6 text-primary" />
              <CardTitle className="font-headline">Knowledge Check</CardTitle>
            </CardHeader>
            <CardContent>
              <Quiz questions={result.quiz} onQuizFail={handleQuizFail} />
            </CardContent>
          </Card>

          {isGeneratingSimpler && (
            <div className="flex items-center justify-center rounded-lg border bg-card p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Don't worry, let's try another angle. Generating a simpler explanation...</p>
            </div>
          )}

          {simplerExplanation && (
             <Alert variant="default" className="bg-secondary">
                <BookText className="h-4 w-4" />
                <AlertTitle className="font-headline">Let's Try Again: A Simpler View</AlertTitle>
                <AlertDescription className="prose prose-sm dark:prose-invert max-w-none">
                  {simplerExplanation}
                </AlertDescription>
            </Alert>
          )}

        </div>
      )}
    </div>
  );
}
