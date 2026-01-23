
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
import { Terminal, Lightbulb, Loader2, ArrowRight, ArrowLeft, Trophy, CheckCircle, Sparkles, Target } from 'lucide-react';
import { provideAiSkillFeedback, type ProvideAiSkillFeedbackOutput } from '@/ai/flows/provide-ai-skill-feedback';
import { useAuth } from '@/context/auth-context';
import { trackSkillLevelCompleted } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export default function SkillLevelPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const levelStr = Array.isArray(params.level) ? params.level[0] : params.level;
  const { user } = useAuth();

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<ProvideAiSkillFeedbackOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (slug && level?.level) {
        try {
            localStorage.setItem('lastVisitedSkillLevel', JSON.stringify({ slug, level: level.level }));
        } catch (error) {
            console.warn('Could not save last visited level to localStorage', error);
        }
    }
}, [slug, level]);


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
        
        // Track skill completion in Firestore
        if (user?.uid && track) {
          trackSkillLevelCompleted(
            user.uid,
            slug,
            track.title,
            track.branch,
            parseInt(levelStr, 10),
            allLevels.length
          ).catch(console.error);
        }
      } catch (error) {
        console.warn('Could not save progress to localStorage', error)
      }
    }
  }, [isCompleted, slug, levelStr, feedback, user?.uid, track, allLevels.length]);

  
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
    } finally {
      setLoading(false);
    }
  };

  const handleNextLevel = () => {
    if (!slug) return;
    const nextLevel = allLevels.find(l => l.level === level.level + 1);
    if (nextLevel) {
      router.push(`/skills/${slug}/${nextLevel.level}`);
      setUserInput('');
      setFeedback(null);
      setIsCompleted(false);
      setLoading(false);
    } else {
      router.push(`/skills/${slug}`);
    }
  };

  return (
    <div className={cn(
      "space-y-8 transition-all duration-500",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/skills/${slug}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">Level {level.level}</Badge>
            <Badge variant="outline" className="bg-primary/5">{track.branch}</Badge>
          </div>
          <PageHeader 
            title={track.title}
            description={level.title}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Challenge Card */}
        <Card className={cn(
          "border shadow-sm overflow-hidden transition-all duration-500",
          mounted && "animate-in fade-in slide-in-from-left-4"
        )}>
          <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 rounded bg-secondary">
                      <Terminal className="w-4 h-4" />
                    </div>
                    Your Challenge
                  </CardTitle>
                  <Badge variant="outline">{level.challengeType}</Badge>
              </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
              {/* Highlighted Challenge Question */}
              <div className="relative p-4 rounded-lg bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20">
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                    <Target className="w-3 h-3 mr-1" />
                    Challenge
                  </Badge>
                </div>
                <p className="text-base font-medium mt-2 leading-relaxed">{level.example}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-b-lg" />
              </div>

              <Alert className="bg-muted/50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle className="font-medium text-sm">Instructions</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                      Complete the challenge described above. Write your answer in the text area below.
                  </AlertDescription>
              </Alert>
            
              <div className="space-y-3">
                  <Textarea 
                      placeholder="Enter your response here..."
                      className="h-48 resize-none text-sm"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      disabled={loading}
                  />
                  <Button 
                    onClick={handleFeedbackSubmit} 
                    disabled={loading || !userInput.trim()} 
                    className="w-full"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit for AI Feedback
                  </Button>
              </div>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        <Card className="border shadow-sm">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-1.5 rounded bg-secondary">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    AI Feedback
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">Analyzing your submission...</p>
                    </div>
                )}

                {feedback && (
                    <div className="space-y-4">
                        <Alert className={feedback.isCorrect ? 'border-foreground/20 bg-muted/50' : ''}>
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                feedback.isCorrect ? 'bg-foreground text-background' : 'bg-secondary'
                              }`}>
                                {feedback.isCorrect ? <Trophy className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                              </div>
                              <div>
                                <AlertTitle className="font-medium text-sm">
                                  {feedback.isCorrect ? "Excellent Work!" : "Keep Going!"}
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-sm">
                                    {feedback.feedback}
                                </AlertDescription>
                              </div>
                            </div>
                        </Alert>
                        
                        <Alert className="bg-muted/50">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <div>
                                <AlertTitle className="font-medium text-sm">Suggestion</AlertTitle>
                                <AlertDescription className="mt-1 text-sm">
                                    {feedback.suggestion}
                                </AlertDescription>
                              </div>
                            </div>
                        </Alert>

                        {feedback.isCorrect && (
                            <Button onClick={handleNextLevel} className="w-full">
                                Continue to Next Level <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
                
                {!loading && !feedback && (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">Awaiting Your Submission</p>
                        <p className="mt-1 text-xs text-muted-foreground">AI feedback will appear here after you submit.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
