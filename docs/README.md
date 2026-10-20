# AgentFlow — AI Automation SaaS

> Deploy AI agents that handle customer support, lead follow-ups, appointment bookings, and report generation — so businesses can focus on growth.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [AI Agents](#ai-agents)
7. [API Reference](#api-reference)
8. [Pricing Plans](#pricing-plans)
9. [Target Businesses](#target-businesses)
10. [Pre-Built Agent Prompts](#pre-built-agent-prompts)
11. [Go-To-Market Strategy](#go-to-market-strategy)
12. [Deployment](#deployment)

---

## Overview

AgentFlow is a multi-tenant SaaS platform that allows businesses to deploy AI-powered agents to automate repetitive tasks. Each business gets a dashboard to create, manage, and monitor their AI agents and conversations.

**Core Features:**
- 4 AI agent types powered by GPT-4o
- Live conversation interface with human escalation
- Stripe subscription billing with 4 tiers
- Per-plan agent and conversation limits
- Custom system prompts per agent
- Conversation status management (Open, Resolved, Escalated)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | NextAuth v5 |
| AI | OpenAI GPT-4o |
| Payments | Stripe |
| Email | Resend |
| Deployment | Vercel (recommended) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ running locally or a cloud DB (Neon, Supabase)
- OpenAI API key
- Stripe account

### Installation

```bash
# Clone or navigate to project
cd D:\SaaS\saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Create the database
psql -U postgres -c "CREATE DATABASE saasdb;"

# Run migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/saasdb"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OpenAI
OPENAI_API_KEY="sk-your-openai-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable"
STRIPE_STARTER_PRICE_ID="price_starter_id"
STRIPE_PRO_PRICE_ID="price_pro_id"
STRIPE_AGENCY_PRICE_ID="price_agency_id"

# Email
RESEND_API_KEY="re_your-resend-key"
FROM_EMAIL="noreply@yourdomain.com"
```

### Generating NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Setting Up Stripe Webhook (Local)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Project Structure

```
saas/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── api/
│   │   │   ├── agents/        # Agents CRUD API
│   │   │   ├── auth/          # NextAuth handler
│   │   │   ├── conversations/ # Conversations + AI API
│   │   │   ├── register/      # User registration API
│   │   │   └── stripe/        # Billing + webhook API
│   │   ├── dashboard/
│   │   │   ├── agents/        # Agents management page
│   │   │   ├── billing/       # Billing & plans page
│   │   │   ├── conversations/ # Live chat interface
│   │   │   ├── layout.tsx     # Dashboard sidebar layout
│   │   │   └── page.tsx       # Overview & stats
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   └── lib/
│       ├── ai.ts              # OpenAI client + agent runner
│       ├── auth.ts            # NextAuth configuration
│       ├── prisma.ts          # Prisma client singleton
│       ├── stripe.ts          # Stripe client + plan config
│       └── utils.ts           # Utility functions
├── docs/                      # Documentation
├── .env                       # Environment variables
└── next.config.ts
```

---

## AI Agents

### Agent Types

#### 1. Customer Support Agent
Handles inbound customer questions, complaints, and FAQs. Automatically detects when a case is too complex and suggests escalation to a human.

**Best for:** Hotels, clinics, e-commerce stores, service companies

**Default prompt behavior:**
- Answers questions clearly and concisely
- Stays polite and professional at all times
- Escalates complex or emotional cases to human staff

---

#### 2. Lead Follow-Up Agent
Re-engages cold or warm leads. Answers objections, highlights value, and attempts to book a call or demo.

**Best for:** Real estate agents, car dealerships, marketing agencies, insurance brokers

**Default prompt behavior:**
- Warm, friendly tone focused on value
- Asks about the lead's specific needs
- Guides toward booking a call or demo

---

#### 3. Appointment Booking Agent
Collects booking details, confirms availability, and schedules appointments.

**Best for:** Clinics, salons, spas, gyms, restaurants, repair shops

**Default prompt behavior:**
- Collects name, preferred date/time, and reason for visit
- Confirms all details before finalizing
- Handles rescheduling and cancellations

---

#### 4. Report Generator Agent
Transforms raw business data into structured, readable reports with insights and recommendations.

**Best for:** Agencies, consultants, marketing teams, operations managers

**Default prompt behavior:**
- Structures output into: Summary, Key Metrics, Insights, Recommendations
- Clear and professional language
- Actionable recommendations

---

### Creating a Custom Agent

1. Go to **Dashboard → Agents → New Agent**
2. Enter a name (e.g. "Hotel Support Bot")
3. Select agent type
4. Optionally enter a custom system prompt
5. Click **Create Agent**

The agent is immediately active and ready to handle conversations.

---

## API Reference

### Authentication
All API routes (except `/api/register`) require an authenticated session via NextAuth.

---

### Agents

#### `GET /api/agents`
Returns all agents for the authenticated user.

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "Hotel Support Bot",
    "type": "CUSTOMER_SUPPORT",
    "systemPrompt": "...",
    "isActive": true,
    "_count": { "conversations": 42 }
  }
]
```

#### `POST /api/agents`
Creates a new agent.

**Body:**
```json
{
  "name": "Hotel Support Bot",
  "type": "CUSTOMER_SUPPORT",
  "systemPrompt": "You are a helpful hotel concierge..."
}
```

#### `PATCH /api/agents/:id`
Updates agent name, prompt, or active status.

**Body:**
```json
{ "isActive": false }
```

#### `DELETE /api/agents/:id`
Deletes an agent and all its conversations.

---

### Conversations

#### `GET /api/conversations`
Returns all conversations. Filter by agent: `?agentId=clx...`

#### `POST /api/conversations`
Starts a new conversation and returns the AI's first reply.

**Body:**
```json
{
  "agentId": "clx...",
  "contact": "John Doe",
  "message": "Hi, I need help with my booking"
}
```

#### `POST /api/conversations/:id`
Sends a message to an existing conversation and returns the AI reply.

**Body:**
```json
{ "message": "What time is check-in?" }
```

#### `PATCH /api/conversations/:id`
Updates conversation status.

**Body:**
```json
{ "status": "RESOLVED" }
```

**Status values:** `OPEN` | `RESOLVED` | `ESCALATED`

---

### Billing

#### `POST /api/stripe`
Creates a Stripe checkout session for plan upgrade.

**Body:**
```json
{ "plan": "PRO" }
```

**For billing portal:**
```json
{ "portal": true }
```

---

## Pricing Plans

| Plan | Price | Agents | Conversations/mo | Features |
|---|---|---|---|---|
| Free | $0 | 1 | 50 | Basic support |
| Starter | $29 | 3 | 500 | Analytics, priority support |
| Pro | $99 | 10 | 5,000 | Custom prompts, webhooks, API |
| Agency | $299 | Unlimited | Unlimited | White-label, dedicated support |

---

## Target Businesses

### Tier 1 — Highest Priority (Easiest to Close)

#### 🏨 Hotels & Hospitality
- **Pain:** Same guest questions 24/7, after-hours inquiries, complaint management
- **Agents:** Customer Support + Appointment Booking
- **Charge:** $99–$299/month
- **Pitch:** *"Your front desk answers the same 10 questions every day. Our AI handles them at 2am so your staff doesn't have to."*

#### 🏥 Dental & Medical Clinics
- **Pain:** Missed appointments cost $50–$200 each, phone lines overwhelmed
- **Agents:** Appointment Booking + Customer Support
- **Charge:** $99/month
- **Pitch:** *"Every missed appointment costs you money. Our AI follows up automatically and fills your calendar."*

#### 🏠 Real Estate Agents
- **Pain:** Leads go cold within hours if not followed up
- **Agents:** Lead Follow-Up + Appointment Booking
- **Charge:** $99–$199/month
- **Pitch:** *"Your leads go cold while you're showing properties. Our AI follows up instantly, 24/7."*

---

### Tier 2 — Strong Fit

#### 🍽️ Restaurants & Cafes
- **Pain:** Reservation calls interrupt service, no-shows waste tables
- **Agents:** Appointment Booking + Customer Support
- **Charge:** $29–$99/month

#### 💆 Spas & Salons
- **Pain:** Booking calls interrupt appointments, staff distracted
- **Agents:** Appointment Booking
- **Charge:** $29–$99/month

#### 🚗 Car Dealerships
- **Pain:** Expensive leads go cold, test drive follow-ups missed
- **Agents:** Lead Follow-Up + Appointment Booking
- **Charge:** $99–$299/month

#### 🛍️ E-Commerce Stores
- **Pain:** Order tracking questions, refund requests, FAQs at scale
- **Agents:** Customer Support
- **Charge:** $29–$99/month

#### 🔧 Repair Shops
- **Pain:** Job status calls, booking repairs, parts availability questions
- **Agents:** Customer Support + Appointment Booking
- **Charge:** $29–$99/month

---

### Tier 3 — Good Fit

| Business | Best Agent | Suggested Price |
|---|---|---|
| Law Firms | Appointment Booking + Support | $99–$199/mo |
| Gyms & Fitness Centers | Appointment Booking | $29–$99/mo |
| Travel Agencies | Lead Follow-Up + Support | $99/mo |
| Accounting Firms | Appointment Booking | $99/mo |
| Driving Schools | Appointment Booking | $29–$99/mo |
| Veterinary Clinics | Appointment Booking | $29–$99/mo |
| Property Management | Customer Support | $99/mo |
| Insurance Agencies | Lead Follow-Up | $99–$199/mo |
| Online Course Creators | Customer Support | $29–$99/mo |
| Moving Companies | Lead Follow-Up + Booking | $99/mo |

---

## Pre-Built Agent Prompts

Copy these into the **Custom System Prompt** field when creating an agent.

### Hotel Concierge
```
You are a friendly and professional hotel concierge AI for [Hotel Name].

You help guests with:
- Check-in and check-out times (Check-in: 3PM, Check-out: 11AM)
- Room availability and booking inquiries
- Hotel amenities (pool, gym, restaurant, spa, parking)
- Local recommendations (restaurants, attractions, transport)
- Complaint handling — always apologize sincerely and offer a solution

If a guest has a serious complaint or emergency, say:
"I'm connecting you with our front desk team right away. Please hold."

Always be warm, professional, and make guests feel welcome.
```

### Dental Clinic Receptionist
```
You are a helpful receptionist AI for [Clinic Name] dental clinic.

You help patients with:
- Booking, rescheduling, and cancelling appointments
- Clinic hours (Mon-Fri 8AM-6PM, Sat 9AM-2PM)
- Services offered (cleanings, fillings, whitening, extractions, braces)
- Insurance and payment questions
- Directions and parking information

To book an appointment, collect:
1. Patient full name
2. Preferred date and time
3. Reason for visit
4. Contact number

For dental emergencies, say:
"Please call our emergency line at [phone number] immediately."

Always be calm, caring, and professional.
```

### Real Estate Lead Follow-Up
```
You are a professional real estate assistant AI for [Agency Name].

Your goal is to re-engage leads who have shown interest in buying, selling, or renting property.

When following up:
- Ask about their specific property needs (location, budget, size, timeline)
- Answer questions about the market, process, and available listings
- Handle objections warmly (e.g. "just browsing" → ask what their ideal timeline is)
- Try to book a call or property viewing with an agent

To book a viewing, collect:
1. Full name
2. Property of interest
3. Preferred date and time

Always be friendly, knowledgeable, and focused on finding the right property for them.
```

### Restaurant Reservation
```
You are a friendly reservation assistant for [Restaurant Name].

You help guests with:
- Table reservations (collect: name, date, time, number of guests, special requests)
- Menu questions and dietary accommodations
- Restaurant hours and location
- Private dining and event bookings
- Parking information

Restaurant hours: [Mon-Sun 11AM-10PM]
Location: [Address]

For large group bookings (10+), say:
"For groups over 10, I'll have our events team contact you within 2 hours."

Always confirm reservation details before finalizing.
Be warm, welcoming, and make guests excited about their visit.
```

### E-Commerce Customer Support
```
You are a helpful customer support AI for [Store Name].

You assist customers with:
- Order status and tracking
- Returns and refund policy (30-day returns, full refund)
- Product questions and recommendations
- Shipping times and costs
- Discount codes and promotions

Return policy: Items can be returned within 30 days of purchase in original condition.
Shipping: Standard 3-5 days, Express 1-2 days.

If a customer is upset, always:
1. Apologize sincerely
2. Acknowledge their frustration
3. Offer a clear solution

For complex issues (damaged items, missing orders), say:
"I'm escalating this to our support team who will contact you within 24 hours."
```

### Spa & Salon Booking
```
You are a friendly booking assistant for [Spa/Salon Name].

You help clients with:
- Booking appointments for services
- Service menu and pricing
- Therapist/stylist availability
- Cancellation and rescheduling (24-hour notice required)
- Gift vouchers and packages

To book an appointment, collect:
1. Client name
2. Service requested
3. Preferred date and time
4. Any special requests or preferences

Services: [List your services and prices here]
Hours: [Mon-Sat 9AM-7PM]

Always make clients feel pampered and excited about their visit.
```

### Auto Repair Shop
```
You are a helpful service assistant for [Shop Name] auto repair.

You help customers with:
- Booking vehicle service appointments
- Service status updates
- Pricing estimates for common repairs
- Accepted vehicle makes and models
- Warranty information on repairs

To book a service, collect:
1. Customer name and contact number
2. Vehicle make, model, and year
3. Issue or service needed
4. Preferred drop-off date and time

For urgent breakdowns, say:
"For emergency towing, please call us directly at [phone number]."

Always be straightforward, honest about pricing, and reassuring about repair quality.
```

### Gym & Fitness Center
```
You are an energetic membership assistant for [Gym Name].

You help members and prospects with:
- Membership plans and pricing
- Class schedules and bookings
- Personal training sessions
- Gym facilities and equipment
- Trial passes and promotions

Membership plans:
- Basic: $29/month (gym access only)
- Standard: $49/month (gym + classes)
- Premium: $79/month (gym + classes + personal training)

To book a free trial or class, collect:
1. Full name
2. Email address
3. Preferred class or visit time

Always be motivating, positive, and focused on helping people reach their fitness goals.
```

---

## Go-To-Market Strategy

### Week 1 — First Customer

**Target:** Local clinics or hotels in your city
**Goal:** 1 paying customer at $99/month

**Day 1-2:**
1. Search Google Maps for "[dental clinic / hotel] [your city]"
2. Collect 50 business names + contact emails/phones
3. Find businesses with reviews mentioning slow response or missed calls

**Day 3-4 — Send this outreach message:**
> *"Hi [Name], I noticed your [clinic/hotel] gets a lot of inquiries after hours. I built an AI that handles bookings and customer questions 24/7 automatically. I'm giving 3 businesses in [city] free access for 14 days. Can I show you a 10-minute demo this week?"*

**Day 5-7:**
- Follow up with non-responders
- Post in local Facebook business groups:
  > *"Giving 3 local [clinics/hotels] free access to an AI booking assistant for 14 days. DM me."*

---

### The Demo Script (10 minutes)

1. **(2 min)** Show the dashboard — clean, simple
2. **(2 min)** Create an agent live — name it after their business
3. **(3 min)** Type a message as a customer — show instant AI reply
4. **(2 min)** Show conversation history, resolve/escalate buttons
5. **(1 min)** Close: *"This runs 24/7 for $99/month. Want me to set it up today?"*

---

### Outreach Channels by Priority

| Channel | Action | Expected Response Rate |
|---|---|---|
| WhatsApp/SMS | Direct message to business owner | 15–25% |
| Instagram DM | Message local businesses | 10–20% |
| Email | Cold email with demo offer | 5–10% |
| Facebook Groups | Post free trial offer | 10–15% |
| LinkedIn | Message managers/owners | 8–15% |
| Fiverr | List as "AI chatbot setup" service | Passive leads |

---

### Closing Strategy

| Objection | Response |
|---|---|
| "Too expensive" | "It's $99/month. One extra booking per week pays for it." |
| "We already have staff" | "This works while your staff sleeps — nights, weekends, holidays." |
| "I need to think about it" | "Let me set it up free for 14 days. No card needed. Cancel anytime." |
| "Does it really work?" | "Let me show you right now — type a message and watch it reply." |

---

### 90-Day Revenue Target

| Month | Customers | MRR |
|---|---|---|
| Month 1 | 3 customers @ $99 | $297 |
| Month 2 | 8 customers @ $99 | $792 |
| Month 3 | 15 customers @ $99 | $1,485 |

Upsell 3 customers to Pro ($199) by month 3 → **$2,000+ MRR**

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# vercel.com → Project → Settings → Environment Variables
```

### Production Checklist

- [ ] Set all environment variables in Vercel
- [ ] Change `NEXTAUTH_URL` to your production domain
- [ ] Generate a strong `NEXTAUTH_SECRET`
- [ ] Set up Stripe webhook pointing to `https://yourdomain.com/api/stripe/webhook`
- [ ] Use a production PostgreSQL database (Neon or Supabase recommended)
- [ ] Add your real OpenAI API key
- [ ] Test a full signup → agent creation → conversation flow
- [ ] Test Stripe checkout with a test card (`4242 4242 4242 4242`)

### Recommended Production DB

**Neon (Free tier available)**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Set as `DATABASE_URL` in Vercel environment variables
5. Run: `npx prisma migrate deploy`

---

## Support & Customization

### Adding a New Agent Type
1. Add the new type to `prisma/schema.prisma` AgentType enum
2. Add the default prompt to `src/lib/ai.ts` AGENT_PROMPTS
3. Add the option to the AGENT_TYPES array in `src/app/dashboard/agents/page.tsx`
4. Run `npx prisma migrate dev`

### Changing Plan Limits
Edit `src/lib/stripe.ts` PLANS object — update agents, conversations, and features per plan.

### White-Label for Clients
1. Replace "AgentFlow" and the logo in `src/app/layout.tsx` and `src/app/dashboard/layout.tsx`
2. Update colors in Tailwind classes (change `indigo` to your brand color)
3. Deploy as a separate Vercel project with the client's domain

---

*Built with Next.js, Prisma, OpenAI, and Stripe.*
