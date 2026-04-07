$sourceFile = "c:\Users\James\Documents\BloxSmithAI_Website\pricing.html"
$targetFiles = @(
    "c:\Users\James\Documents\BloxSmithAI_Website\index.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\download.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\creators.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\docs.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\forums.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\login.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\privacy.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\profile.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\settings.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\stats.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\forge-privacy.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\inquiries.html",
    "c:\Users\James\Documents\BloxSmithAI_Website\hammer-log.html"
)

# Read the content of the source file
$sourceContent = Get-Content -Path $sourceFile -Raw

# Extract the footer content using regex
# We look for <footer class="site-footer"> ... </footer>
# Using (?s) to enable single-line mode (dot matches newline)
if ($sourceContent -match '(?s)(<footer class="site-footer">.*?</footer>)') {
    $footerContent = $matches[1]
    Write-Host "Captured Footer Content from pricing.html"
}
else {
    Write-Error "Could not find footer content in $sourceFile"
    exit
}

foreach ($targetFile in $targetFiles) {
    if (Test-Path $targetFile) {
        Write-Host "Processing $targetFile..."
        $targetContent = Get-Content -Path $targetFile -Raw
        
        # Replace existing footer with the new footer content
        # We assume the target files also have a <footer class="site-footer"> block
        if ($targetContent -match '(?s)<footer class="site-footer">.*?</footer>') {
            $newContent = $targetContent -replace '(?s)<footer class="site-footer">.*?</footer>', $footerContent
            Set-Content -Path $targetFile -Value $newContent -Encoding UTF8
            Write-Host "Updated footer in $targetFile"
        }
        else {
            Write-Warning "Could not find existing footer tag in $targetFile. Appending to end of body (risky, skipping automatic append)."
        }
    }
    else {
        Write-Warning "Target file not found: $targetFile"
    }
}

Write-Host "Footer synchronization complete!"
