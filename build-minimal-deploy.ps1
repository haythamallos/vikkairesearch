# Build Minimal Deployment Package for Testing
Write-Host "Building minimal deployment package for testing..." -ForegroundColor Green

# Clean up
if (Test-Path "deploy-minimal") {
    Remove-Item "deploy-minimal" -Recurse -Force
}
if (Test-Path "deploy-minimal.zip") {
    Remove-Item "deploy-minimal.zip" -Force
}

# Create minimal deployment
New-Item -ItemType Directory -Path "deploy-minimal" | Out-Null

# Copy only essential files
Copy-Item "test-deployment.js" "deploy-minimal/"
Copy-Item "package.json" "deploy-minimal/"
Copy-Item "package-lock.json" "deploy-minimal/"
Copy-Item "web.config" "deploy-minimal/"

# Copy only required node_modules
New-Item -ItemType Directory -Path "deploy-minimal/node_modules" | Out-Null
Copy-Item "node_modules/express" "deploy-minimal/node_modules/" -Recurse

# Create minimal web.config for test
$minimalWebConfig = @"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="test-deployment.js" verb="*" modules="iisnode" />
    </handlers>
    
    <rewrite>
      <rules>
        <rule name="Default Route" stopProcessing="true">
          <match url=".*" />
          <action type="Rewrite" url="test-deployment.js" />
        </rule>
      </rules>
    </rewrite>
    
    <iisnode
      nodeProcessCommandLine="node"
      debuggingEnabled="true"
      logDirectory="iisnode"
      watchedFiles="*.js;*.json"
      maxLogFileSizeInKB="128"
      maxTotalLogFileSizeInKB="1024"
      maxLogFiles="20"
      devErrorsEnabled="true"
      flushResponse="false"
      enableXFF="false"
      promoteServerVars=""
      configOverrides="iisnode.yml"
      node_env="production"
    />
  </system.webServer>
</configuration>
"@

$minimalWebConfig | Out-File -FilePath "deploy-minimal/web.config" -Encoding UTF8

# Create package
Compress-Archive -Path "deploy-minimal/*" -DestinationPath "deploy-minimal.zip" -Force

# Clean up
Remove-Item "deploy-minimal" -Recurse -Force

Write-Host "Minimal deployment package created: deploy-minimal.zip" -ForegroundColor Green
Write-Host "Deploy this to test basic functionality" -ForegroundColor Yellow


