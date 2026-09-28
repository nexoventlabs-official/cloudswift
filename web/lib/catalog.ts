import catalog from "./catalog.json";

export type OfferingItem = {
  id: string;
  title: string;
  desc: string;
  detailedContent: string;
  image: string;
  imageFit?: "cover" | "contain";
  tags: string[];
  capabilities: string[];
  capabilityDescs?: Record<string, string>;
  steps: string[];
  stepDescs?: Record<string, string>;
  logo?: string;
  href?: string;
};

export type OfferingCategory = {
  category: string;
  heading?: string;
  lede?: string;
  items: OfferingItem[];
};

export type SolutionItem = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  capabilities: string[];
  capabilityDescs?: Record<string, string>;
  steps: string[];
  stepDescs?: Record<string, string>;
  logo: string;
  cover: string;
};

export const catalogSolutions = catalog.solutions as unknown as SolutionItem[];
export const catalogServices = catalog.services as unknown as OfferingCategory[];
export const catalogManagedCloud = catalog.managedCloud as unknown as OfferingCategory[];
export const catalogAiServices = catalog.aiServices as unknown as OfferingCategory[];
export const catalogTestimonials = catalog.testimonials as unknown as {
  quote: string;
  name: string;
  role: string;
  init: string;
}[];
export const catalogTeam = catalog.team as unknown as {
  name: string;
  role: string;
  image: string;
}[];

export function flattenOfferings(cats: OfferingCategory[]) {
  return cats.flatMap((c) =>
    c.items.map((item) => ({ ...item, category: c.category }))
  );
}

export function findOffering(
  cats: OfferingCategory[],
  id: string
): (OfferingItem & { category: string }) | undefined {
  for (const c of cats) {
    const item = c.items.find((i) => i.id === id);
    if (item) return { ...item, category: c.category };
  }
  return undefined;
}

export const allServiceItems = flattenOfferings(catalogServices);
export const allManagedItems = flattenOfferings(catalogManagedCloud);
export const allAiItems = flattenOfferings(catalogAiServices);

const solutionGroups: { category: string; ids: string[] }[] = [
  {
    category: "Public Cloud",
    ids: ["microsoft-azure", "amazon-web-services", "google-cloud-platform"],
  },
  {
    category: "Microsoft Platforms",
    ids: ["microsoft-365", "dynamics-365", "power-bi"],
  },
];

export const catalogSolutionCategories: OfferingCategory[] = solutionGroups.map(
  ({ category, ids }) => ({
    category,
    items: ids
      .map((id) => catalogSolutions.find((s) => s.id === id))
      .filter((s): s is SolutionItem => Boolean(s))
      .map((s) => ({
        id: s.id,
        title: s.title,
        desc: s.desc,
        detailedContent: s.desc,
        image: s.cover,
        tags: s.tags,
        capabilities: s.capabilities,
        capabilityDescs: s.capabilityDescs,
        steps: s.steps,
        stepDescs: s.stepDescs,
        logo: s.logo,
      })),
  })
);
