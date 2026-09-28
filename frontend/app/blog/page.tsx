import type { Metadata } from "next";
import BlogListing from "./BlogListing";
import { getPublishedBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Field notes from CloudSwift — migration playbooks, Azure, security, and AI rollout guides.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedBlogs();
  return <BlogListing posts={posts} />;
}
