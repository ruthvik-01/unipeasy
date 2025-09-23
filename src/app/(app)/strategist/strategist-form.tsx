"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createPersonalizedStudyPlan,
  type CreatePersonalizedStudyPlanOutput,
} from "@/ai/flows/create-personalized-study-plan";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const strategistSchema = z.object({
  syllabus: z.any().refine(file => file?.length == 1, "Syllabus file is required."),
  timeframe: z.string().min(3, "Please enter a timeframe."),
  learningPace: z.enum(["slow", "medium", "fast"]),
  pastExamPapers: z.any().optional(),
});

type StrategistFormValues = z.infer<typeof strategistSchema>;

const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === "application/pdf") {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload/text", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to extract text from PDF. The server returned an invalid response." }));
      throw new Error(errorData.error || "Failed to extract text from PDF. An unknown error occurred.");
    }
    const data = await response.json();
    return data.text;
  } else {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
  }
};

export function StrategistForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreatePersonalizedStudyPlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<StrategistFormValues>({
    resolver: zodResolver(strategistSchema),
    defaultValues: {
      timeframe: "4 weeks",
      learningPace: "medium",
    },
  });

  async function onSubmit(values: StrategistFormValues) {
    setLoading(true);
    setResult(null);
    try {
      const syllabusFile = values.syllabus[0];
      const syllabus = await extractTextFromFile(syllabusFile);

      let pastExamPapers = "";
      if (values.pastExamPapers && values.pastExamPapers.length > 0) {
        const pastExamPapersFile = values.pastExamPapers[0];
        pastExamPapers = await extractTextFromFile(pastExamPapersFile);
      }
      
      const plan = await createPersonalizedStudyPlan({
        ...values,
        syllabus,
        pastExamPapers,
      });
      setResult(plan);
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: e.message || "Failed to generate study plan. Please try again.",
        });
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="syllabus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Syllabus (PDF, TXT, MD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.txt,.md"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="timeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeframe</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 weeks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="learningPace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Pace</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your pace" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="slow">Slow & Steady</SelectItem>
                          <SelectItem value="medium">Average</SelectItem>
                          <SelectItem value="fast">Fast-paced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="pastExamPapers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Exam Papers (PDF, TXT, MD, optional)</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept=".pdf,.txt,.md"
                            onChange={(e) => field.onChange(e.target.files)}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Study Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-secondary/50 dark:bg-card">
        <CardContent className="p-6">
            <h3 className="font-headline text-xl mb-4">Your Personalized Timetable</h3>
            {loading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {result && (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-code">
                    {result.studyPlan}
                </div>
            )}
            {!loading && !result && (
                <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                    <p className="font-semibold">Your study plan will appear here.</p>
                    <p>Fill out the form to get started.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
