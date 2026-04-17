import { NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });

  const { content } = await req.json();
  if (!content || content.length > 500) {
    return NextResponse.json({ error: "bad content" }, { status: 400 });
  }

  const { error } = await supabase
    .from("community_posts")
    .insert({ user_id: user.id, content: content.trim() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
