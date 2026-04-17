import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sbAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const admin = sbAdmin();

  async function sync(sub, customerId) {
    let userId = sub?.metadata?.supabase_user_id;
    if (!userId) {
      const { data } = await admin
        .from("subscriptions").select("user_id")
        .eq("stripe_customer_id", customerId).maybeSingle();
      userId = data?.user_id;
    }
    if (!userId) return;

    await admin.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      updated_at: new Date().toISOString(),
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      if (s.subscription) {
        const sub = await stripe.subscriptions.retrieve(s.subscription);
        await sync(sub, s.customer);
      }
    } else if (event.type.startsWith("customer.subscription.")) {
      const sub = event.data.object;
      await sync(sub, sub.customer);
    } else if (event.type === "invoice.payment_failed") {
      const inv = event.data.object;
      if (inv.subscription) {
        const sub = await stripe.subscriptions.retrieve(inv.subscription);
        await sync(sub, inv.customer);
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "handler" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
