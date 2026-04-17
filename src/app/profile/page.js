import { redirect } from "next/navigation";
import { sbServer } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users").select("*").eq("id", user.id).maybeSingle();
  const { data: sub } = await supabase
    .from("subscriptions").select("status").eq("user_id", user.id).maybeSingle();

  const active = sub && ["active", "trialing"].includes(sub.status);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Your profile</h1>
      <p className="mt-2 text-sm">
        Status: <b>{active ? "Pro member" : "Free plan"}</b>
      </p>

      <div className="mt-8 rounded-2xl border-2 border-black p-6 bg-white">
        <ProfileForm
          initial={{
            id: user.id,
            email: user.email,
            name: profile?.name || "",
            bio: profile?.bio || "",
          }}
        />
      </div>

      <div className="mt-6 rounded-2xl border-2 border-black p-6 bg-white">
        <h2 className="text-2xl font-bold">Subscription</h2>
        {active ? (
          <p className="mt-2 text-sm">You have access to every tutorial.</p>
        ) : (
          <>
            <p className="mt-2 text-sm">
              Upgrade to unlock every tutorial. $9/month, cancel any time.
            </p>
            <form action="/api/stripe/checkout" method="post" className="mt-4">
              <button className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold">
                Upgrade
              </button>
            </form>
          </>
        )}
      </div>

      <form action="/api/auth/signout" method="post" className="mt-6">
        <button className="text-sm underline">Sign out</button>
      </form>
    </div>
  );
}
