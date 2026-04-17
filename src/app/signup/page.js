"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sbBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const { data, error } = await sbBrowser().auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) return setErr(error.message);
    if (data.session) {
      router.push("/profile");
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="mt-2">We sent a confirmation link to {email}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Sign up</h1>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input className="border-2 border-black rounded-xl px-4 py-3" placeholder="Name"
          value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="border-2 border-black rounded-xl px-4 py-3" placeholder="Email"
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="border-2 border-black rounded-xl px-4 py-3" placeholder="Password"
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          minLength={6} required />
        {err && <p className="text-pink-500 text-sm">{err}</p>}
        <button className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold"
          disabled={loading}>
          {loading ? "..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have one? <Link href="/login" className="underline">Log in</Link>
      </p>
    </div>
  );
}
