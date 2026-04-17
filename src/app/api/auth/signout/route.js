import { NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase/server";

export async function POST(req) {
  await sbServer().auth.signOut();
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}
