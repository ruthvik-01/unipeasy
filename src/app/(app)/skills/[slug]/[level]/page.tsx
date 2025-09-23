import { notFound } from 'next/navigation';
import { skillsData } from '@/lib/skills-data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function SkillLevelPage({ params }: { params: { slug: string, level: string } }) {
  const track = skillsData[params.slug];
  const levelNumber = parseInt(params.level, 10);

  if (!track) {
    notFound();
  }

  const level = track.journey.flatMap(tier => tier.levels).find(l => l.level === levelNumber);

  if (!level) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`${track.title} - Level ${level.level}`}
        description={level.title}
      />

      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Your Challenge</CardTitle>
                <Badge variant="secondary">{level.challengeType}</Badge>
            </div>
          <CardDescription>{level.example}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Instructions</AlertTitle>
                <AlertDescription>
                    Complete the challenge described above. For coding exercises, write your code in the text area below. For quizzes or scenario-based questions, choose the best option.
                </AlertDescription>
            </Alert>
          
            {['Simple Exercise', 'Coding Challenge', 'Short Task', 'Full Program', 'Real-world Project'].includes(level.challengeType) && (
                <div className="space-y-4">
                    <Textarea 
                        placeholder="Enter your code or response here..."
                        className="h-64 font-code"
                    />
                    <Button>Submit for AI Feedback</Button>
                </div>
            )}
            
            {/* Placeholder for other challenge types */}
            {level.challengeType === 'Quiz' && (
                <p className="text-muted-foreground">Quiz interface will be here.</p>
            )}
            {level.challengeType.includes('Recording') && (
                <p className="text-muted-foreground">Audio/Video recording interface will be here.</p>
            )}

        </CardContent>
      </Card>
    </div>
  );
}
