import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const memoryItems = [
  {
    title: "Photosynthesis Mind Map",
    type: "Mind Map",
    subject: "Biology",
    imageId: "memory-1",
  },
  {
    title: "Neural Networks Analogy",
    type: "Visual",
    subject: "AI",
    imageId: "memory-2",
  },
  {
    title: "Calculus I Quiz Results",
    type: "Quiz",
    subject: "Mathematics",
    imageId: "memory-3",
  },
  {
    title: "Notes on the Renaissance",
    type: "Note",
    subject: "History",
    imageId: "memory-4",
  },
];

export default function MemoryPalacePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Memory Palace"
        description="Your personal library of mind maps, visuals, and notes for quick revision."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {memoryItems.map((item) => {
          const placeholder = PlaceHolderImages.find(
            (p) => p.id === item.imageId
          );
          return (
            <Card key={item.title} className="overflow-hidden hover:shadow-lg transition-shadow">
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
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="font-headline text-lg leading-tight">
                        {item.title}
                    </CardTitle>
                    <Badge variant={item.type === 'Quiz' ? 'destructive' : 'secondary'}>{item.type}</Badge>
                </div>
                <CardDescription className="mt-2">{item.subject}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
