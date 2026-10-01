import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import OfferingDetail from "@/components/OfferingDetail";
import {
  catalogAiServices,
  findOffering,
  allAiItems,
} from "@/lib/catalog";

export function generateStaticParams() {
  return allAiItems.filter((i) => !i.href).map((i) => ({ id: i.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = findOffering(catalogAiServices, id);
  if (!item) return {};
  if (item.href) {
    return { alternates: { canonical: item.href } };
  }
  return { title: item.title, description: item.desc };
}

export default async function AiServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = findOffering(catalogAiServices, id);
  if (!item) notFound();
  if (item.href) redirect(item.href);
  const related = allAiItems.filter((i) => i.id !== id).slice(0, 3);
  return (
    <OfferingDetail
      item={item}
      category={item.category}
      basePath="/ai-services"
      related={related}
    />
  );
}
