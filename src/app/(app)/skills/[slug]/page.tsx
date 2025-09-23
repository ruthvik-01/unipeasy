"use client";

import { notFound, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { skillsData, type Level } from '@/lib/skills-data';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SkillTrackPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const trackData = skillsData[slug];
  
  const [journey, setJourney] = useState(trackData?.journey || []);

  useEffect(() => {
    if (typeof window !== 'undefined' && trackData) {
      const updatedJourney = trackData.journey.map(tier => ({
        ...tier,
        levels: tier.levels.map(level => {
          const isCompleted = localStorage.getItem(`skill-${trackData.slug}-level-${level.level}`) === 'completed';
          return { ...level, isCompleted };
        })
      }));
      setJourney(updatedJourney);
    }
  }, [trackData]);


  if (!trackData) {
    return notFound();
  }
  
  const totalLevels = journey.reduce((sum, tier) => sum + tier.levels.length, 0);
  const completedLevels = journey.reduce((sum, tier) => sum + tier.levels.filter(l => l.isCompleted).length, 0);
  const progress = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
  const currentLevel = completedLevels + 1;

  const getLevelIcon = (level: Level) => {
    if (level.isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (level.level === currentLevel) {
      return <PlayCircle className="w-5 h-5 text-primary" />;
    }
    return <Lock className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-8">
      <PageHeader title={trackData.title} description={trackData.description} />

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>You have completed {completedLevels} of {totalLevels} levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="h-3" />
            <span className="font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-semibold">Your Journey</h2>
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {journey.map((tier, tierIndex) => {
            const isTierUnlocked = tier.levels.some(l => l.isCompleted || l.level === currentLevel);
            return (
              <AccordionItem value={`item-${tierIndex}`} key={tier.tier} disabled={!isTierUnlocked}>
                <AccordionTrigger className={`text-xl font-headline ${!isTierUnlocked ? 'text-muted-foreground cursor-not-allowed' : ''}`}>
                  <div className="flex items-center gap-4">
                    <Badge variant={isTierUnlocked ? "default" : "secondary"}>Tier {tier.tier}</Badge>
                    <span>{tier.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <p className="text-muted-foreground">{tier.focus}</p>
                    <p><span className="font-semibold">Goal:</span> {tier.goal}</p>
                    <div className="space-y-2">
                        {tier.levels.map(level => (
                            <Card 
                                key={level.level}
                                className={`flex items-center justify-between p-4 ${level.isCompleted ? 'bg-secondary/30' : ''} ${level.level > currentLevel ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    {getLevelIcon(level)}
                                    <div>
                                        <p className="font-semibold">Level {level.level}: {level.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">{level.challengeType}:</span> {level.example}
                                        </p>
                                    </div>
                                </div>
                                {level.level <= currentLevel && (
                                    <Button size="sm" asChild>
                                        <Link href={`/skills/${trackData.slug}/${level.level}`}>
                                            {level.isCompleted ? 'Re-attempt' : 'Start Level'}
                                        </Link>
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  );
}
