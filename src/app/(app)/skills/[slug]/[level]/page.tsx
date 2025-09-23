
"use client";

import { notFound, useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { skillsData } from '@/lib/skills-data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal, Lightbulb, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { provideAiSkillFeedback, type ProvideAiSkillFeedbackOutput } from '@/ai/flows/provide-ai-skill-feedback';

export default function SkillLevelPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const levelStr = Array.isArray(params.level) ? params.level[0] : params.level;

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<ProvideAiSkillFeedbackOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { track, level, allLevels } = useMemo(() => {
    if (!slug || !levelStr) return { track: null, level: null, allLevels: [] };
    const trackData = skillsData[slug];
    if (!trackData) return { track: null, level: null, allLevels: [] };

    const levelNumber = parseInt(levelStr, 10);
    const allLevels = trackData.journey.flatMap(tier => tier.levels);
    const levelData = allLevels.find(l => l.level === levelNumber);
    return { track: trackData, level: levelData, allLevels };
  }, [slug, levelStr]);

  useEffect(() => {
    if (slug && levelStr) {
      try {
        const completed = localStorage.getItem(`skill-${slug}-level-${levelStr}`) === 'completed';
        setIsCompleted(completed);
      } catch (error) {
        console.warn('Could not read progress from localStorage', error);
      }
    }
  }, [slug, levelStr]);


  useEffect(() => {
    if (isCompleted && slug && levelStr && feedback?.isCorrect) {
      try {
        localStorage.setItem(`skill-${slug}-level-${levelStr}`, 'completed');
      } catch (error) {
        console.warn('Could not save progress to localStorage', error)
      }
    }
  }, [isCompleted, slug, levelStr, feedback]);

  
  if (!track || !level) {
    return notFound();
  }

  const handleFeedbackSubmit = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const response = await provideAiSkillFeedback({
        skillName: track.title,
        level: level.level,
        challenge: level.title,
        challengeDescription: level.example,
        userInput: userInput,
      });
      setFeedback(response);
      if (response.isCorrect) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Failed to get AI feedback", error);
      // Optionally, set an error state to show in the UI
    } finally {
      setLoading(false);
    }
  };

  const handleNextLevel = () => {
    if (!slug) return;
    const nextLevel = allLevels.find(l => l.level === level.level + 1);
    if (nextLevel) {
      router.push(`/skills/${slug}/${nextLevel.level}`);
      // Reset component state for the new level
      setUserInput('');
      setFeedback(null);
      setIsCompleted(false);
      setLoading(false);

    } else {
      router.push(`/skills/${slug}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/skills/${slug}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader 
          title={`${track.title} - Level ${level.level}`}
          description={level.title}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                  <CardTitle>Your Challenge</CardTitle>
                  <Badge variant="secondary">{level.challengeType}</Badge>
              </div>
            <CardDescription>{level.example}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Instructions</AlertTitle>
                  <AlertDescription>
                      Complete the challenge described above. Write your answer or code in the text area below.
                  </AlertDescription>
              </Alert>
            
              <div className="space-y-4">
                  <Textarea 
                      placeholder="Enter your response here..."
                      className="h-64 font-code"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      disabled={loading}
                  />
                  <Button onClick={handleFeedbackSubmit} disabled={loading || !userInput.trim()}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit for AI Feedback
                  </Button>
              </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 dark:bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Lightbulb />
                    AI Feedback
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Analyzing your submission...</p>
                    </div>
                )}

                {feedback && (
                    <div className="space-y-4">
                        <Alert variant={feedback.isCorrect ? "default" : "destructive"} className="bg-background">
                            <AlertTitle className="font-semibold">{feedback.isCorrect ? "Great Job!" : "Needs Improvement"}</AlertTitle>
                            <AlertDescription>
                                {feedback.feedback}
                            </AlertDescription>
                        </Alert>
                        <Alert>
                            <AlertTitle className="font-semibold">Next Steps</AlertTitle>
                            <AlertDescription>
                                {feedback.suggestion}
                            </AlertDescription>
                        </Alert>

                        {feedback.isCorrect && (
                            <Button onClick={handleNextLevel} className="w-full">
                                Go to Next Level <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
                
                {!loading && !feedback && (
                    <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                        <p>Your feedback will appear here after you submit your work.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
