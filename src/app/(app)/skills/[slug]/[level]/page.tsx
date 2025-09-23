"use client";

import { notFound } from 'next/navigation';
import { useState } from 'react';
import { skillsData } from '@/lib/skills-data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal, Lightbulb, Loader2 } from 'lucide-react';
import { provideAiSkillFeedback, type ProvideAiSkillFeedbackOutput } from '@/ai/flows/provide-ai-skill-feedback';

export default function SkillLevelPage({ params }: { params: { slug: string, level: string } }) {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<ProvideAiSkillFeedbackOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const track = skillsData[params.slug];
  const levelNumber = parseInt(params.level, 10);

  if (!track) {
    notFound();
  }

  const level = track.journey.flatMap(tier => tier.levels).find(l => l.level === levelNumber);

  if (!level) {
    notFound();
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
    } catch (error) {
      console.error("Failed to get AI feedback", error);
      // Optionally, set an error state to show in the UI
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title={`${track.title} - Level ${level.level}`}
        description={level.title}
      />

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
                      Complete the challenge described above. For coding exercises, write your code in the text area below. For quizzes or scenario-based questions, choose the best option.
                  </AlertDescription>
              </Alert>
            
              {['Simple Exercise', 'Coding Challenge', 'Short Task', 'Full Program', 'Real-world Project'].includes(level.challengeType) && (
                  <div className="space-y-4">
                      <Textarea 
                          placeholder="Enter your code or response here..."
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
              )}
              
              {/* Placeholder for other challenge types */}
              {level.challengeType === 'Quiz' && (
                  <p className="text-muted-foreground">Quiz interface will be here.</p>
              )}
              {level.challengeType.includes('Recording') && (
                  <p className="text-muted-foreground">Audio/Video recording interface will be here.</p>
              )}

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
