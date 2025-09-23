import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  Lightbulb,
  Target,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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

const studyBlocks = [
    { subject: "Quantum Physics", time: "Today, 4:00 PM", duration: "25 min" },
    { subject: "Data Structures", time: "Today, 7:00 PM", duration: "50 min" },
    { subject: "Shakespearean Literature", time: "Tomorrow, 10:00 AM", duration: "25 min" },
];

export default function DashboardPage() {
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
                <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">{item.description}</CardDescription>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Progress Overview</CardTitle>
            <CardDescription>
              Your current progress across active skill tracks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Python for Data Science</span>
                    <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Public Speaking Mastery</span>
                    <span className="text-muted-foreground">40%</span>
                </div>
                <Progress value={40} />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="font-medium">Advanced Calculus</span>
                    <span className="text-muted-foreground">90%</span>
                </div>
                <Progress value={90} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Study Blocks</CardTitle>
            <CardDescription>Your Pomodoro sessions for today and tomorrow.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                {studyBlocks.map((block) => (
                    <li key={block.subject} className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                            <BookOpen className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="font-semibold">{block.subject}</p>
                            <p className="text-sm text-muted-foreground">{block.time}</p>
                        </div>
                        <Badge variant="secondary" className="ml-auto">{block.duration}</Badge>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
