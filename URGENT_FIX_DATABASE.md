# URGENT: Fix Vercel Database Error - Complete Step-by-Step Guide

Your app is showing: `Environment variable not found: DATABASE_URL`

This means Vercel doesn't have a database set up yet. Follow these steps EXACTLY:

---

## STEP 1: Create Vercel Postgres Database (5 minutes)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project**: Click on "money-management"
3. **Click "Storage" tab** (next to Deployments)
4. **Click "Create"** button
5. **Select "Postgres"** (the first option)
6. **Fill in details:**
   - Name: `money-management-db`
   - Region: Select closest to you
   - Click **Create**

✅ **IMPORTANT**: Vercel will automatically add these env vars:
- `POSTGRES_URLPGSQL`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`
- `POSTGRES_PASSWORD`

---

## STEP 2: Add DATABASE_URL Environment Variable (2 minutes)

1. Go to **Settings** tab in your Vercel project
2. Click **Environment Variables** (in left sidebar)
3. Click **Add New**
4. Fill in:
   - Name: `DATABASE_URL`
   - Value: `${POSTGRES_URLPGSQL}` (copy this exactly)
   - Environments: Select **Production**, **Preview**, **Development**
5. Click **Save**

6. **Add more variables:**
   - `NEXTAUTH_URL` = `https://money-management-8lq6.vercel.app`
   - `NEXTAUTH_SECRET` = (run: `openssl rand -base64 32` and paste the result)
   - `NEXT_PUBLIC_APP_NAME` = `Money Manager`

---

## STEP 3: Update Your Prisma Schema for PostgreSQL (1 minute)

1. **Open file**: `prisma/schema.prisma`
2. **Find this section** (around line 8-10):
   ```
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. **Change `sqlite` to `postgresql`**:
   ```
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. **Save the file**

---

## STEP 4: Push Changes to GitHub (2 minutes)

```bash
cd e:\Downloads\money-management
git add .
git commit -m "Setup PostgreSQL for production on Vercel"
git push
```

---

## STEP 5: Wait for Vercel to Redeploy (3-5 minutes)

1. Go to Vercel Dashboard → Deployments tab
2. Watch for new deployment to start
3. Wait for it to complete (should show "Ready")
4. Click the deployment to see logs

---

## STEP 6: Run Database Migrations (CRITICAL!)

After deployment succeeds, you MUST run migrations:

**Option A: Using Vercel CLI** (Easiest)
```bash
npm install -g vercel
vercel env pull
npx prisma migrate deploy
```

**Option B: Manual via Postgres Terminal**
1. In Vercel Dashboard, go to Storage → Your Postgres DB
2. Click **Query** tab
3. Let Vercel create the tables automatically

---

## FINAL: Test Your App

1. Go to: https://money-management-8lq6.vercel.app
2. Try to sign up at `/auth/signup`
3. It should work now! ✅

---

## If Still Getting Error:

1. Check that DATABASE_URL is set in Vercel (Settings → Environment Variables)
2. Verify provider is "postgresql" (not sqlite) in schema.prisma
3. Check Vercel Postgres is created (Storage tab)
4. Wait 2 minutes and hard refresh: `Ctrl+Shift+R`
5. Check deployment logs for errors

---

## Quick Checklist:

- [ ] Vercel Postgres database created
- [ ] DATABASE_URL env var set in Vercel
- [ ] NEXTAUTH_URL env var set
- [ ] NEXTAUTH_SECRET env var set
- [ ] schema.prisma changed to postgresql
- [ ] Changes pushed to GitHub
- [ ] Vercel redeployed successfully
- [ ] Database migrations ran

Once all ✅, your app will be fully functional!
