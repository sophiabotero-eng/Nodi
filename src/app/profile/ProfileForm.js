"use client";

import { useState } from "react";
import { sbBrowser } from "@/lib/supabase/client";

export default function ProfileForm({ initial }) {
  const [name, setName] = useState(initial.name);
  const [bio, setBio] = useState(initial.bio);
  const [status, setStatus] = useState("");

  async function save(e) {
    e.preventDefault();
    setStatus("Saving...");
    const { error } = await sbBrowser()
      .from("users")
      .update({ name, bio })
      .eq("id", initial.id);
    setStatus(error ? error.message : "Saved");
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-3">
      <input className="border-2 border-black rounded-xl px-4 py-3 bg-gray-100"
        value={initial.email} disabled />
      <input className="border-2 border-black rounded-xl px-4 py-3"
        placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className="border-2 border-black rounded-xl px-4 py-3 min-h-[80px]"
        placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} />
      <div className="flex items-center gap-3">
        <button className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold">
          Save
        </button>
        {status && <span className="text-sm">{status}</span>}
      </div>
    </form>
  );
}
