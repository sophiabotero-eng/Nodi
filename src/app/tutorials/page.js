import Link from "next/link";
import { sbServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TutorialsPage() {
  const supabase = sbServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Gate title="Log in to view tutorials" href="/login" label="Log in" />
    );
  }

  const { data: sub } = await supabase
    .from("subscriptions").select("status").eq("user_id", user.id).maybeSingle();
  const active = sub && ["active", "trialing"].includes(sub.status);

  if (!active) {
    return (
      <Gate
        title="Upgrade to unlock tutorials"
        body="$9/month. Cancel any time."
        href="/profile"
        label="Go to profile to upgrade"
      />
    );
  }

  const { data: tutorials } = await supabase
    .from("tutorials").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold">Tutorials</h1>
      <div className="mt-8 flex flex-col gap-8">
        {(tutorials || []).map((t) => (
          <div key={t.id} className="rounded-2xl border-2 border-black bg-white overflow-hidden">
            {t.video_url && (
              <div className="aspect-video bg-black">
                <iframe src={t.video_url} title={t.title}
                  className="w-full h-full" allowFullScreen />
              </div>
            )}
            <div className="p-5">
              <h2 className="text-2xl font-bold">{t.title}</h2>
              {t.description && <p className="mt-2 text-sm">{t.description}</p>}
              {t.content && <p className="mt-3 whitespace-pre-wrap text-sm">{t.content}</p>}
            </div>
          </div>
        ))}
        {(!tutorials || tutorials.length === 0) && <p>No tutorials yet.</p>}
      </div>
    </div>
  );
}

function Gate({ title, body, href, label }) {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="rounded-2xl border-2 border-black bg-yellow-300 p-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {body && <p className="mt-2 text-sm">{body}</p>}
        <Link href={href}
          className="inline-block mt-6 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold">
          {label}
        </Link>
      </div>
    </div>
  );
}
