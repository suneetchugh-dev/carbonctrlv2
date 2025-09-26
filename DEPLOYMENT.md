# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com)

## Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: CarbonCtrl with chatbot"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/carbonctrl.git
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: carbonctrl
# - Directory: ./
# - Override settings? No
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `npm install`

### 3. Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```bash
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

### 4. Serverless Functions

The Express server will be automatically converted to Vercel serverless functions. The `vercel.json` configuration handles:

- API routes (`/api/*`) → Serverless functions
- Static files → CDN
- Automatic HTTPS
- Global edge deployment

### 5. Domain Configuration

- Vercel provides a free `.vercel.app` domain
- Custom domain can be added in Project Settings → Domains
- SSL certificates are automatically managed

## Post-Deployment

### Test the Deployment

1. **Frontend**: Visit your Vercel URL
2. **API**: Test `/api/ping` endpoint
3. **Chatbot**: Test the chatbot functionality
4. **Authentication**: Test login/register with Firebase

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: View in Vercel Dashboard → Functions
- **Error Tracking**: Automatic error reporting

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (Vercel uses Node 18.x)
   - Verify all dependencies are in `package.json`
   - Check build logs in Vercel Dashboard

2. **API Errors**
   - Verify environment variables are set
   - Check function logs for errors
   - Ensure OpenAI API key is valid

3. **Static Assets**
   - Verify `dist/spa` is the correct output directory
   - Check that all assets are being built correctly

### Environment Variables Checklist

```bash
# Required
OPENAI_API_KEY=sk-...                    # OpenAI API key for chatbot
NODE_ENV=production                     # Environment

# Optional
PING_MESSAGE=ping                        # Custom ping message
```

## Production Optimizations

### Performance
- Vercel automatically optimizes static assets
- CDN distribution for global performance
- Automatic image optimization

### Security
- Environment variables are encrypted
- HTTPS enforced by default
- CORS configured for API routes

### Scaling
- Serverless functions auto-scale
- Global edge deployment
- Automatic load balancing

## Next Steps

After successful deployment:

1. **Monitor Performance**: Use Vercel Analytics
2. **Set up Monitoring**: Configure error tracking
3. **Custom Domain**: Add your own domain
4. **CI/CD**: Automatic deployments on git push
5. **Environment Management**: Set up staging/production environments

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [vercel.com/community](https://vercel.com/community)
- **Status**: [vercel-status.com](https://vercel-status.com)
