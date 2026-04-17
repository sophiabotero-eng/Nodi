import Link from "next/link";
import { sbServer } from "@/lib/supabase/server";
import NewPostForm from "./NewPostForm";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const supabase = sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: posts } = await supabase
    .from("community_posts")
    .select("id, content, created_at, users(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold">Community</h1>
      <p className="mt-2 text-sm">Share an update, ask a question.</p>

      {user ? (
        <div className="mt-6 rounded-2xl border-2 border-black p-5 bg-white">
          <NewPostForm />
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border-2 border-black p-5 bg-yellow-300">
          <Link href="/login" className="underline font-semibold">Log in</Link> to post.
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {(posts || []).map((p) => (
          <div key={p.id} className="rounded-2xl border-2 border-black p-4 bg-white">
            <div className="flex justify-between text-xs opacity-60">
              <span className="font-semibold">{p.users?.name || "Anonymous"}</span>
              <span>{new Date(p.created_at).toLocaleString()}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{p.content}</p>
          </div>
        ))}
        {(!posts || posts.length === 0) && <p>No posts yet.</p>}
      </div>
    </div>
  );
}
