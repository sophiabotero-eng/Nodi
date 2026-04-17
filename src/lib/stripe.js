import Stripe from "stripe";

// No apiVersion pinned, uses the account default. One less thing to break.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder");
