# The Fullpreneur Dashboard

**ADHD-Friendly, Execution-Focused, Integrated Flywheel**

A comprehensive dashboard for managing multiple revenue streams, tracking leads, scheduling work, monitoring fulfillment, and storing strategic plans.

## Features

- **Home Dashboard**: North Star action card, quick stats, and revenue stream overview
- **CRM Pipeline**: Unified lead management across Rooted, Services, and Business Funding
- **Calendar**: Integrated schedule for Dominion work and power coding sessions
- **Creative Space**: Fulfillment tracker for Art, Music, Travel, and Meditation (burnout prevention)
- **The Vault**: Interactive "Complete Plan" and strategy storage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend/Auth**: Supabase
- **Icons**: Lucide React
- **Target Cost**: $0 - $20/month

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account (free tier works)

### Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Get these from your [Supabase project settings](https://app.supabase.com/project/_/settings/api).

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home dashboard
│   ├── crm/               # CRM pipeline page
│   ├── calendar/          # Calendar page
│   ├── creative/          # Fulfillment tracker
│   ├── vault/             # Strategy storage
│   ├── layout.tsx         # Root layout with sidebar
│   └── globals.css        # Global styles
├── components/            # React components
│   └── Sidebar.tsx       # Discord-style navigation sidebar
├── lib/                   # Utility functions
│   └── supabase/         # Supabase client configuration
└── public/               # Static assets
```

## Revenue Streams

The dashboard tracks six core revenue streams:

1. **Dominion Raceway** - Day job ($50k base)
2. **Rooted** - Marketplace platform
3. **Services** - Landscaping & Trimlight
4. **Business Funding** - SBA 7(a) broker
5. **AlliO SaaS** - B2B venue management
6. **Octane Nation** - Motorsport community

## Execution Philosophy

- **Phase 1 (Months 1-3)**: 75-90 hour weeks, focus on DATA collection
- **Burnout Prevention**: Daily fulfillment tracking is mandatory
- **ADHD-Friendly**: Clear systems, visible progress, one clear next action (North Star)

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Cost Optimization

- Supabase free tier: 500MB database, 2GB bandwidth (usually sufficient)
- Vercel hosting: Free tier (or $20/month Pro if needed)
- Total target: $0 - $20/month operating cost

## Next Steps

1. Connect Supabase database (create tables for leads, events, fulfillments)
2. Implement authentication (optional, for multi-user)
3. Add data persistence (currently using mock data)
4. Set up automated data collection integrations
5. Add analytics and reporting dashboards

## License

Private project - All rights reserved
