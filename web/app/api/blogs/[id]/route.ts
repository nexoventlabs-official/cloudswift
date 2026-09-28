import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteBlog, readBlogs, upsertBlog } from "@/lib/blogs";

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const posts = await readBlogs();
  const existing = posts.find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const post = await upsertBlog({ ...existing, ...body, id, title: body.title || existing.title });
  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await deleteBlog(id);
  return NextResponse.json({ ok: true });
}
