# Vercel Deployment Guide - PostgreSQL Setup

## Quick Setup (Recommended)

### Option 1: Using Supabase (FREE - Easiest)

#### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project:
   - Organization: Create new or select existing
   - Project name: `money-management`
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Pricing plan: **Free** (perfect for this app)

#### Step 2: Get Your Database URL
1. In Supabase dashboard, go to **Settings** → **Database**
2. Find "Connection string" section
3. Select **URI** tab
4. Copy the connection string (looks like: `postgresql://user:password@host:5432/database`)
5. Replace `[YOUR-PASSWORD]` with the password you created

#### Step 3: Update Prisma Schema
In `prisma/schema.prisma`, change:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Step 4: Create .env.production File
In your project root, create `.env.production`:
```env
DATABASE_URL="your_supabase_connection_string_here"
NEXTAUTH_URL="https://money-management-jade-three.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXT_PUBLIC_APP_NAME="Money Manager"
```

To generate NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

#### Step 5: Push to GitHub
```bash
git add .
git commit -m "Setup PostgreSQL for production"
git push
```

#### Step 6: Configure Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your "money-management" project
3. Click **Settings** → **Environment Variables**
4. Add these variables (one by one):

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | Your Supabase connection string | All (Production, Preview, Development) |
| `NEXTAUTH_URL` | `https://money-management-jade-three.vercel.app` | Production |
| `NEXTAUTH_SECRET` | Your generated secret | All |
| `NEXT_PUBLIC_APP_NAME` | `Money Manager` | All |

#### Step 7: Run Database Migration on Vercel
After updating environment variables, you need to run migrations:

Option A: Via Vercel CLI (if installed):
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

Option B: Add build script to package.json:
```json
{
  "scripts": {
    "build": "prisma migrate deploy && next build",
    "dev": "next dev"
  }
}
```

#### Step 8: Redeploy on Vercel
1. Go to Vercel Dashboard → money-management
2. Click **Deployments** tab
3. Click the three dots on the latest deployment
4. Select **Redeploy**

---

## Option 2: Using Railway (Alternative)

Railway is another great free option (more generous free tier):

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → PostgreSQL
4. Get connection string from Railway dashboard
5. Follow Steps 3-8 from Supabase guide above

---

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
- Make sure you added the variable in Vercel Settings
- Wait 30 seconds, then redeploy
- Check that environment variable is set for "Production"

### Error: "NEXTAUTH_SECRET is not configured"
- Add NEXTAUTH_SECRET to Vercel environment variables
- Redeploy the application

### Error: "relation does not exist"
- Run migrations: `npx prisma migrate deploy`
- Or check that your database user has proper permissions

### App still shows old data
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## After Deployment Checklist

✅ DATABASE_URL set in Vercel  
✅ NEXTAUTH_URL matches your Vercel domain  
✅ NEXTAUTH_SECRET is set  
✅ Prisma schema uses PostgreSQL provider  
✅ Database migrations ran successfully  
✅ App redeployed after env var changes  

---

## Useful Links

- Supabase Docs: https://supabase.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Env Vars: https://vercel.com/docs/projects/environment-variables
- Prisma PostgreSQL: https://www.prisma.io/docs/orm/overview/databases/postgresql

---

## Need Help?

If you get stuck, check:
1. Environment variables in Vercel match your setup
2. Database connection string is correct
3. Prisma schema uses `postgresql` provider
4. You've run `prisma migrate deploy`
5. Your Supabase/Railway project is active (not paused)
