import { PageHeader } from "@/components/page-header";
import { StrategistForm } from "./strategist-form";

export default function StrategistPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Exam Strategist"
        description="Generate a personalized, prioritized study plan to maximize your exam score in limited time."
      />
      <StrategistForm />
    </div>
  );
}
