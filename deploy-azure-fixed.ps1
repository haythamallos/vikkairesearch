# Azure Deployment Script with Node.js Version Fix
Write-Host "Building Azure deployment package with Node.js version fix..." -ForegroundColor Green

# Clean up
if (Test-Path "deploy-azure") {
    Remove-Item "deploy-azure" -Recurse -Force
}
if (Test-Path "deploy-azure.zip") {
    Remove-Item "deploy-azure.zip" -Force
}

# Create deployment directory
New-Item -ItemType Directory -Path "deploy-azure" | Out-Null

# Copy application files
Copy-Item "server.js" "deploy-azure/"
Copy-Item "package.json" "deploy-azure/"
Copy-Item "package-lock.json" "deploy-azure/"
Copy-Item "web.config" "deploy-azure/"
Copy-Item ".azure" "deploy-azure/" -Recurse
Copy-Item "public" "deploy-azure/" -Recurse

# Install production dependencies
Write-Host "Installing production dependencies..." -ForegroundColor Yellow
Set-Location "deploy-azure"
npm ci --only=production
Set-Location ".."

# Create package
Compress-Archive -Path "deploy-azure/*" -DestinationPath "deploy-azure.zip" -Force

# Clean up
Remove-Item "deploy-azure" -Recurse -Force

Write-Host "Azure deployment package created: deploy-azure.zip" -ForegroundColor Green
Write-Host "This package includes Node.js version specification and Azure configuration" -ForegroundColor Yellow
Write-Host "Deploy this to resolve the 'waiting for content' issue" -ForegroundColor Cyan

