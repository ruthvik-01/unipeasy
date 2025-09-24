"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  Lightbulb,
  Target,
  FlaskConical,
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
import { skillsData, type SkillTrack } from "@/lib/skills-data";
import { useState, useEffect } from "react";

const quickAccessItems = [
  {
    title: "Interactive Learning",
    description: "Break down complex topics.",
    href: "/learn",
    icon: Lightbulb,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "AI Exam Strategist",
    description: "Create your perfect study plan.",
    href: "/strategist",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Skill Accelerator",
    description: "Level up your abilities.",
    href: "/skills",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Memory Palace",
    description: "Review your saved materials.",
    href: "/memory-palace",
    icon: BrainCircuit,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
];

type ProgressData = {
  title: string;
  progress: number;
};

export default function DashboardPage() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  useEffect(() => {
    const calculateProgress = () => {
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
                localStorage.getItem(`skill-${track.slug}-level-${level.level}`) ===
                "completed"
              ) {
                completedLevels++;
              }
            });
          });
        }
        const progress =
          totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
        return {
          title: track.title,
          progress: Math.round(progress),
        };
      });
      // Only show tracks where progress has been made
      setProgressData(allProgress.filter(p => p.progress > 0));
    };

    calculateProgress();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Alex!"
        description="Here’s your personalized hub for ascending to new heights."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickAccessItems.map((item) => (
          <Card
            key={item.title}
            className="group flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${item.bgColor}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <CardTitle className="font-headline text-xl">
                  {item.title}
                </CardTitle>
              </div>
              <CardDescription className="pt-2">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={item.href} className="w-full">
                <Button variant="outline" className="w-full">
                  Go <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Progress Overview</CardTitle>
            <CardDescription>
              Your current progress across active skill tracks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {progressData.length > 0 ? (
              progressData.map((item) => (
                <div key={item.title} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-muted-foreground">
                      {item.progress}%
                    </span>
                  </div>
                  <Progress value={item.progress} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <FlaskConical className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">No progress yet!</p>
                <p className="text-muted-foreground mt-1">
                  Head to the Skill Accelerator to start your first lesson.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/skills">Go to Skills</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
