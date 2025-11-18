# Vercel-Only Deployment Guide (No Supabase)

## Option 1: Using Vercel Postgres (Recommended - Easiest)

Vercel has built-in PostgreSQL support that works seamlessly with your app.

### Step 1: Add Vercel Postgres to Your Project
1. Go to https://vercel.com/dashboard
2. Select your "money-management" project
3. Go to **Storage** tab
4. Click **Create** → Select **Postgres**
5. Name it: `money-management-db`
6. Select your region
7. Click **Create**

Vercel will automatically add the `POSTGRES_URLPGSQL` environment variable!

### Step 2: Update Your Prisma Schema
Change `prisma/schema.prisma` from SQLite to PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URLPGSQL")
}
```

### Step 3: Update Environment Variables
In Vercel Settings → Environment Variables, add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | Copy from POSTGRES_URLPGSQL | Production |
| `NEXTAUTH_URL` | `https://money-management-jade-three.vercel.app` | Production |
| `NEXTAUTH_SECRET` | Generate new with `openssl rand -base64 32` | Production |
| `NEXT_PUBLIC_APP_NAME` | `Money Manager` | Production |

### Step 4: Create `.env.production.local` (for local testing)
```env
POSTGRES_URLPGSQL="your_vercel_postgres_connection_string"
NEXTAUTH_URL="https://money-management-jade-three.vercel.app"
NEXTAUTH_SECRET="your_generated_secret"
NEXT_PUBLIC_APP_NAME="Money Manager"
```

### Step 5: Update package.json Build Script
Add migration to your build process:

```json
{
  "scripts": {
    "build": "prisma migrate deploy && next build",
    "dev": "next dev"
  }
}
```

### Step 6: Push Changes
```bash
git add .
git commit -m "Setup Vercel Postgres integration"
git push
```

### Step 7: Redeploy
- Go to Vercel Dashboard
- Click Deployments tab
- Redeploy the latest deployment

---

## Option 2: Using Neon (Free PostgreSQL)

If you prefer free database, use Neon (works only on Vercel):

1. Go to https://neon.tech
2. Sign up
3. Create new project
4. Copy connection string
5. Add to Vercel as `DATABASE_URL` environment variable
6. Update `prisma/schema.prisma` to use `postgresql` provider
7. Redeploy

---

## Key Differences from Supabase

✅ **Vercel Postgres**: 
- Integrated directly in Vercel dashboard
- One-click setup
- Automatic environment variables
- Easier deployment process
- Perfect for Next.js apps

❌ **Supabase**:
- Separate platform
- More configuration needed
- Manual environment variables

---

## Troubleshooting

### If migrations fail during build:
Add this to `vercel.json` in project root:
```json
{
  "buildCommand": "prisma migrate deploy && next build"
}
```

### If still getting DATABASE_URL not found:
1. Make sure environment variable is set
2. Wait 5 minutes for Vercel to refresh
3. Redeploy again

### Database connection issues:
- Check your Postgres connection string is correct
- Verify user permissions in Vercel Postgres dashboard
- Make sure Prisma schema uses `postgresql` provider

---

## Quick Reference

**Local Development:**
```bash
# Keep using SQLite locally
# DATABASE_URL="file:./prisma/dev.db"
npm run dev
```

**Production on Vercel:**
```
Uses POSTGRES_URLPGSQL or DATABASE_URL with PostgreSQL
Automatic migrations on deploy
```

---

## Still Having Issues?

Check the full deployment guide in `VERCEL_DEPLOYMENT.md`

Or read Vercel's official docs:
https://vercel.com/docs/storage/postgres
