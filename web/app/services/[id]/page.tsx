import { notFound } from "next/navigation";
import type { Metadata } from "next";
import OfferingDetail from "@/components/OfferingDetail";
import {
  catalogServices,
  findOffering,
  allServiceItems,
} from "@/lib/catalog";

export function generateStaticParams() {
  return allServiceItems.map((i) => ({ id: i.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = findOffering(catalogServices, id);
  if (!item) return {};
  return { title: item.title, description: item.desc };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = findOffering(catalogServices, id);
  if (!item) notFound();
  const related = allServiceItems.filter((i) => i.id !== id).slice(0, 3);
  return (
    <OfferingDetail
      item={item}
      category={item.category}
      basePath="/services"
      related={related}
    />
  );
}
