"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Wand2 } from "lucide-react";
import { rewriteCoverLetter } from "@/ai/flows/cover-letter-rewrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  coverLetter: z.string().min(50, {
    message: "Cover letter must be at least 50 characters.",
  }),
  jobDescription: z.string().min(50, {
    message: "Job description must be at least 50 characters.",
  }),
});

export default function CoverLetterRewriter() {
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenCoverLetter, setRewrittenCoverLetter] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: "",
      jobDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRewrittenCoverLetter("");
    try {
      const result = await rewriteCoverLetter(values);
      if (result.rewrittenCoverLetter) {
        setRewrittenCoverLetter(result.rewrittenCoverLetter);
      } else {
        throw new Error("Failed to get rewritten cover letter.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to rewrite cover letter. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-xl rounded-2xl h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">AI Cover Letter Rewrite</CardTitle>
        </div>
        <CardDescription>
          Paste your cover letter and the job description to get a tailored version.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col">
          <CardContent className="space-y-4 flex-grow">
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your cover letter here..."
                      className="resize-none h-32 bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the job description here..."
                      className="resize-none h-32 bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rewriting...
                </>
              ) : (
                "Rewrite with AI"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {rewrittenCoverLetter && (
        <>
        <CardContent>
            <FormLabel>Rewritten Cover Letter</FormLabel>
            <Textarea readOnly value={rewrittenCoverLetter} className="resize-none h-48 mt-2 bg-gray-50" />
        </CardContent>
        </>
      )}
    </Card>
  );
}
