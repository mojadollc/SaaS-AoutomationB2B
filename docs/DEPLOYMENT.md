# Deployment Guide

How to deploy AgentFlow to production.

---

## Recommended Stack

| Service | Purpose | Cost |
|---|---|---|
| Vercel | Hosting (Next.js) | Free tier available |
| Neon | PostgreSQL database | Free tier available |
| OpenAI | AI (GPT-4o) | Pay per use |
| Stripe | Payments | 2.9% + 30¢ per transaction |
| Resend | Email | Free up to 3,000/month |

---

## Step 1 — Set Up Database (Neon)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project → name it `agentflow`
3. Copy the connection string — looks like:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this — you'll need it for `DATABASE_URL`

---

## Step 2 — Set Up Stripe

### Create Products & Prices
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Products → Add Product → **Starter**
   - Price: $29/month recurring
   - Copy the Price ID (starts with `price_`)
3. Repeat for **Pro** ($99/month) and **Agency** ($299/month)
4. Save all three Price IDs

### Get API Keys
1. Developers → API Keys
2. Copy **Publishable key** and **Secret key**

### Set Up Webhook
1. Developers → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** (starts with `whsec_`)

---

## Step 3 — Set Up Resend (Email)

1. Go to [resend.com](https://resend.com) and create an account
2. API Keys → Create API Key
3. Copy the key (starts with `re_`)
4. Add and verify your sending domain

---

## Step 4 — Deploy to Vercel

### Option A — Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# From project directory
cd D:\SaaS\saas
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: agentflow
# - Directory: ./
# - Override settings? No
```

### Option B — GitHub + Vercel Dashboard
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click Deploy

---

## Step 5 — Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all of these:

```
DATABASE_URL          = postgresql://...your-neon-connection-string...
NEXTAUTH_URL          = https://yourdomain.vercel.app
NEXTAUTH_SECRET       = (generate with: openssl rand -base64 32)
OPENAI_API_KEY        = sk-...
STRIPE_SECRET_KEY     = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_STARTER_PRICE_ID = price_...
STRIPE_PRO_PRICE_ID     = price_...
STRIPE_AGENCY_PRICE_ID  = price_...
RESEND_API_KEY        = re_...
FROM_EMAIL            = noreply@yourdomain.com
```

---

## Step 6 — Run Database Migration

After deploying, run the migration against your production database:

```bash
# Set DATABASE_URL to your Neon connection string temporarily
$env:DATABASE_URL="postgresql://...your-neon-url..."

# Run migration
npx prisma migrate deploy
```

Or add it as a build command in Vercel:
- Settings → General → Build Command:
  ```
  npx prisma migrate deploy && npm run build
  ```

---

## Step 7 — Update Stripe Webhook URL

After deployment, update your Stripe webhook endpoint URL to your actual production domain:
```
https://yourdomain.vercel.app/api/stripe/webhook
```

---

## Production Checklist

- [ ] `DATABASE_URL` points to production Neon database
- [ ] `NEXTAUTH_URL` is set to your production domain
- [ ] `NEXTAUTH_SECRET` is a strong random string (not the default)
- [ ] OpenAI API key is valid and has credits
- [ ] Stripe is in **live mode** (not test mode) for real payments
- [ ] Stripe webhook URL points to production domain
- [ ] Stripe webhook signing secret is from production webhook
- [ ] Database migration has been run (`prisma migrate deploy`)
- [ ] Test signup → create agent → start conversation works end-to-end
- [ ] Test Stripe checkout with card `4242 4242 4242 4242` (test mode first)
- [ ] Custom domain configured in Vercel (optional)

---

## Custom Domain Setup (Vercel)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g. `agentflow.io`)
3. Update DNS records at your domain registrar:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.21.21`
4. Update `NEXTAUTH_URL` to `https://yourdomain.com`
5. Update Stripe webhook URL to `https://yourdomain.com/api/stripe/webhook`

---

## Local Development

```bash
cd D:\SaaS\saas

# Start PostgreSQL (must be running)
# Then:

npm run dev
```

### Test Stripe Webhooks Locally
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret it gives you and set it as `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## Monitoring & Logs

- **Vercel Logs:** Dashboard → Your Project → Deployments → View logs
- **Database:** Neon Dashboard → Tables (view data directly)
- **Stripe:** Dashboard → Events (see all payment events)
- **OpenAI:** Platform → Usage (monitor API costs)

---

## Scaling Considerations

| When | Action |
|---|---|
| 100+ users | Upgrade Neon to paid plan for more connections |
| High AI usage | Monitor OpenAI costs, consider caching common responses |
| 500+ users | Add Redis for session caching |
| Enterprise clients | Add rate limiting to API routes |

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon dashboard → Connection string |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com → Developers → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com → Developers → API Keys |
| `STRIPE_STARTER_PRICE_ID` | dashboard.stripe.com → Products → Starter → Price ID |
| `STRIPE_PRO_PRICE_ID` | dashboard.stripe.com → Products → Pro → Price ID |
| `STRIPE_AGENCY_PRICE_ID` | dashboard.stripe.com → Products → Agency → Price ID |
| `RESEND_API_KEY` | resend.com → API Keys |
| `FROM_EMAIL` | Your verified sending email address |
