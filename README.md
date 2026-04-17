# ArchNodi (simple version)

Stripped-down Next.js MVP. No Google Fonts, no middleware, no markdown parser, no build-time database calls. Should deploy to Vercel cleanly.

## 1. Install

```bash
npm install
cp .env.example .env.local
```

## 2. Supabase

1. Create a project at supabase.com.
2. Settings, API: copy the Project URL, anon key, service_role key into `.env.local`.
3. SQL Editor: paste `supabase/schema.sql` and run it.
4. Authentication, Providers: enable Email. For testing, disable email confirmation.

## 3. Stripe (test mode)

1. Create a monthly product. Copy the `price_...` id into `STRIPE_PRICE_ID`.
2. Developers, API keys: copy the secret key into `STRIPE_SECRET_KEY`.
3. Leave `STRIPE_WEBHOOK_SECRET` as `whsec_placeholder` for the first deploy. You will fill it in after.

## 4. Run locally

```bash
npm run dev
```

Go to http://localhost:3000.

## 5. Deploy to Vercel

1. Push this folder to GitHub.
2. vercel.com, New Project, pick the repo.
3. Environment Variables, add every key from `.env.local`.
4. Deploy. You will get a URL like `archnodi.vercel.app`.
5. Update `NEXT_PUBLIC_SITE_URL` to that URL and redeploy.
6. In Stripe, add a webhook to `https://YOUR_URL/api/stripe/webhook`, listen for `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`. Paste the signing secret into Vercel as `STRIPE_WEBHOOK_SECRET` and redeploy.

## Env vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
NEXT_PUBLIC_SITE_URL
```

## What each page does

- `/` Homepage, static. No DB calls. Will render even with zero config.
- `/blog`, `/blog/[slug]` Reads from `posts` table. Public.
- `/tutorials` Reads from `tutorials` table. Only shows content if the logged-in user has an active subscription.
- `/community` Lightweight feed. Anyone can read, logged-in users can post.
- `/login`, `/signup`, `/profile` Email auth and subscription management.
- `/api/stripe/checkout` Creates a Stripe Checkout session and redirects.
- `/api/stripe/webhook` Keeps the `subscriptions` table in sync.

## Why this version is simpler

- Every page uses `dynamic = "force-dynamic"`, so the build itself never calls Supabase. Missing env vars only hurt you at runtime, not at build.
- Middleware is a no-op. Each protected page checks auth itself.
- No Google Fonts. No markdown library. No route guards that depend on cookies at build time.
- Stripe SDK uses your account's default API version. Nothing to pin, nothing to mismatch.
