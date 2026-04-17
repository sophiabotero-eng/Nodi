"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sbBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const { error } = await sbBrowser().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Log in</h1>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input className="border-2 border-black rounded-xl px-4 py-3" placeholder="Email"
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="border-2 border-black rounded-xl px-4 py-3" placeholder="Password"
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="text-pink-500 text-sm">{err}</p>}
        <button className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold"
          disabled={loading}>
          {loading ? "..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        New here? <Link href="/signup" className="underline">Sign up</Link>
      </p>
    </div>
  );
}
