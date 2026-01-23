"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import {
  generateSimpleExplanation,
  type GenerateSimpleExplanationOutput,
} from "@/ai/flows/generate-simple-explanation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, BookText, Compass, Waypoints, HelpCircle, Save, Search, History, X } from "lucide-react";
import { Quiz } from "./quiz";
import { generateEvenSimplerExplanation } from "@/ai/flows/generate-even-simpler-explanation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useMemoryPalace } from "@/context/memory-palace-context";
import { useToast } from "@/hooks/use-toast";
import { MaterialRecommendations } from "@/components/materials/material-recommendations";
import { useAuth } from "@/context/auth-context";
import { trackTopicLearned } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";


const learnSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});

type LearnFormValues = z.infer<typeof learnSchema>;

const SEARCH_HISTORY_KEY = 'learnSearchHistory';
const MAX_HISTORY_ITEMS = 10;

interface SearchHistoryItem {
  topic: string;
  timestamp: number;
}

export function LearnForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateSimpleExplanationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [simplerExplanation, setSimplerExplanation] = useState<string | null>(null);
  const [isGeneratingSimpler, setIsGeneratingSimpler] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { addMemoryItem } = useMemoryPalace();
  const { toast } = useToast();
  const { user } = useAuth();

  // Load search history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load search history', e);
    }
  }, []);

  const addToSearchHistory = (topic: string) => {
    const newItem: SearchHistoryItem = { topic, timestamp: Date.now() };
    const filtered = searchHistory.filter(item => item.topic.toLowerCase() !== topic.toLowerCase());
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(updated);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  };

  const removeFromHistory = (topic: string) => {
    const updated = searchHistory.filter(item => item.topic !== topic);
    setSearchHistory(updated);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const form = useForm<LearnFormValues>({
    resolver: zodResolver(learnSchema),
    defaultValues: {
      topic: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Reset form state when starting a new search
  const startNewSearch = (topic?: string) => {
    setResult(null);
    setError(null);
    setSimplerExplanation(null);
    if (topic) {
      form.setValue('topic', topic, { shouldValidate: true });
    }
  };

  async function onSubmit(values: LearnFormValues) {
    setLoading(true);
    setResult(null);
    setError(null);
    setSimplerExplanation(null);
    setShowHistory(false);
    try {
      const explanation = await generateSimpleExplanation({
        topic: values.topic,
        preferredExplanationLength: "medium",
      });
      setResult(explanation);
      
      // Add to search history
      addToSearchHistory(values.topic);
      
      // Track topic learned
      if (user?.uid) {
        try {
          await trackTopicLearned(user.uid, values.topic, "learn");
        } catch (trackError) {
          console.error("Error tracking topic:", trackError);
        }
      }
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
    } finally {
      setIsGeneratingSimpler(false);
    }
  }

  const handleSave = (type: 'Explanation' | 'Analogy' | 'Mind Map', content: string) => {
    if (!result) return;
    addMemoryItem({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: `${result.simpleExplanation.substring(0,20)}... - ${type}`,
        content,
        type,
        topic: form.getValues('topic')
    });
    toast({
        title: "Saved to Memory Palace!",
        description: `Your ${type.toLowerCase()} for "${form.getValues('topic')}" has been saved.`
    })
  }

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      What do you want to learn?
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g., Quantum Entanglement, The Krebs Cycle..."
                          className="h-12 text-base pr-10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            // Clear previous results when user starts typing new topic
                            if (result && e.target.value !== form.getValues('topic')) {
                              setResult(null);
                              setError(null);
                              setSimplerExplanation(null);
                            }
                          }}
                          onFocus={() => setShowHistory(true)}
                        />
                        {searchHistory.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowHistory(!showHistory)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Search History Dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <div className="border rounded-lg p-3 bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent Searches
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearchHistory}
                      className="text-xs h-7"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item) => (
                      <Badge
                        key={item.timestamp}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 pr-1 flex items-center gap-1"
                      >
                        <span
                          onClick={() => {
                            startNewSearch(item.topic);
                            setShowHistory(false);
                          }}
                        >
                          {item.topic}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-destructive/20 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(item.topic);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate Explanation"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Generating your explanation...</p>
        </div>
      )}

      {error && <p className="text-destructive text-center py-4">{error}</p>}

      {/* Material Recommendations - shown after search */}
      {(result || loading) && form.getValues('topic') && (
        <MaterialRecommendations topic={form.getValues('topic')} />
      )}

      {result && (
        <div className="space-y-6">
          {/* Explanation */}
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 rounded-lg bg-secondary">
                <BookText className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Simple Explanation</CardTitle>
                <CardDescription>Broken down for easy understanding</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed">
                <ReactMarkdown>{result.simpleExplanation}</ReactMarkdown>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 pt-4">
              <Button variant="outline" size="sm" onClick={() => handleSave('Explanation', result.simpleExplanation)}>
                <Save className="mr-2 h-4 w-4" />
                Save to Memory Palace
              </Button>
            </CardFooter>
          </Card>

          {/* Analogy */}
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 rounded-lg bg-secondary">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Real-life Analogy</CardTitle>
                <CardDescription>Connecting to familiar concepts</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed">
                <ReactMarkdown>{result.analogy}</ReactMarkdown>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 pt-4">
              <Button variant="outline" size="sm" onClick={() => handleSave('Analogy', result.analogy)}>
                <Save className="mr-2 h-4 w-4" />
                Save to Memory Palace
              </Button>
            </CardFooter>
          </Card>

          {/* Mind Map */}
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 rounded-lg bg-secondary">
                <Waypoints className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Mind Map</CardTitle>
                <CardDescription>Visual hierarchy of key concepts</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none font-mono text-sm bg-muted/50 p-4 rounded-lg">
                <ReactMarkdown>{result.mindMap}</ReactMarkdown>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 pt-4">
              <Button variant="outline" size="sm" onClick={() => handleSave('Mind Map', result.mindMap)}>
                <Save className="mr-2 h-4 w-4" />
                Save to Memory Palace
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quiz */}
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 rounded-lg bg-secondary">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Knowledge Check</CardTitle>
                <CardDescription>Test your understanding</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Quiz questions={result.quiz} onQuizFail={handleQuizFail} />
            </CardContent>
          </Card>

          {isGeneratingSimpler && (
            <div className="flex items-center justify-center py-12 border border-dashed rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Generating a simpler explanation...</p>
            </div>
          )}

          {simplerExplanation && (
            <Alert>
              <BookText className="h-4 w-4" />
              <AlertTitle>Simpler Explanation</AlertTitle>
              <AlertDescription className="prose prose-neutral dark:prose-invert max-w-none mt-2">
                <ReactMarkdown>{simplerExplanation}</ReactMarkdown>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
