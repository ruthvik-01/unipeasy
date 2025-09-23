import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const skillTracks = [
  {
    title: "Python for Data Science",
    description: "Master Python programming for data analysis and machine learning.",
    level: "Intermediate",
    category: "Technical",
    imageId: "skill-python",
  },
  {
    title: "Public Speaking Mastery",
    description: "Learn to deliver compelling presentations with confidence.",
    level: "Beginner",
    category: "Soft Skill",
    imageId: "skill-public-speaking",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Understand the principles of creating user-friendly digital products.",
    level: "Beginner",
    category: "Technical",
    imageId: "skill-ui-ux",
  },
  {
    title: "Agile Project Management",
    description: "Lead projects effectively with agile methodologies.",
    level: "Advanced",
    category: "Soft Skill",
    imageId: "skill-project-management",
  },
];

export default function SkillsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Skill Accelerator"
        description="Structured training to level up your technical and soft skills with AI-powered feedback."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillTracks.map((track) => {
          const placeholder = PlaceHolderImages.find(
            (p) => p.id === track.imageId
          );
          return (
            <Card key={track.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                {placeholder && (
                  <Image
                    src={placeholder.imageUrl}
                    alt={placeholder.description}
                    data-ai-hint={placeholder.imageHint}
                    width={600}
                    height={400}
                    className="aspect-video object-cover"
                  />
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <Badge variant={track.category === 'Technical' ? 'default' : 'secondary'}>{track.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{track.level}</span>
                    </div>
                </div>
                <CardTitle className="font-headline text-xl">{track.title}</CardTitle>
                <CardDescription className="mt-2">{track.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-accent hover:bg-accent/90">Start Training</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
