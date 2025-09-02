# 🚀 VS Code Azure App Service Extension Deployment Guide

This guide will walk you through deploying your Vikk Dashboard app using the Azure App Service extension in VS Code.

## 📋 Prerequisites

1. **VS Code** installed
2. **Azure App Service extension** installed in VS Code
3. **Azure account** with active subscription
4. **Node.js** installed locally (for building)

## 🔧 Installation & Setup

### 1. Install Azure App Service Extension

1. Open VS Code
2. Go to **Extensions** (Ctrl+Shift+X)
3. Search for **"Azure App Service"**
4. Install the extension by Microsoft
5. Reload VS Code

### 2. Sign in to Azure

1. Press **Ctrl+Shift+P** to open command palette
2. Type **"Azure: Sign In"** and select it
3. Follow the browser authentication process
4. Select your Azure subscription

## 🚀 Deployment Methods

### Method 1: Direct Deployment (Recommended)

#### Step 1: Prepare Your App
1. **Install production dependencies**:
   ```bash
   npm ci --only=production
   ```

2. **Build deployment package** (using VS Code tasks):
   - Press **Ctrl+Shift+P**
   - Type **"Tasks: Run Task"**
   - Select **"Build Deployment Package"**
   - This will create `deploy.zip`

#### Step 2: Deploy via Extension
1. **Open Azure Explorer**:
   - Click the Azure icon in the left sidebar
   - Or press **Ctrl+Shift+P** → **"Azure: Focus on Azure Explorer"**

2. **Navigate to your App Service**:
   - Expand **App Services**
   - Find your app service
   - Right-click on it

3. **Deploy**:
   - Select **"Deploy to Web App"**
   - Choose **"Browse..."** and select `deploy.zip`
   - Click **"Deploy"**

### Method 2: Deploy on Save

1. **Enable auto-deploy**:
   - Open `.vscode/settings.json`
   - Set `"azureAppService.deployOnSave": true`

2. **Deploy automatically**:
   - Make changes to your code
   - Save the file (Ctrl+S)
   - Extension will automatically deploy

### Method 3: Command Palette Deployment

1. **Press Ctrl+Shift+P**
2. **Type**: `Azure App Service: Deploy to Web App`
3. **Select your app service**
4. **Choose deployment source**:
   - **Browse**: Select `deploy.zip`
   - **Current Workspace**: Deploy entire workspace
   - **Git Repository**: Deploy from Git

## 📁 Deployment Package Structure

Your `deploy.zip` should contain:
```
deploy/
├── server.js
├── package.json
├── package-lock.json
├── web.config
├── public/
│   ├── index.html
│   ├── dashboard.html
│   ├── sample-lawyer-page.html
│   ├── clone.html
│   ├── styles.css
│   ├── script.js
│   └── dashboard.js
└── node_modules/
    ├── express/
    ├── cors/
    ├── bcryptjs/
    └── jsonwebtoken/
```

## ⚙️ Configuration

### 1. Environment Variables

**In Azure Portal**:
1. Go to your App Service
2. **Configuration** → **Application settings**
3. Add these settings:

```
NODE_ENV = production
PORT = 8080
JWT_SECRET = M+y1vfxLfxYYRxW7LCjmnufYNjfTVpZGRGrCO8ccrsxcLgeFyyvR464f3ymttfozZeHRV85iUpoZym3HUtHIBA==
```

### 2. VS Code Settings

The `.vscode/settings.json` file configures:
- **Deploy on save**: Automatic deployment
- **Deploy subpath**: Which folder to deploy
- **Node.js version**: Specify Node.js version
- **Advanced creation**: Enable advanced App Service options

## 🔄 Deployment Workflow

### 1. Development Workflow
```bash
# 1. Make changes to your code
# 2. Test locally
npm run dev

# 3. Build deployment package
# (Use VS Code task: "Build Deployment Package")

# 4. Deploy via Azure extension
# (Right-click App Service → Deploy to Web App)
```

### 2. Automated Workflow
```bash
# 1. Enable deploy on save in settings.json
# 2. Make changes and save
# 3. Extension automatically deploys
```

## 📊 Monitoring & Logs

### 1. View Logs in VS Code
1. **Right-click** your App Service in Azure Explorer
2. **Select**: "View Logs" or "Start Log Stream"
3. **Monitor** real-time logs

### 2. Application Insights
1. **Enable** Application Insights in Azure Portal
2. **View** performance metrics and errors
3. **Monitor** user behavior and app health

## 🚨 Troubleshooting

### Common Issues

#### 1. **Deployment Fails**
- **Check logs**: Right-click App Service → "View Logs"
- **Verify package**: Ensure `deploy.zip` contains all files
- **Check dependencies**: Ensure `node_modules` is included

#### 2. **App Won't Start**
- **Check environment variables**: Verify in Azure Portal
- **Check web.config**: Ensure IIS configuration is correct
- **Check Node.js version**: Ensure compatibility

#### 3. **Authentication Issues**
- **Verify JWT_SECRET**: Check environment variable
- **Check token expiration**: Default is 24 hours
- **Verify user credentials**: Test with demo accounts

### Debug Commands

```bash
# Check app status
az webapp show --name "your-app-name" --resource-group "your-resource-group"

# View logs
az webapp log tail --name "your-app-name" --resource-group "your-resource-group"

# Restart app
az webapp restart --name "your-app-name" --resource-group "your-resource-group"
```

## 🔒 Security Best Practices

### 1. **Environment Variables**
- Never commit secrets to version control
- Use Azure Key Vault for sensitive data
- Rotate secrets periodically

### 2. **HTTPS Only**
- Enable "HTTPS Only" in Azure App Service
- Configure SSL certificates
- Use custom domains with SSL

### 3. **Access Control**
- Configure IP restrictions if needed
- Use Azure AD authentication
- Monitor access logs

## 📈 Scaling & Performance

### 1. **App Service Plan**
- **Scale Up**: Change plan tier (B1, S1, P1, etc.)
- **Scale Out**: Add multiple instances
- **Auto-scaling**: Configure based on metrics

### 2. **Performance Optimization**
- **Enable compression**: In Azure Portal
- **Configure caching**: For static files
- **Monitor metrics**: CPU, memory, response time

## 🔄 Continuous Deployment

### 1. **GitHub Integration**
1. **Connect repository** in Azure Portal
2. **Enable auto-deploy** on push
3. **Configure branch policies**

### 2. **Azure DevOps**
1. **Create pipeline** in Azure DevOps
2. **Configure build and deploy** steps
3. **Set up environments** and approvals

## 📞 Support & Resources

### 1. **VS Code Extension**
- **Documentation**: [Azure App Service Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)
- **Issues**: GitHub repository for the extension
- **Updates**: Check for extension updates regularly

### 2. **Azure Resources**
- **Documentation**: [Azure App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/)
- **Community**: Stack Overflow, Azure forums
- **Support**: Azure support plans

---

## 🎯 Quick Start Checklist

- [ ] Install Azure App Service extension
- [ ] Sign in to Azure account
- [ ] Create App Service in Azure Portal
- [ ] Set environment variables
- [ ] Build deployment package (`deploy.zip`)
- [ ] Deploy via VS Code extension
- [ ] Test deployed application
- [ ] Configure monitoring and logging
- [ ] Set up continuous deployment (optional)

## 🌐 Access Your App

After successful deployment, your app will be available at:
`https://your-app-service-name.azurewebsites.net`

**Demo Credentials**:
- **admin** / **admin123**
- **user** / **user123**
- **demo** / **demo123**

---

**Happy Deploying! 🚀**



