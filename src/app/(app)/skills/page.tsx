import Image from "next/image";
import Link from "next/link";
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
import { skillTracks } from "@/lib/skills-data";

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
                <Button asChild className="w-full bg-accent hover:bg-accent/90">
                  <Link href={`/skills/${track.slug}`}>Start Training</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
