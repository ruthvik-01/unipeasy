"use client";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemoryPalace } from "@/context/memory-palace-context";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Trash2, Loader2, BookText, Compass, Waypoints } from "lucide-react";

export default function MemoryPalacePage() {
  const { memoryItems, clearMemoryPalace, isLoaded } = useMemoryPalace();

  if (!isLoaded) {
    return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Memory Palace"
          description="Your personal library of mind maps, visuals, and notes for quick revision."
        />
        {memoryItems.length > 0 && (
          <Button variant="outline" onClick={clearMemoryPalace}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Palace
          </Button>
        )}
      </div>

      {memoryItems.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed">
          <BrainCircuit className="w-16 h-16 text-muted-foreground" />
          <CardTitle className="mt-4 font-headline text-2xl">Your Palace is Empty</CardTitle>
          <CardDescription className="mt-2">
            Go to the 'Learn' section to generate insights and save them here for later.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {memoryItems.map((item) => (
            <Card key={item.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="font-headline text-lg leading-tight">
                            {item.topic}
                        </CardTitle>
                        <Badge variant={'secondary'}>{item.type}</Badge>
                    </div>
                </CardHeader>
              <CardContent className="flex-grow">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-code">
                    {item.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
