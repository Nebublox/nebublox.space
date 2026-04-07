$files = Get-ChildItem "c:\Users\James\Downloads\BloxSmithAI_Website\*.html"

$oldNavLogo = 'BLO<span class="hammer-x-icon"><i class="fas fa-hammer hx-1"></i><i class="fas fa-hammer hx-2"></i></span>SMITH AI'
$newNavLogo = 'BLO<span style="font-size:0.85em; margin:0 -4px; vertical-align: 1px;">⚒️</span>SMITH AI'

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Replace hammer-x-icon with emoji
    $content = $content.Replace($oldNavLogo, $newNavLogo)
    
    Set-Content $file.FullName $content -NoNewline -Encoding UTF8
    Write-Host "Updated $($file.Name)"
}

Write-Host "Done!"
