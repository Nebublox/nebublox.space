#!/usr/bin/env pwsh
# Script to organize BloxSmithAI_Website folder

$rootDir = "."

# Create organized directories if they don't exist
$dirs = @("images", "images/testimonials", "images/team", "images/assets", "videos", "scripts")
foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Cyan
    }
}

# Move image files to images folder
$imageFiles = @(
    @{From = "anvil.png"; To = "images/assets/anvil.png" },
    @{From = "blox-hammer.png"; To = "images/assets/blox-hammer.png" },
    @{From = "hammer-left.png"; To = "images/assets/hammer-left.png" },
    @{From = "hammer-right.png"; To = "images/assets/hammer-right.png" },
    @{From = "smith-hammer.png"; To = "images/assets/smith-hammer.png" },
    @{From = "logo.gif"; To = "images/logo.gif" },
    @{From = "logo.png"; To = "images/logo.png" },
    @{From = "team-forge.jpg"; To = "images/team/team-forge.jpg" },
    @{From = "pfp-ai.png"; To = "images/team/pfp-ai.png" },
    @{From = "pfp-david.png"; To = "images/team/pfp-david.png" },
    @{From = "pfp-lilnug.png"; To = "images/team/pfp-lilnug.png" }
)

# Move testimonial images
for ($i = 1; $i -le 11; $i++) {
    $imageFiles += @{From = "testimonial$i.png"; To = "images/testimonials/testimonial$i.png" }
}

foreach ($file in $imageFiles) {
    if (Test-Path $file.From) {
        # File stays in place - we'll update references instead
        Write-Host "Image found: $($file.From)" -ForegroundColor Yellow
    }
}

# Move video files (just note them)
$videoFiles = @("Video_Generation_Bloxsmithai_Lock_and_Anvil_Walk.mp4", "anvil-video.mp4.mp4")
foreach ($file in $videoFiles) {
    if (Test-Path $file) {
        Write-Host "Video found: $file" -ForegroundColor Yellow
    }
}

# Move PowerShell scripts to scripts folder
$psScripts = @("add_embers.ps1", "propagate_emoji_logo.ps1", "propagate_footer.ps1", "propagate_nav.ps1", "propagate_nav_emoji.ps1", "propagate_nav_fix.ps1")
foreach ($file in $psScripts) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "scripts/$file" -Force
        Write-Host "Moved script: $file -> scripts/$file" -ForegroundColor Cyan
    }
}

# Clean up backup folders (optional - list them)
Write-Host "`nBackup folders that can be removed if not needed:" -ForegroundColor Magenta
if (Test-Path ".vercel_backup") { Write-Host "  - .vercel_backup" }

# List final structure
Write-Host "`n=== Organized Structure ===" -ForegroundColor Green
Get-ChildItem -Directory | ForEach-Object { Write-Host "📁 $($_.Name)" -ForegroundColor Cyan }
Get-ChildItem -File | Where-Object { $_.Extension -in @(".html", ".json", ".xml", ".txt") } | ForEach-Object { Write-Host "📄 $($_.Name)" -ForegroundColor White }

Write-Host "`nFolder organization complete!" -ForegroundColor Green
