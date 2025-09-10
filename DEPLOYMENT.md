# 🚀 Deployment Guide - CyberGuard Cybersecurity Game

This guide covers deploying the CyberGuard application to production using modern cloud platforms.

## 📋 Prerequisites

- Node.js 18+ installed locally
- Git repository set up
- Accounts on deployment platforms (Vercel, Render/Heroku, MongoDB Atlas)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Sandbox is free)

### 2. Configure Database Access
1. **Database Access**: Create a database user
   - Username: `cyberguard-user`
   - Password: Generate a secure password
   - Database User Privileges: `Read and write to any database`

2. **Network Access**: Add IP addresses
   - Add `0.0.0.0/0` for development (allows all IPs)
   - For production, add specific IP addresses of your deployment platform

### 3. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://cyberguard-user:<password>@cluster0.xxxxx.mongodb.net/cyberguard?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

## 🖥️ Backend Deployment (Render)

### 1. Prepare Backend for Deployment
1. Create a `render.yaml` file in your project root:
   ```yaml
   services:
     - type: web
       name: cyberguard-backend
       env: node
       plan: free
       buildCommand: npm install
       startCommand: node server/app.js
       envVars:
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           fromDatabase:
             name: cyberguard-db
             property: connectionString
         - key: JWT_ACCESS_SECRET
           generateValue: true
         - key: JWT_REFRESH_SECRET
           generateValue: true
         - key: PORT
           value: 3001
   ```

### 2. Deploy to Render
1. Go to [Render](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/app.js`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
     JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
     PORT=3001
     ```

### 3. Alternative: Heroku Deployment
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   heroku create cyberguard-backend
   ```
3. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   heroku config:set JWT_ACCESS_SECRET="your_secret_key"
   heroku config:set JWT_REFRESH_SECRET="your_refresh_secret"
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend
1. Update your API base URL in `lib/api.ts`:
   ```typescript
   const API_BASE_URL = process.env.NODE_ENV === 'production'
     ? 'https://your-backend-url.onrender.com/api'  // Your Render backend URL
     : 'http://localhost:3001/api';
   ```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Set environment variables in Vercel dashboard:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

### 3. Alternative: Netlify Deployment
1. Build the project:
   ```bash
   npm run build
   npm run export  # If using static export
   ```
2. Drag and drop the `out` folder to Netlify
3. Or connect GitHub repository for automatic deployments

## 🐳 Docker Deployment

### 1. Local Docker Development
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# MongoDB: localhost:27017
```

### 2. Production Docker Deployment
1. **Build images**:
   ```bash
   docker build -f Dockerfile.frontend -t cyberguard-frontend .
   docker build -f Dockerfile.backend -t cyberguard-backend .
   ```

2. **Deploy to cloud platforms**:
   - **AWS ECS/Fargate**
   - **Google Cloud Run**
   - **Azure Container Instances**
   - **DigitalOcean App Platform**

## 🔧 Environment Variables Reference

### Backend (.env.local)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyberguard

# JWT Secrets (MUST be changed in production!)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long

# Environment
NODE_ENV=production

# Server
PORT=3001
```

### Frontend (Vercel Environment Variables)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🛡️ Security Checklist

### Before Production Deployment:

- [ ] **Change default JWT secrets** to strong, unique values (32+ characters)
- [ ] **Update CORS origins** to your actual domain names
- [ ] **Configure MongoDB Atlas IP whitelist** for your deployment platform
- [ ] **Enable MongoDB Atlas network security**
- [ ] **Set up SSL/TLS certificates** (usually automatic with Vercel/Render)
- [ ] **Review and test all API endpoints**
- [ ] **Verify admin account security**
- [ ] **Test rate limiting functionality**
- [ ] **Validate input sanitization**

## 📊 Post-Deployment Setup

### 1. Create Admin Account
The system automatically creates an admin account:
- **Email**: `admin@cyberguard.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change this password immediately after first login!

### 2. Seed Initial Data
The application automatically seeds with:
- 10+ cybersecurity quiz questions
- 5+ realistic security scenarios
- Sample user data for testing

### 3. Monitor Application
- Check logs for any errors
- Verify database connections
- Test all game functionality
- Confirm real-time features work

## 🔍 Troubleshooting

### Common Issues:

**Database Connection Errors**
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure database user has proper permissions

**CORS Errors**
- Update CORS origins in backend to match your frontend domain
- Verify environment variables are set correctly

**Authentication Issues**
- Ensure JWT secrets are set and consistent
- Check cookie settings for your domain

**Socket.io Connection Problems**
- Verify WebSocket support on your hosting platform
- Check CORS configuration for Socket.io

## 📈 Scaling Considerations

### Performance Optimization:
- **CDN**: Use Vercel's built-in CDN for static assets
- **Database Indexing**: Add indexes for frequently queried fields
- **Caching**: Implement Redis for session storage and caching
- **Load Balancing**: Use multiple backend instances for high traffic

### Monitoring:
- **Error Tracking**: Integrate Sentry or similar service
- **Analytics**: Add Google Analytics or Mixpanel
- **Uptime Monitoring**: Use UptimeRobot or Pingdom
- **Performance**: Monitor with New Relic or DataDog

## 🎯 Production URLs

After deployment, your application will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`
- **Admin Dashboard**: `https://your-app.vercel.app/admin`

## 📞 Support

For deployment issues:
1. Check the application logs
2. Verify all environment variables
3. Test API endpoints individually
4. Review security settings

Your cybersecurity awareness game is now production-ready with enterprise-grade security, scalability, and monitoring capabilities!