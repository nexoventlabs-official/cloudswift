import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryDetail from "@/components/IndustryDetail";
import { findIndustry, industries } from "@/lib/industries";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const industry = findIndustry((await params).slug);
  if (!industry) return {};
  return { title: industry.title, description: industry.desc };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const industry = findIndustry((await params).slug);
  if (!industry) notFound();
  return <IndustryDetail industry={industry} />;
}