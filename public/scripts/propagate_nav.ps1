
$navContent = @"
    <nav>
        <div class="nav-content">
            <a href="index.html" class="nav-logo">
                <span class="text-holo-logo-custom">BLO<span class="hammer-x-icon"><i class="fas fa-hammer hx-1"></i><i class="fas fa-hammer hx-2"></i></span>SMITH AI</span>
            </a>
            <div class="nav-links">
                <a href="index.html" class="btn-holo-forge nav-active"><span>Home</span></a>
                <a href="forums.html" class="btn-holo-forge"><span>The Tavern</span></a>
                <a href="download.html" class="btn-holo-forge"><span>Tools</span></a>
                <a href="creators.html" class="btn-holo-forge"><span>Creators</span></a>
                <a href="pricing.html" class="btn-holo-forge"><span>Market Value</span></a>
                <a href="docs.html" class="btn-holo-forge"><span>Training Manual</span></a>

                <div style="display:flex; gap:1rem; justify-self: end;">
                    <div id="userAuthArea">
                        <a href="#" onclick="openAuthModal(); return false;" class="btn-holo-forge"
                            style="display:flex;align-items:center;gap:8px;">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black.svg"
                                style="width:18px;filter:invert(1);">
                            <span>Login</span>
                        </a>
                    </div>
                    <a href="https://discord.gg/Mq7xaT7tF9" target="_blank" class="btn-holo-discord"><i
                            class="fab fa-discord" style="margin-right:6px;"></i> <span>Discord</span></a>
                </div>
            </div>
            <div class="mobile-menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
"@

$mappings = @{
    "forums.html" = "The Tavern"
    "download.html" = "Tools"
    "creators.html" = "Creators"
    "pricing.html" = "Market Value"
    "docs.html" = "Training Manual"
}

$files = Get-ChildItem "c:\Users\James\Downloads\BloxSmithAI_Website\*.html" -Exclude "index.html"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $content = Get-Content $file.FullName -Raw

    # Replace <nav>...</nav> block
    # Check if nav exists
    if ($content -match "<nav[\s\S]*?</nav>") {
        # Use simple replace for the whole nav block
        $content = $content -replace "<nav[\s\S]*?</nav>", $navContent
        
        # De-activate Home (default is active in template)
        $content = $content -replace 'class="btn-holo-forge nav-active"><span>Home</span>', 'class="btn-holo-forge"><span>Home</span>'
        
        # Activate correct link if mapped
        if ($mappings.ContainsKey($file.Name)) {
            $linkText = $mappings[$file.Name]
            # Regex to find the link by text and add nav-active
            # Look for: <a href="..." class="btn-holo-forge"><span>LinkText</span></a>
            # Replace with: <a href="..." class="btn-holo-forge nav-active"><span>LinkText</span></a>
            
            $pattern = "(class=""btn-holo-forge""><span>$linkText</span>)"
            $content = $content -replace $pattern, 'class="btn-holo-forge nav-active"><span>$1'
            # The above replacement string is tricky. 
            # Better: Replace 'class="btn-holo-forge"><span>Text' with 'class="btn-holo-forge nav-active"><span>Text'
            
            $content = $content.Replace("class=""btn-holo-forge""><span>$linkText", "class=""btn-holo-forge nav-active""><span>$linkText")
        }
        
        Set-Content $file.FullName $content -NoNewline
        Write-Host "Updated $($file.Name)"
    } else {
        Write-Host "No <nav> found in $($file.Name)"
    }
}
