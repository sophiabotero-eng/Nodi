import { notFound } from "next/navigation";
import Link from "next/link";
import { sbServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BlogPost({ params }) {
  const supabase = sbServer();
  const { data: post } = await supabase
    .from("posts").select("*").eq("slug", params.slug).maybeSingle();

  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-sm underline">← Back</Link>
      <h1 className="text-4xl font-bold mt-4">{post.title}</h1>
      <p className="text-xs opacity-60 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
      {post.cover_image && (
        <img src={post.cover_image} alt="" className="w-full rounded-2xl border-2 border-black mt-6" />
      )}
      <div className="mt-6 whitespace-pre-wrap leading-relaxed">{post.content}</div>
    </article>
  );
}
