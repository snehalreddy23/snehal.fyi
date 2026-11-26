import { redirect, notFound } from "next/navigation";
import { JOBS_DATA } from "@/data/jobs";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return JOBS_DATA.map((job) => ({
    id: job.id,
  }));
}

export default async function ShortLinkPage({ params }: Props) {
  const { id } = await params;
  const job = JOBS_DATA.find((j) => j.id === id);

  if (!job) {
    // If not found, redirect to home page
    redirect("/");
  }

  // Redirect to full SEO-friendly job page
  redirect(`/jobs/${job.slug}`);
}
