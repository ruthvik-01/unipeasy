import { PageHeader } from "@/components/page-header";
import { LearnForm } from "./learn-form";

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Interactive Learning Assistant"
        description="Break down complex topics into simple, understandable stories with visuals and analogies."
      />
      <LearnForm />
    </div>
  );
}
