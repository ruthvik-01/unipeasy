"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

const onboardingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  university: z
    .string()
    .min(3, { message: "University must be at least 3 characters." }),
  branch: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      university: "",
      branch: "",
    },
  });

  function onSubmit(values: OnboardingFormValues) {
    console.log(values);
    // Here you would typically handle user creation and redirect
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-4 mb-8">
        <Rocket className="w-12 h-12 text-primary" />
        <h1 className="text-5xl font-headline font-bold text-foreground">
          Project Ascend
        </h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Welcome Aboard!
          </CardTitle>
          <CardDescription>
            Let's get your profile set up to personalize your learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ada Lovelace" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University or Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. University of Cambridge" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                Start Ascending
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-8">
        Your journey to academic excellence starts here.
      </p>
    </div>
  );
}
