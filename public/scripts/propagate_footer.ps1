#!/usr/bin/env pwsh
# Script to propagate footer from index.html to all other HTML files

$sourceFile = "index.html"
$targetFiles = @(
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

# Read the new footer from index.html
$indexContent = Get-Content $sourceFile -Raw

# Extract footer section (from <footer to </footer>)
if ($indexContent -match '(?s)(<footer class="site-footer">.*?</footer>)') {
    $newFooter = $matches[1]
    Write-Host "Extracted footer from index.html" -ForegroundColor Green
    
    foreach ($file in $targetFiles) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            
            # Replace existing footer
            if ($content -match '(?s)<footer[^>]*class="site-footer"[^>]*>.*?</footer>') {
                $content = $content -replace '(?s)<footer[^>]*class="site-footer"[^>]*>.*?</footer>', $newFooter
                Set-Content $file -Value $content -NoNewline
                Write-Host "Updated footer in: $file" -ForegroundColor Cyan
            }
            else {
                Write-Host "No site-footer found in: $file - skipping" -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "File not found: $file" -ForegroundColor Red
        }
    }
    
    Write-Host "`nFooter propagation complete!" -ForegroundColor Green
}
else {
    Write-Host "Could not extract footer from index.html" -ForegroundColor Red
}
