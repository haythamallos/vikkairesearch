# Build Deployment Package for Azure App Service
# Run this script before deploying via VS Code Azure extension

Write-Host "Building Azure App Service Deployment Package..." -ForegroundColor Green

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Error "npm is not installed or not in PATH"
    exit 1
}

# Clean up previous deployment files
Write-Host "Cleaning up previous deployment files..." -ForegroundColor Yellow
if (Test-Path "deploy") {
    Remove-Item "deploy" -Recurse -Force
    Write-Host "Removed old deploy folder" -ForegroundColor Green
}
if (Test-Path "deploy.zip") {
    Remove-Item "deploy.zip" -Force
    Write-Host "Removed old deploy.zip" -ForegroundColor Green
}

# Install production dependencies
Write-Host "Installing production dependencies..." -ForegroundColor Yellow
npm ci --only=production
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install production dependencies"
    exit 1
}
Write-Host "Production dependencies installed" -ForegroundColor Green

# Create deployment directory
Write-Host "Creating deployment directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "deploy" | Out-Null
Write-Host "Created deploy folder" -ForegroundColor Green

# Copy necessary files
Write-Host "Copying application files..." -ForegroundColor Yellow

# Core application files
Copy-Item "server.js" "deploy/"
Copy-Item "package.json" "deploy/"
Copy-Item "package-lock.json" "deploy/"
Copy-Item "web.config" "deploy/"
Write-Host "Copied core files" -ForegroundColor Green

# Public folder
Copy-Item "public" "deploy/" -Recurse
Write-Host "Copied public folder" -ForegroundColor Green

# Node modules
Copy-Item "node_modules" "deploy/" -Recurse
Write-Host "Copied node_modules" -ForegroundColor Green

# Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path "deploy/*" -DestinationPath "deploy.zip" -Force
Write-Host "Created deploy.zip" -ForegroundColor Green

# Display package info
$zipSize = (Get-Item "deploy.zip").Length
$zipSizeMB = [math]::Round($zipSize / 1MB, 2)
Write-Host "Package size: $zipSizeMB MB" -ForegroundColor Cyan

# Clean up deploy folder
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item "deploy" -Recurse -Force
Write-Host "Cleaned up deploy folder" -ForegroundColor Green

Write-Host ""
Write-Host "Deployment package ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open VS Code with Azure App Service extension" -ForegroundColor White
Write-Host "2. Right-click your App Service in Azure Explorer" -ForegroundColor White
Write-Host "3. Select 'Deploy to Web App'" -ForegroundColor White
Write-Host "4. Choose 'Browse...' and select deploy.zip" -ForegroundColor White
Write-Host "5. Click 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "Your app will be available at: https://your-app-service-name.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "Don't forget to set environment variables in Azure Portal:" -ForegroundColor Yellow
Write-Host "   - NODE_ENV = production" -ForegroundColor White
Write-Host "   - PORT = 8080" -ForegroundColor White
Write-Host "   - JWT_SECRET = your-jwt-secret" -ForegroundColor White
