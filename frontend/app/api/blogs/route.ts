import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readBlogs, upsertBlog, getPublishedBlogs } from "@/lib/blogs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  if (all) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await readBlogs());
  }
  return NextResponse.json(await getPublishedBlogs());
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body?.title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }
  const post = await upsertBlog(body);
  return NextResponse.json(post);
}
