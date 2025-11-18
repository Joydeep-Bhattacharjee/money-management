# Vercel Deployment - Complete Setup Guide

## Problem Fixed
The build was failing because migrations were trying to run during the build process without a database connection.

## Solution
We've separated the build process from migrations. Now follow these steps:

---

## Step-by-Step Deployment

### 1. Set Up Vercel Postgres Database
1. Go to https://vercel.com/dashboard
2. Select your "money-management" project
3. Click **Storage** tab
4. Click **Create** → Select **Postgres**
5. Name: `money-management-db`
6. Click **Create**
7. ✅ Vercel will auto-add `POSTGRES_URLPGSQL` env var

### 2. Add Required Environment Variables
In Vercel, go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | (Copy from POSTGRES_URLPGSQL) | Production |
| `NEXTAUTH_URL` | `https://money-management-jade-three.vercel.app` | Production |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | Production |
| `NEXT_PUBLIC_APP_NAME` | `Money Manager` | Production |

### 3. Update Local Prisma Schema (for PostgreSQL)
Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Keep `.env.local` as SQLite for local development:
```env
DATABASE_URL="file:./prisma/dev.db"
```

### 4. Push Your Changes
```bash
git add .
git commit -m "Fix Vercel build and setup PostgreSQL"
git push
```

### 5. Vercel Will Auto-Deploy
Your app will deploy automatically!

### 6. Run Initial Migration on Vercel
⚠️ **IMPORTANT**: After the first deploy succeeds, you need to run migrations once:

**Option A: Using Vercel CLI** (if installed)
```bash
vercel env pull
npx prisma migrate deploy
```

**Option B: Run via Vercel Postgres Shell**
1. Go to Vercel Dashboard → Storage → Your Postgres DB
2. Click **Tables** or **Connect** tab
3. Run migrations from there

**Option C: Manual via SSH (if needed)**
```bash
vercel env pull .env.production.local
DATABASE_URL=$(grep DATABASE_URL .env.production.local | cut -d '=' -f 2) npx prisma migrate deploy
```

---

## After First Deploy Checklist

✅ Vercel Postgres created  
✅ Environment variables set in Vercel  
✅ Prisma schema updated to PostgreSQL  
✅ Changes pushed to GitHub  
✅ App deployed successfully  
✅ **Initial migration ran** (CRITICAL!)  

---

## Troubleshooting

### Build still failing?
1. Check Vercel logs: Deployments → Click deployment → Logs
2. Verify DATABASE_URL is set in Production environment
3. Make sure POSTGRES_URLPGSQL is visible in Vercel Storage

### "Relation does not exist" after deploy?
- Migrations haven't run yet
- Run: `npm run migrate` (using Vercel CLI)
- Or check if DB user has permissions

### App shows "Unauthorized" on deployed version?
- Check NEXTAUTH_SECRET is exactly same as NEXTAUTH_SECRET_VERCEL
- Clear browser cookies
- Hard refresh: Ctrl+Shift+R

### Database connection timeout?
- Your Postgres might be paused
- Check Vercel Storage dashboard
- Verify connection string is correct

---

## Key Scripts

```bash
# Local development (SQLite)
npm run dev

# Local build test
npm run build

# Database commands
npm run migrate          # Deploy migrations
npm run migrate:push     # Push schema changes
```

---

## Architecture

**Local Development:**
- ✅ SQLite database
- ✅ `.env.local` with `DATABASE_URL=file:./prisma/dev.db`
- ✅ Full TypeScript support
- ✅ Fast HMR

**Production (Vercel):**
- ✅ PostgreSQL database (Vercel Postgres)
- ✅ Environment variables configured
- ✅ Automatic deployments
- ✅ Zero-downtime deploys

---

## Support

If deployment still fails:
1. Check Vercel deployment logs
2. Verify all env vars are set
3. Make sure Postgres DB is created
4. Run migrations if needed
5. Check GitHub for latest code

Good luck! 🚀
