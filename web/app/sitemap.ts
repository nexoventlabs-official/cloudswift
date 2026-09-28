import type { MetadataRoute } from "next";
import { company } from "@/lib/data";
import { AGENT_PAGES } from "@/lib/agentPages";
import { allManagedItems, allServiceItems } from "@/lib/catalog";
import { getPublishedBlogs } from "@/lib/blogs";

const ORIGIN = company.website.replace(/\/$/, "");

const CORE = [
  "/",
  "/about",
  "/contact",
  "/ai-services",
  "/services",
  "/managed-cloud",
  "/solutions",
  "/industries",
  "/projects",
  "/blog",
];

function offeringUrls(
  items: { id: string; href?: string }[],
  basePath: string
) {
  return items.map((item) => item.href ?? `${basePath}/${item.id}`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPublishedBlogs();
  const listed = new Set([
    ...CORE,
    ...AGENT_PAGES.map((page) => page.path),
  ]);

  const offeringPaths = [
    ...offeringUrls(allServiceItems, "/services"),
    ...offeringUrls(allManagedItems, "/managed-cloud"),
  ].filter((path) => {
    if (listed.has(path)) return false;
    listed.add(path);
    return true;
  });

  return [
    ...CORE.map((path) => ({
      url: `${ORIGIN}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
      ...(path === "/ai-services"
        ? { images: AGENT_PAGES.map((page) => `${ORIGIN}${page.image}`) }
        : {}),
    })),
    ...AGENT_PAGES.map((page) => ({
      url: `${ORIGIN}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
      images: [
        {
          url: `${ORIGIN}${page.image}`,
          title: page.imageAlt,
          caption: page.imageCaption ?? page.imageAlt,
        },
      ],
    })),
    ...offeringPaths.map((path) => ({
      url: `${ORIGIN}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${ORIGIN}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
  ];
}
