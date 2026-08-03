# Digital Staff Team (DST)

**Your Entire Company. Powered by AI.**

An enterprise-level AI-native business operating system SaaS platform that automates business processes across departments through intelligent AI employees.

## Features

- 🤖 **AI Employees** - Deploy intelligent AI agents for every department
- 📊 **CEO Dashboard** - Real-time business insights and AI-powered analytics
- 💼 **Department Modules** - HR, Finance, Sales, Marketing, Support, IT, and more
- 🧠 **Knowledge Base** - Centralized knowledge management with vector search
- ⚡ **Workflow Automation** - Visual workflow builder for process automation
- 🏢 **Multi-tenant** - Isolated workspaces with full data security
- 📱 **Industry Templates** - Pre-built templates for various industries

## Tech Stack

### Frontend (Cloudflare Pages)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state management)

### Backend (Cloudflare Workers)
- Node.js + Fastify
- TypeScript
- Prisma ORM

### Database & Auth (Supabase)
- PostgreSQL (Supabase)
- Row-Level Security (RLS)
- Supabase Auth

### Infrastructure
- Cloudflare Pages (Frontend)
- Cloudflare Workers (API)
- Cloudflare R2 (File Storage)
- Upstash Redis (Cache/Queues)

## Deployment

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the connection string from Settings > Database
3. Run the SQL setup script:
   ```
   cat apps/api/prisma/supabase-config.sql
   ```
   Paste this in Supabase SQL Editor

### 2. Deploy to Cloudflare

**Frontend (Cloudflare Pages):**
```bash
cd apps/web

# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy .next --project-name=dst-web
```

**API (Cloudflare Workers):**
```bash
cd apps/api

# Deploy
wrangler deploy
```

### 3. Set Environment Variables

In Cloudflare Dashboard > Workers & Pages > your worker:
- `DATABASE_URL` - Supabase connection string
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Generate a secure secret
- `OPENAI_API_KEY` - Your OpenAI API key

### 4. Connect Custom Domain (Optional)

In Cloudflare Dashboard:
1. Go to Workers & Pages > your deployment
2. Click "Custom Domains"
3. Add your domain

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for local Supabase)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dst-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start Supabase locally
npx supabase start

# Update DATABASE_URL in .env with local Supabase URL

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

## Project Structure

```
dst-platform/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/               # App router pages
│   │   ├── components/         # UI components
│   │   └── wrangler.toml      # Cloudflare config
│   └── api/                   # Fastify backend
│       ├── src/
│       │   ├── routes/        # API routes
│       │   └── lib/           # Utilities
│       ├── prisma/
│       │   ├── schema.prisma  # Database schema
│       │   └── supabase-config.sql  # Supabase setup
│       └── wrangler.toml      # Cloudflare Workers config
├── packages/                   # Shared packages (planned)
├── infra/                     # Infrastructure
├── SPEC.md                   # Implementation spec
└── README.md
```

## Pages

- `/` - Landing page with login/register
- `/workspaces` - Workspace selection
- `/dashboard` - CEO Dashboard
- `/ai-employees` - AI Employee management
- `/ai-employees/new` - Create new AI employee
- `/ai-employees/[id]` - AI Employee detail view
- `/knowledge` - Knowledge base
- `/workflows` - Workflow automation
- `/hr`, `/finance`, `/sales`, etc. - Department modules

## Documentation

For detailed documentation, see [SPEC.md](./SPEC.md).

## License

Private - All rights reserved
