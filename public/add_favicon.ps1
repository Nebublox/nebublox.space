$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    if ($content -match "href=.assets/images/logo.png.") {
        Write-Host "Replacing logo.png favicon in $($file.Name)"
        $newContent = $content -replace "href=.assets/images/logo.png.", "href='assets/images/anvil.png'"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    } elseif ($content -notmatch "rel=.icon.") {
        Write-Host "Adding favicon to $($file.Name)"
        $newContent = $content -replace "</title>", "</title>`n    <link rel='icon' type='image/png' href='assets/images/anvil.png'>"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
