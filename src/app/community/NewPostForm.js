"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setLoading(false);
    if (res.ok) {
      setContent("");
      router.refresh();
    } else {
      alert("Failed to post.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <textarea
        className="border-2 border-black rounded-xl px-4 py-3 min-h-[70px]"
        placeholder="What are you working on?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
      />
      <div className="flex justify-end">
        <button className="px-5 py-2 rounded-full bg-pink-500 text-white font-semibold text-sm"
          disabled={loading || !content.trim()}>
          {loading ? "..." : "Post"}
        </button>
      </div>
    </form>
  );
}
