# Azure App Service Deployment Script
# Make sure you have Azure CLI installed and are logged in

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$AppServiceName,
    
    [Parameter(Mandatory=$false)]
    [string]$SlotName = "production"
)

Write-Host "🚀 Starting Azure App Service deployment..." -ForegroundColor Green

# Check if Azure CLI is installed
try {
    $azVersion = az version --output json | ConvertFrom-Json
    Write-Host "✅ Azure CLI version: $($azVersion.'azure-cli')" -ForegroundColor Green
} catch {
    Write-Error "❌ Azure CLI is not installed. Please install it from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Check if logged in to Azure
try {
    $account = az account show --output json | ConvertFrom-Json
    Write-Host "✅ Logged in as: $($account.user.name)" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please log in to Azure..." -ForegroundColor Yellow
    az login
}

# Install production dependencies
Write-Host "📦 Installing production dependencies..." -ForegroundColor Yellow
npm ci --only=production

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
$deployPath = "deploy"
if (Test-Path $deployPath) {
    Remove-Item $deployPath -Recurse -Force
}
New-Item -ItemType Directory -Path $deployPath | Out-Null

# Copy necessary files
Copy-Item "server.js" $deployPath
Copy-Item "package.json" $deployPath
Copy-Item "package-lock.json" $deployPath
Copy-Item "web.config" $deployPath
Copy-Item "public" $deployPath -Recurse
Copy-Item "node_modules" $deployPath -Recurse

# Deploy to Azure App Service
Write-Host "🚀 Deploying to Azure App Service: $AppServiceName..." -ForegroundColor Green

try {
    az webapp deployment source config-zip `
        --resource-group $ResourceGroupName `
        --name $AppServiceName `
        --src "$deployPath.zip" `
        --slot $SlotName
    
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    
    # Get the app URL
    $appUrl = az webapp show --resource-group $ResourceGroupName --name $AppServiceName --query "defaultHostName" --output tsv
    Write-Host "🌐 Your app is available at: https://$appUrl" -ForegroundColor Cyan
    
} catch {
    Write-Error "❌ Deployment failed: $_"
    exit 1
} finally {
    # Clean up deployment files
    if (Test-Path $deployPath) {
        Remove-Item $deployPath -Recurse -Force
    }
    if (Test-Path "$deployPath.zip") {
        Remove-Item "$deployPath.zip" -Force
    }
}

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green



