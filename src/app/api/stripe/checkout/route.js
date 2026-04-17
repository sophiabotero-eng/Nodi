import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sbServer, sbAdmin } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = sbServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url), { status: 303 });

  const admin = sbAdmin();
  const { data: row } = await admin
    .from("subscriptions").select("stripe_customer_id")
    .eq("user_id", user.id).maybeSingle();

  let customerId = row?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await admin.from("subscriptions").upsert({
      user_id: user.id, stripe_customer_id: customerId, status: "incomplete",
    });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${site}/tutorials`,
    cancel_url: `${site}/profile`,
    metadata: { supabase_user_id: user.id },
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
