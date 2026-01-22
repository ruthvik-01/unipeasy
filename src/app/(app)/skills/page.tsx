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
import { ArrowRight } from "lucide-react";
import { skillTracks } from "@/lib/skills-data";

export default function SkillsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Skills"
        description="Level up your abilities with AI-powered training."
      />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillTracks.map((track) => {
          const placeholder = PlaceHolderImages.find(
            (p) => p.id === track.imageId
          );
          return (
            <Card key={track.title} className="group flex flex-col overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-0">
                {placeholder && (
                  <div className="relative">
                    <Image
                      src={placeholder.imageUrl}
                      alt={placeholder.description}
                      data-ai-hint={placeholder.imageHint}
                      width={600}
                      height={400}
                      className="aspect-[16/10] object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary">{track.category}</Badge>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-5 flex-grow">
                <CardTitle className="text-lg mb-2">{track.title}</CardTitle>
                <CardDescription className="text-sm">{track.description}</CardDescription>
                <p className="text-xs text-muted-foreground mt-3">{track.level}</p>
              </CardContent>
              
              <CardFooter className="p-5 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/skills/${track.slug}`}>
                    Start Training
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
