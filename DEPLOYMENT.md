# Money Manager - Deployment Guide

## Quick Deployment Summary

Your Money Manager application is **production-ready** and can be deployed to any Node.js hosting platform.

## 🚀 Deployment Options (Best to Easiest)

### Option 1: Vercel (Recommended for Next.js) ⭐

Vercel is the official platform for Next.js and offers the best experience.

**Steps:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables:
   - `DATABASE_URL` (use PostgreSQL for production)
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your domain)
6. Click "Deploy"
7. Done! ✅

**Estimated time:** 10 minutes
**Cost:** Free tier available

### Option 2: Railway.app

Easy-to-use platform with built-in database support.

**Steps:**
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub
4. Add PostgreSQL database
5. Configure environment variables
6. Deploy

**Estimated time:** 15 minutes
**Cost:** Pay-as-you-go

### Option 3: Render

Similar to Railway, good for free tier.

**Steps:**
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service from GitHub
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

**Estimated time:** 15 minutes
**Cost:** Free tier available

### Option 4: Docker + Any Server

For maximum control and flexibility.

**Steps:**
1. Create Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. Build image: `docker build -t money-manager .`
3. Push to registry (Docker Hub, etc.)
4. Deploy to any container platform

**Estimated time:** 20-30 minutes
**Cost:** Depends on host

## 🔧 Pre-Deployment Checklist

Before deploying to production, complete these steps:

### 1. Security Configuration
```bash
# Generate a secure NEXTAUTH_SECRET
openssl rand -base64 32
# Output example: 5aL9kR2mP3xQ8wT6yU1vB2cD3eF4gH5iJ6kL7mN8o9P0q
```

Copy this value and set it in your production environment variables.

### 2. Database Migration
Switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  # Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Update `.env.local`:
```
DATABASE_URL="postgresql://user:password@host:5432/money_manager"
```

3. Run migration:
```bash
npx prisma migrate deploy
```

### 3. Environment Variables

Set these in your production environment:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `NEXTAUTH_URL` | Your domain | `https://money.example.com` |
| `NEXTAUTH_SECRET` | Secure random string | `5aL9kR2mP3xQ8wT6yU1vB2cD3eF4gH5iJ6kL7mN8o9P0q` |
| `NEXT_PUBLIC_APP_NAME` | App name | `Money Manager` |

### 4. Domain & SSL
- Purchase domain (Namecheap, GoDaddy, etc.)
- Configure DNS pointing to your host
- Enable HTTPS/SSL (most hosts provide free SSL)

### 5. Build Verification
```bash
# Build locally first
npm run build

# Verify no errors
echo $?  # Should output: 0
```

## 📋 Deployment Steps by Platform

### Vercel Deployment (Step-by-Step)

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Import Project**
   - Click "New Project"
   - Select your repository
   - Click "Import"

4. **Configure Environment**
   - Go to "Settings" → "Environment Variables"
   - Add these variables:
     ```
     DATABASE_URL = postgresql://...
     NEXTAUTH_URL = https://yourdomain.com
     NEXTAUTH_SECRET = <your-secure-secret>
     NEXT_PUBLIC_APP_NAME = Money Manager
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Click "Visit" to see your app

### Manual Server Deployment (Step-by-Step)

**Prerequisites:** Node.js 18+, PostgreSQL, Nginx (or similar)

1. **Connect to Server**
   ```bash
   ssh user@your-server.com
   ```

2. **Install Dependencies**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y postgresql postgresql-contrib
   sudo apt-get install -y nginx
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/money-management.git
   cd money-management
   ```

4. **Install Project Dependencies**
   ```bash
   npm ci
   ```

5. **Configure Environment**
   ```bash
   nano .env.local
   ```
   Add:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/money_manager"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="<your-secure-secret>"
   ```

6. **Setup Database**
   ```bash
   sudo -u postgres createdb money_manager
   npx prisma migrate deploy
   ```

7. **Build Application**
   ```bash
   npm run build
   ```

8. **Setup Systemd Service**
   ```bash
   sudo nano /etc/systemd/system/money-manager.service
   ```
   
   Content:
   ```ini
   [Unit]
   Description=Money Manager App
   After=network.target
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/money-management
   ExecStart=/usr/bin/node /var/www/money-management/.next/standalone/server.js
   Restart=on-failure
   Environment="PORT=3000"
   
   [Install]
   WantedBy=multi-user.target
   ```

9. **Enable and Start Service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable money-manager
   sudo systemctl start money-manager
   ```

10. **Configure Nginx**
    ```bash
    sudo nano /etc/nginx/sites-available/money-manager
    ```
    
    Content:
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

11. **Enable SSL (Let's Encrypt)**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```

12. **Verify**
    - Open https://yourdomain.com
    - App should be running

## 📊 Performance Optimization

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
- Set `NODE_ENV=production`
- Set `NEXT_TELEMETRY_DISABLED=1` (optional)

### Database Optimization
- Use PostgreSQL indexes (already configured in schema)
- Set up regular backups
- Monitor query performance

### CDN Setup (Optional)
- Vercel includes CDN automatically
- For manual setup, use Cloudflare
- Configure DNS and HTTPS

## 🔍 Monitoring & Maintenance

### After Deployment

1. **Monitor Application**
   - Check error logs regularly
   - Monitor database performance
   - Track user activity

2. **Backup Strategy**
   ```bash
   # PostgreSQL backup
   pg_dump -U user -h localhost money_manager > backup.sql
   ```

3. **Updates
   - Keep Node.js updated
   - Update dependencies monthly
   - Review security advisories

4. **Scaling**
   - Monitor resource usage
   - Scale database as needed
   - Consider caching layer if needed

## 🆘 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Verify credentials

### Authentication Not Working
```
Error: NEXTAUTH_SECRET is not set
```
- Ensure NEXTAUTH_SECRET is set in environment
- Verify NEXTAUTH_URL matches domain
- Clear browser cookies

### Build Fails
```
Error: Failed to compile
```
- Run `npm install` to ensure dependencies
- Check TypeScript errors: `npm run build`
- Verify .env.local is present

### Application Crashes
- Check application logs
- Verify database connection
- Ensure all env variables are set
- Restart application service

## 📞 Support

**For platform-specific help:**
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app
- **Render**: https://render.com/docs
- **Next.js**: https://nextjs.org/docs

---

## Summary

✅ **Your app is production-ready!**

**Recommended path:**
1. Use Vercel (simplest)
2. Push to GitHub
3. Connect and deploy
4. Set environment variables
5. Done!

**Time to live:** ~10-15 minutes

**Happy deploying! 🚀**
