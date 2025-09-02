#!/bin/bash

# Azure App Service Deployment Script
# Make sure you have Azure CLI installed and are logged in

# Check if parameters are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <ResourceGroupName> <AppServiceName> [SlotName]"
    echo "Example: $0 myResourceGroup myAppService production"
    exit 1
fi

RESOURCE_GROUP_NAME=$1
APP_SERVICE_NAME=$2
SLOT_NAME=${3:-"production"}

echo "🚀 Starting Azure App Service deployment..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo "🔐 Please log in to Azure..."
    az login
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

# Create deployment package
echo "📦 Creating deployment package..."
DEPLOY_PATH="deploy"
rm -rf $DEPLOY_PATH
mkdir $DEPLOY_PATH

# Copy necessary files
cp server.js $DEPLOY_PATH/
cp package.json $DEPLOY_PATH/
cp package-lock.json $DEPLOY_PATH/
cp web.config $DEPLOY_PATH/
cp -r public $DEPLOY_PATH/
cp -r node_modules $DEPLOY_PATH/

# Create zip file
echo "📦 Creating zip package..."
cd $DEPLOY_PATH
zip -r ../deploy.zip .
cd ..

# Deploy to Azure App Service
echo "🚀 Deploying to Azure App Service: $APP_SERVICE_NAME..."

if az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME \
    --src "deploy.zip" \
    --slot $SLOT_NAME; then
    
    echo "✅ Deployment successful!"
    
    # Get the app URL
    APP_URL=$(az webapp show --resource-group $RESOURCE_GROUP_NAME --name $APP_SERVICE_NAME --query "defaultHostName" --output tsv)
    echo "🌐 Your app is available at: https://$APP_URL"
    
else
    echo "❌ Deployment failed!"
    exit 1
fi

# Clean up deployment files
echo "🧹 Cleaning up deployment files..."
rm -rf $DEPLOY_PATH
rm -f deploy.zip

echo "🎉 Deployment completed successfully!"



