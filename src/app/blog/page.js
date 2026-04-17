import Link from "next/link";
import { sbServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BlogIndex() {
  const supabase = sbServer();
  const { data: posts } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold">Blog</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {(posts || []).map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`}
            className="rounded-2xl border-2 border-black bg-white overflow-hidden hover:-translate-y-1 transition-transform block">
            {p.cover_image && <img src={p.cover_image} alt="" className="w-full aspect-video object-cover" />}
            <div className="p-5">
              <p className="text-xs opacity-60">{new Date(p.created_at).toLocaleDateString()}</p>
              <h2 className="text-2xl font-bold mt-1">{p.title}</h2>
              {p.excerpt && <p className="mt-2 text-sm">{p.excerpt}</p>}
            </div>
          </Link>
        ))}
        {(!posts || posts.length === 0) && <p>No posts yet.</p>}
      </div>
    </div>
  );
}
