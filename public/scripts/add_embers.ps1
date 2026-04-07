#!/usr/bin/env pwsh
# Script to add forge-embers.js to all HTML files

$htmlFiles = @(
    "index.html",
    "docs.html",
    "pricing.html", 
    "creators.html",
    "download.html",
    "forums.html",
    "login.html",
    "profile.html",
    "settings.html",
    "admin.html",
    "admin-panel.html",
    "privacy.html",
    "dashboard.html"
)

$scriptTag = '<script src="js/forge-embers.js"></script>'

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Check if already added
        if ($content -match 'forge-embers\.js') {
            Write-Host "Already has forge-embers.js: $file" -ForegroundColor Yellow
            continue
        }
        
        # Add before closing </body> tag
        if ($content -match '</body>') {
            $content = $content -replace '</body>', "    $scriptTag`r`n</body>"
            Set-Content $file -Value $content -NoNewline
            Write-Host "Added forge-embers.js to: $file" -ForegroundColor Cyan
        }
        else {
            Write-Host "No </body> tag found in: $file" -ForegroundColor Red
        }
    }
    else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nForge embers script added to all HTML files!" -ForegroundColor Green
