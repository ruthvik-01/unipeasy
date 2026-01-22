"use client";

import { notFound, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { skillsData, type Level } from '@/lib/skills-data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Lock, PlayCircle, Trophy } from 'lucide-react';
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

  return (
    <div className="space-y-8">
      <PageHeader title={trackData.title} description={trackData.description} />

      {/* Progress Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center">
                <Trophy className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Progress</p>
                <p className="text-2xl font-semibold">{Math.round(progress)}%</p>
                <p className="text-sm text-muted-foreground">{completedLevels} of {totalLevels} levels</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full rounded-full bg-foreground transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Journey Accordion */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Journey</h2>
        
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-3">
          {journey.map((tier, tierIndex) => {
            const isTierUnlocked = tier.levels.some(l => l.isCompleted || l.level === currentLevel);
            const tierProgress = tier.levels.filter(l => l.isCompleted).length / tier.levels.length * 100;
            
            return (
              <AccordionItem 
                value={`item-${tierIndex}`} 
                key={tier.tier} 
                disabled={!isTierUnlocked} 
                className={`border rounded-lg overflow-hidden ${isTierUnlocked ? 'shadow-sm' : 'opacity-60'}`}
              >
                <AccordionTrigger className={`px-5 py-4 hover:no-underline ${!isTierUnlocked ? 'cursor-not-allowed' : ''}`}>
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${isTierUnlocked ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                      {tier.tier}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tier.title}</span>
                        {tierProgress === 100 && <CheckCircle className="w-4 h-4 text-foreground" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 w-20 rounded-full bg-secondary overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-foreground transition-all duration-500"
                            style={{ width: `${tierProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{tier.levels.filter(l => l.isCompleted).length}/{tier.levels.length}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                    <div className="pl-12 space-y-4">
                      <p className="text-sm text-muted-foreground">{tier.focus}</p>
                      <p className="text-sm"><span className="font-medium">Goal:</span> {tier.goal}</p>
                      
                      <div className="space-y-2">
                          {tier.levels.map((level) => (
                              <div 
                                  key={level.level}
                                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                    level.isCompleted 
                                      ? 'bg-muted/50' 
                                      : level.level === currentLevel 
                                        ? 'bg-muted/30' 
                                        : 'opacity-50'
                                  }`}
                              >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    level.isCompleted 
                                      ? 'bg-foreground text-background' 
                                      : level.level === currentLevel 
                                        ? 'bg-secondary' 
                                        : 'bg-muted'
                                  }`}>
                                    {level.isCompleted ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : level.level === currentLevel ? (
                                      <PlayCircle className="w-4 h-4" />
                                    ) : (
                                      <Lock className="w-3 h-3 text-muted-foreground" />
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">Level {level.level}: {level.title}</p>
                                      <p className="text-xs text-muted-foreground truncate">
                                          {level.challengeType} • {level.example}
                                      </p>
                                  </div>
                                  
                                  {level.level <= currentLevel && (
                                      <Button size="sm" variant={level.isCompleted ? "secondary" : "default"} asChild className="shrink-0">
                                          <Link href={`/skills/${trackData.slug}/${level.level}`}>
                                              {level.isCompleted ? 'Replay' : 'Start'}
                                          </Link>
                                      </Button>
                                  )}
                              </div>
                          ))}
                      </div>
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
