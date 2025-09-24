
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Book,
  BrainCircuit,
  Compass,
  Lightbulb,
  Target,
  FlaskConical,
  BookOpen,
  Waypoints,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { skillsData, type SkillTrack, type Level } from "@/lib/skills-data";
import { useState, useEffect } from "react";
import { useMemoryPalace, type MemoryItem } from "@/context/memory-palace-context";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";


const quickAccessItems = [
  {
    title: "Interactive Learning",
    href: "/learn",
    icon: Lightbulb,
  },
  {
    title: "AI Exam Strategist",
    href: "/strategist",
    icon: Target,
  },
  {
    title: "All Skills",
    href: "/skills",
    icon: Star,
  },
  {
    title: "Memory Palace",
    href: "/memory-palace",
    icon: BrainCircuit,
  },
];

type ProgressData = {
  title: string;
  progress: number;
  slug: string;
};

type LastVisitedLevel = {
    track: SkillTrack;
    level: Level;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [lastVisited, setLastVisited] = useState<LastVisitedLevel | null>(null);
  const { memoryItems, isLoaded } = useMemoryPalace();

  useEffect(() => {
    // Calculate Progress
    const allProgress = Object.values(skillsData).map((track: SkillTrack) => {
      const totalLevels = track.journey.reduce(
        (sum, tier) => sum + tier.levels.length,
        0
      );
      let completedLevels = 0;
      if (typeof window !== "undefined") {
        track.journey.forEach((tier) => {
          tier.levels.forEach((level) => {
            if (
              localStorage.getItem(`skill-${track.slug}-level-${level.level}`) === "completed"
            ) {
              completedLevels++;
            }
          });
        });
      }
      const progress = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
      return {
        title: track.title,
        progress: Math.round(progress),
        slug: track.slug,
      };
    });
    setProgressData(allProgress.filter(p => p.progress > 0));

    // Get Last Visited Level
    const lastVisitedStr = localStorage.getItem('lastVisitedSkillLevel');
    if (lastVisitedStr) {
        try {
            const { slug, level: levelNumber } = JSON.parse(lastVisitedStr);
            const track = skillsData[slug];
            const allLevels = track.journey.flatMap(tier => tier.levels);
            const level = allLevels.find(l => l.level === levelNumber);
            if (track && level) {
                setLastVisited({track, level});
            }
        } catch (e) {
            console.error("Could not parse last visited level", e);
        }
    }
  }, []);

  const getMemoryItemIcon = (type: string) => {
    switch (type) {
      case 'Explanation': return <Book className="w-5 h-5 text-primary" />;
      case 'Analogy': return <Compass className="w-5 h-5 text-primary" />;
      case 'Mind Map': return <Waypoints className="w-5 h-5 text-primary" />;
      default: return <BrainCircuit className="w-5 h-5 text-primary" />;
    }
  };

  const recentMemories = memoryItems.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.displayName || 'Yash'}!`}
        description="Here’s your personalized hub for ascending to new heights."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

            {lastVisited && (
                 <Card className="bg-gradient-to-br from-primary/20 to-secondary/20">
                    <CardHeader>
                        <CardTitle className="font-headline">Continue Learning</CardTitle>
                        <CardDescription>You were just working on this. Jump back in!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center p-4 rounded-lg bg-background/50">
                            <div>
                                <p className="text-sm text-muted-foreground">{lastVisited.track.title}</p>
                                <p className="font-semibold">Level {lastVisited.level.level}: {lastVisited.level.title}</p>
                            </div>
                            <Button asChild>
                                <Link href={`/skills/${lastVisited.track.slug}/${lastVisited.level.level}`}>
                                    Go to Level <ArrowRight className="ml-2"/>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickAccessItems.map((item) => (
                        <Link href={item.href} key={item.title}>
                            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary hover:bg-accent/80 text-center transition-colors aspect-square">
                                <item.icon className={`h-8 w-8 mb-2 text-secondary-foreground`} />
                                <span className="text-sm font-medium text-secondary-foreground">{item.title}</span>
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Recent Discoveries</CardTitle>
                    <CardDescription>Your latest saved items from the Memory Palace.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoaded && recentMemories.length > 0 ? (
                         <div className="space-y-4">
                            {recentMemories.map(item => (
                                <div key={item.id} className="flex items-center gap-4 p-3 rounded-md bg-secondary/50">
                                    {getMemoryItemIcon(item.type)}
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.topic}</p>
                                        <p className="text-sm text-muted-foreground">{item.type}</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/memory-palace">
                                            View <ArrowRight className="ml-2 h-3 w-3"/>
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                         </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            <BrainCircuit className="mx-auto w-12 h-12 mb-4" />
                            <p>You haven't saved any items yet.</p>
                            <p className="text-sm">Visit the <Link href="/learn" className="underline text-primary">Interactive Learning</Link> section to start.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {progressData.length > 0 ? (
                    progressData.map((item) => (
                        <div key={item.title} className="space-y-2 group">
                            <Link href={`/skills/${item.slug}`}>
                                <div className="flex justify-between hover:text-primary transition-colors">
                                    <span className="font-medium">{item.title}</span>
                                    <span className="text-muted-foreground group-hover:text-primary">
                                    {item.progress}%
                                    </span>
                                </div>
                                <Progress value={item.progress} />
                            </Link>
                        </div>
                    ))
                    ) : (
                    <div className="text-center p-4 border-2 border-dashed rounded-lg">
                        <FlaskConical className="w-10 h-10 text-muted-foreground mx-auto" />
                        <p className="mt-2 font-semibold">No progress yet!</p>
                        <p className="text-muted-foreground text-sm mt-1">
                         Visit the skills page to start a track.
                        </p>
                    </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
