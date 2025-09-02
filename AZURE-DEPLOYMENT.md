# 🚀 Azure App Service Deployment Guide

This guide will help you deploy your Vikk Dashboard application to Azure App Service.

## 📋 Prerequisites

1. **Azure Account**: Active Azure subscription
2. **Azure CLI**: Installed and configured
3. **Node.js**: Version 16 or higher (for local testing)
4. **Git**: For source control (optional)

## 🔧 Azure App Service Setup

### 1. Create App Service in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Web App" and select it
4. Click "Create"

### 2. Configure App Service

- **Subscription**: Select your subscription
- **Resource Group**: Create new or use existing
- **Name**: Choose a unique name (e.g., `vikk-dashboard-prod`)
- **Publish**: Code
- **Runtime stack**: Node.js 18 LTS
- **Operating System**: Windows (recommended for IIS Node.js)
- **Region**: Choose closest to your users
- **App Service Plan**: Create new or use existing
- **SKU and size**: B1 (Basic) or higher for production

### 3. Configure Application Settings

In your App Service, go to **Configuration** → **Application settings** and add:

```
NODE_ENV = production
PORT = 8080
JWT_SECRET = your-production-jwt-secret-key
```

## 🚀 Deployment Methods

### Method 1: Azure CLI (Recommended)

#### Prerequisites
```bash
# Install Azure CLI
# Windows: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
# macOS: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login
```

#### Deploy using PowerShell script
```powershell
# Make script executable (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run deployment
.\deploy-azure.ps1 -ResourceGroupName "your-resource-group" -AppServiceName "your-app-service-name"
```

#### Deploy using Bash script
```bash
# Make script executable
chmod +x deploy-azure.sh

# Run deployment
./deploy-azure.sh "your-resource-group" "your-app-service-name"
```

### Method 2: Manual Deployment

1. **Prepare files locally**:
   ```bash
   npm ci --only=production
   ```

2. **Create deployment package**:
   - Create a folder called `deploy`
   - Copy: `server.js`, `package.json`, `package-lock.json`, `web.config`
   - Copy: `public/` folder, `node_modules/` folder
   - Zip the `deploy` folder

3. **Deploy via Azure CLI**:
   ```bash
   az webapp deployment source config-zip \
     --resource-group "your-resource-group" \
     --name "your-app-service-name" \
     --src "deploy.zip"
   ```

### Method 3: GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci --only=production
      
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'your-app-service-name'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
```

## 🔒 Security Configuration

### 1. Environment Variables
Set these in Azure App Service Configuration:

```
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key-2024
```

### 2. HTTPS Only
- Enable "HTTPS Only" in your App Service
- Configure custom domain with SSL certificate

### 3. Authentication
- Consider enabling Azure AD authentication
- Configure IP restrictions if needed

## 📊 Monitoring and Logging

### 1. Application Insights
- Enable Application Insights in your App Service
- Monitor performance and errors

### 2. Log Streaming
```bash
az webapp log tail --resource-group "your-resource-group" --name "your-app-service-name"
```

### 3. Health Check
Add health check endpoint to your app:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Configuration**:
   - Azure App Service expects apps to listen on `process.env.PORT`
   - Your app already handles this correctly

2. **Static Files**:
   - `web.config` handles routing for static files
   - Ensure `public/` folder is included in deployment

3. **Dependencies**:
   - Use `npm ci --only=production` for consistent builds
   - Ensure `package-lock.json` is committed

4. **Environment Variables**:
   - Set `NODE_ENV=production` in Azure
   - Update JWT secret for production

### Debug Commands

```bash
# Check app status
az webapp show --resource-group "your-resource-group" --name "your-app-service-name"

# View logs
az webapp log download --resource-group "your-resource-group" --name "your-app-service-name"

# Restart app
az webapp restart --resource-group "your-resource-group" --name "your-app-service-name"
```

## 🌐 Custom Domain

1. **Add custom domain** in Azure App Service
2. **Configure DNS** records
3. **Enable SSL** certificate
4. **Update your app** to handle the domain

## 📈 Scaling

- **Scale Up**: Change App Service Plan tier
- **Scale Out**: Add multiple instances
- **Auto-scaling**: Configure based on CPU/memory usage

## 🔄 Continuous Deployment

- **GitHub**: Connect repository for automatic deployments
- **Azure DevOps**: Use Azure Pipelines
- **Manual**: Use deployment scripts provided

## 📞 Support

- **Azure Documentation**: [App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- **Azure Support**: Available with paid subscriptions
- **Community**: Stack Overflow, Azure forums

---

## 🎯 Quick Start Commands

```bash
# 1. Login to Azure
az login

# 2. Set subscription (if multiple)
az account set --subscription "your-subscription-id"

# 3. Deploy (PowerShell)
.\deploy-azure.ps1 -ResourceGroupName "myResourceGroup" -AppServiceName "vikk-dashboard-prod"

# 3. Deploy (Bash)
./deploy-azure.sh "myResourceGroup" "vikk-dashboard-prod"

# 4. Check status
az webapp show --resource-group "myResourceGroup" --name "vikk-dashboard-prod"
```

Your app will be available at: `https://your-app-service-name.azurewebsites.net`



