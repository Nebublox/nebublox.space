getgenv().CleanupPreviousInstance = function()
    local stateKeys = {"NebuState_AnimeHeroes"}
    for _, key in ipairs(stateKeys) do
        if getgenv()[key] then
            pcall(function() getgenv()[key].Nebublox_Running = false end)
            getgenv()[key] = nil
        end
    end
    pcall(function()
        local containers = {}
        pcall(function() if gethui then table.insert(containers, gethui()) end end)
        pcall(function() table.insert(containers, game:GetService("CoreGui")) end)
        pcall(function() table.insert(containers, game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui")) end)
        for _, parent in ipairs(containers) do
            for _, v in pairs(parent:GetChildren()) do
                if v.Name == "NebubloxUI" or v.Name == "NebubloxNotifs" then v:Destroy() end
            end
        end
    end)
end

getgenv().InitializeApp = function()
    local SUPPORTED_IDS = {["74578002631923"] = true, ["18218084687"] = true}
    if not SUPPORTED_IDS[tostring(game.PlaceId)] and not SUPPORTED_IDS[tostring(game.GameId)] then
        return
    end

    CleanupPreviousInstance()

    local success, err = pcall(function()
        local ReplicatedStorage = game:GetService("ReplicatedStorage")
        local Workspace = game:GetService("Workspace")
        local Players = game:GetService("Players")
        local RunService = game:GetService("RunService")
        local player = Players.LocalPlayer
        local latestPlayerData = nil
        local sharedGachas = nil
        local lastCostCheck = {}
        local currencyCategoryCache = {}
        
        repeat task.wait(0.5) until player:GetAttribute("Data_Load") or ReplicatedStorage:GetAttribute("Server_Load")

        getgenv().NebuState_AnimeHeroes = {
            Nebublox_Running = true,
            Farm = false,
            AutoHatch = false,
            AutoClansRoll = false,
            AutoKekkeiRoll = false,
            AutoRacesRoll = false,
            AutoKiRoll = false,
            AutoHakiRoll = false,
            AutoFruitsRoll = false,
            AutoBreathingsRoll = false,
            AutoDemonArtsRoll = false,
            AutoRanksRoll = false,
            AutoAurasRoll = false,
            AutoBankaisRoll = false,
            AutoElementsRoll = false,
            AutoZCapsuleRoll = false,
            AutoShadowsRoll = false,
            AutoShikaisRoll = false,
            AutoLosEspadasRoll = false,
            AutoRankRoll = false,
            AutoHeroesClassRoll = false,
            AutoShinyMachineRoll = false,
            AutoSorcererGradeRoll = false,
            AutoInnateTechniquesRoll = false,
            AutoTransformationsRoll = false,
            AutoTrial1 = false,
            AutoTrial2 = false,
            AutoTrial3 = false,
            AutoClaimAchievements = false,
            AutoClaimTimeRewards = false,
            AutoCollectChests = false,
            AutoDamagePotion = false,
            AutoLuckPotion = false,
            AutoCoinsPotion = false,
            AutoSoulsPotion = false,
            AntiAfk = true,
            PriorityTargetName = "None",
            SecondaryTargetNames = {"All"},
            SelectedStar = "",
            AutoAscension = false,
            AutoReturn = false,
            PreventUnequip = false,
            AutoUpgradeSlot1 = false,
            AutoUpgradeSlot2 = false,
            SavedPosition = nil,
            Initialized = false,
            Toggles = {}
        }
        
        local state = getgenv().NebuState_AnimeHeroes
        
        local NightX = player.PlayerScripts:WaitForChild("NightX", 10)
        local Framework = NightX and require(NightX)
        
        -- Resolve shared Gachas static configuration on load
        task.spawn(function()
            local fw = Framework
            while not (fw and fw.Shared and fw.Shared.Gachas) do
                task.wait(1)
                fw = GetFramework()
            end
            sharedGachas = fw.Shared.Gachas
        end)
        
        local function GetFramework()
            if Framework then return Framework end
            local nx = player.PlayerScripts:FindFirstChild("NightX")
            if nx then pcall(function() Framework = require(nx) end) end
            return Framework
        end

        local Bridge = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("Bridge")
        
        local function FireServer(...)
            local args = {...}
            if state.PreventUnequip then
                -- Broad filtering for common fighter unequip signals
                if (args[1] == "Fighters" and (args[2] == "Unequip" or args[2] == "Deselect")) or
                   (args[1] == "General" and args[2] == "Fighters" and (args[3] == "Unequip" or args[3] == "Deselect")) then
                    return
                end
            end

            local fw = GetFramework()
            if fw and fw.Bridge and fw.Bridge.FireServer then
                fw.Bridge:FireServer(...)
            else
                Bridge:FireServer(...)
            end
        end

        local function FireSelf(...)
            local fw = GetFramework()
            if fw and fw.Bridge and fw.Bridge.FireSelf then
                fw.Bridge:FireSelf(...)
            end
        end

        local CharacterCache = {
            Char = nil,
            HRP = nil,
            Hum = nil
        }

        local function GetCharacter()
            local char = player.Character
            if char and char.Parent then
                if char ~= CharacterCache.Char or not CharacterCache.HRP or not CharacterCache.HRP.Parent then
                    CharacterCache.Char = char
                    CharacterCache.HRP = char:WaitForChild("HumanoidRootPart", 5)
                    CharacterCache.Hum = char:FindFirstChildOfClass("Humanoid")
                end
                return CharacterCache.Char, CharacterCache.HRP, CharacterCache.Hum
            end
            return nil, nil, nil
        end

        local function getGradient(text, type)
            local res = ""
            local cols = {"#FFFFFF"}
            if type == "Mythical" then
                cols = {"#FF00F2", "#009DFF", "#00FFFF", "#02F900", "#8AFA00", "#FFEE00", "#FFB300", "#FF7700"}
            elseif type == "Secret" then
                cols = {"#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF", "#CCCCCC", "#999999", "#666666", "#333333"}
            elseif type == "Legendary" then
                cols = {"#FFB300", "#FFCC00", "#FFD700", "#FFE600", "#FFFF00", "#FFE600", "#FFD700", "#FFCC00"}
            end
            for i = 1, #text do
                local char = text:sub(i, i)
                if char == " " then res = res .. " " else
                    local col = cols[((i - 1) % #cols) + 1]
                    res = res .. "<font color='" .. col .. "'>" .. char .. "</font>"
                end
            end
            return res
        end

        local RarityColors = {
            Common = Color3.fromRGB(200, 200, 200),
            Rare = Color3.fromRGB(0, 150, 255),
            Epic = Color3.fromRGB(180, 0, 255),
            Legendary = Color3.fromRGB(255, 200, 0),
            Mythical = Color3.fromRGB(255, 0, 100),
            Secret = Color3.fromRGB(50, 50, 50)
        }

        local gachaMap = {
            Clans = 1, Kekkei = 2, Races = 2, Ki = 2, Haki = 3,
            Breathings = 4, Fruits = 5, DemonArts = 6, Ranks = 7
        }

        local GachaNameToKey = {
            ["Clans"] = "Clans",
            ["Kekkei Genkai"] = "Kekkei",
            ["Elements"] = "Elements",
            ["Races"] = "Races",
            ["Ki"] = "Ki",
            ["Z Capsule"] = "ZCapsule",
            ["Transformations"] = "Transformations",
            ["Haki"] = "Haki",
            ["Fruits"] = "Fruits",
            ["Breathings"] = "Breathings",
            ["Demon Arts"] = "DemonArts",
            ["Ranks"] = "Ranks",
            ["Auras"] = "Auras",
            ["Bankais"] = "Bankais",
            ["Shadows"] = "Shadows",
            ["Shikais"] = "Shikais",
            ["Los Espadas"] = "LosEspadas",
            ["Rank"] = "Rank",
            ["Heroes Class"] = "HeroesClass",
            ["Shiny Machine"] = "ShinyMachine",
            ["ShinyMachine"] = "ShinyMachine",
            ["Sorcerer Grade"] = "SorcererGrade",
            ["Innate Techniques"] = "InnateTechniques"
        }

        local DefaultGachaIcons = {
            ["Clans"] = "rbxassetid://79206141217919",
            ["Kekkei Genkai"] = "rbxassetid://117295243285096",
            ["Elements"] = "rbxassetid://105675446512753",
            ["Races"] = "rbxassetid://101312726711773",
            ["Ki"] = "rbxassetid://117635429060388",
            ["Z Capsule"] = "rbxassetid://70893493500096",
            ["Transformations"] = "rbxassetid://119104172153111",
            ["Haki"] = "rbxassetid://130141035541433",
            ["Fruits"] = "rbxassetid://129379991897111",
            ["Breathings"] = "rbxassetid://106248355866318",
            ["Demon Arts"] = "rbxassetid://116250207503412",
            ["Ranks"] = "rbxassetid://117635429060388",
            ["Auras"] = "rbxassetid://131626643424139",
            ["Bankais"] = "rbxassetid://92233186549146",
            ["Shadows"] = "rbxassetid://78405166477276",
            ["Shikais"] = "rbxassetid://79632228052466",
            ["LosEspadas"] = "rbxassetid://103867631735069",
            ["Rank"] = "rbxassetid://99452952484783",
            ["HeroesClass"] = "rbxassetid://138654742879590",
            ["ShinyMachine"] = "rbxassetid://118854643785344",
            ["SorcererGrade"] = "rbxassetid://133314174384557",
            ["InnateTechniques"] = "rbxassetid://78540511924619"
        }

        local function CheckGachaSecret(index)
            local fw = GetFramework()
            local cur = (latestPlayerData and latestPlayerData.Gachas and latestPlayerData.Gachas[tostring(index)])
                or (fw and fw.Data and fw.Data.Gachas and fw.Data.Gachas[tostring(index)])
            local gData = sharedGachas and sharedGachas[index]
            if cur and gData and gData.Pool[cur] and gData.Pool[cur].Rarity == "Secret" then return true end
            return false
        end

        local function IsAtLobby()
            local ids = {["74578002631923"] = true, ["18218084687"] = true}
            return ids[tostring(game.PlaceId)]
        end

        local promoCodes = {
            "RELEASE", "SORRYDELAY", "THANKS500CCU", "RELEASEPART2", "THANKSFORPLAYING",
            "SORRYSHUTDOWN", "SORRYSHUTDOWN2", "SORRYSHUTDOWN3", "SORRYSHUTDOWN4",
            "UPDATE0.5", "300LIKES", "QOL1", "QOL2", "UPDATE1.5", "700LIKES", 
            "UPDATE2", "200KVISITS", "1KLIKES", "250KVISITS", "UPDATE2.5", "UPDATE3", 
            "300KVISITS", "1.5KLIKES", "400KVISITS", "4KFAVORITES", "UPDATE3.5",
            "UPDATE4", "500KVISITS", "SRRYSHUTSOK", 
        }

        local Nebublox = getgenv().Nebublox
        if not Nebublox or not Nebublox.Version then
            Nebublox = (function()
                local function GetLocal(path)
                    if isfile and readfile then
                        local ok, content = pcall(readfile, path)
                        if ok and content and (content:find("NEBUBLOX UI") or content:find("SUPERNOVA")) then
                            return content
                        end
                    end
                    return nil
                end

                local paths = {"NebubloxUI.lua", "scripts/NebubloxUI.lua", "DarkMatterV1-main/scripts/NebubloxUI.lua", "NebubloxUI-main/NebubloxUI.lua", "./NebubloxUI.lua"}
                local rawCode = nil

                for _, p in ipairs(paths) do
                    rawCode = GetLocal(p)
                    if rawCode then break end
                end

                if not rawCode then
                    local proxy = "https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxUI.lua"
                    local s, res = pcall(game.HttpGet, game, proxy)
                    if s and res and (res:find("NEBUBLOX UI") or res:find("SUPERNOVA")) then
                        rawCode = res
                    else
                        local github = "https://raw.githubusercontent.com/Nebublox/DarkMatterV1/main/scripts/NebubloxUI.lua"
                        local s2, res2 = pcall(game.HttpGet, game, github)
                        if s2 and res2 and (res2:find("NEBUBLOX UI") or res2:find("SUPERNOVA")) then
                            rawCode = res2
                        else
                            local fallback = "https://raw.githubusercontent.com/Nebublox/DarkMatterV1/main/NebubloxUI.lua"
                            local s3, res3 = pcall(game.HttpGet, game, fallback)
                            if s3 and res3 and (res3:find("NEBUBLOX UI") or res3:find("SUPERNOVA")) then
                                rawCode = res3
                            end
                        end
                    end
                end

                if rawCode then
                    local fn, compileErr = loadstring(rawCode, "NebubloxUI")
                    if fn then
                        local ok, result = pcall(fn)
                        if ok and type(result) == "table" then
                            getgenv().Nebublox = result
                            return result
                        else
                            local lib = getgenv().Nebublox or getgenv().Nebublox_Export
                            if lib then return lib end
                            warn("[NEBUBLOX] Library execution failed: ", tostring(result))
                        end
                    else
                        warn("[NEBUBLOX] Failed to compile: " .. tostring(compileErr))
                    end
                end

                warn("[NEBUBLOX] CRITICAL: Library source not found from any source.")
                return nil
            end)()
        end

        if not Nebublox then
            warn("[Critical] Nebublox UI library failed to load.")
            return
        end

        local Window = Nebublox:CreateWindow({
            Title = "<b><font color='#00E6FF'>ANIME</font> <font color='#FF1E3C'>HEROES</font></b>",
            Subtitle = "<b><font color='#00E6FF'>ANIME</font> <font color='#FF1E3C'>HEROES</font></b>",
            Size = UDim2.new(0, 530, 0, 320),
            KeySystem = false,
            Profile = true,
            ConfigFolder = "AnimeHeroes",
            CyberBackground = true,
            TitleGradient = {Color3.fromRGB(0, 230, 255), Color3.fromRGB(255, 30, 60)}
        }, state)
        Window:AddConsole()
        Window:AddStandardHome()

        local _origNotify = Window.Notify
        Window.Notify = function(self, ...)
            pcall(_origNotify, self, ...)
        end
        -- Force automation off on startup (overrides saved config)
        state.AutoCollectChests = true
        state.AutoTrial1 = false
        state.AutoTrial2 = false
        state.AutoTrial3 = false
        state.AutoEnterTower = false
        state.AutoReturn = false
        state.AutoHatch = false
        state.Farm = false

        -- Force ALL gacha rolls off on startup (never restore from saved config)
        state.AutoClansRoll = false
        state.AutoKekkeiRoll = false
        state.AutoRacesRoll = false
        state.AutoKiRoll = false
        state.AutoHakiRoll = false
        state.AutoFruitsRoll = false
        state.AutoBreathingsRoll = false
        state.AutoDemonArtsRoll = false
        state.AutoRanksRoll = false
        state.AutoAurasRoll = false
        state.AutoBankaisRoll = false
        state.AutoElementsRoll = false
        state.AutoZCapsuleRoll = false
        state.AutoTransformationsRoll = false
        state.AutoShadowsRoll = false
        state.AutoShikaisRoll = false
        state.AutoLosEspadasRoll = false
        state.AutoRankRoll = false
        state.AutoHeroesClassRoll = false
        state.AutoShinyMachineRoll = false
        state.AutoSorcererGradeRoll = false
        state.AutoInnateTechniquesRoll = false

        local currentScannedTypes = {["None"] = true}
        local function PerformScan(silent)
            local folder = Workspace:FindFirstChild("Client") and Workspace.Client:FindFirstChild("Enemies")
            local seen = {["None"] = true}
            local prioList = {"None"}
            local secList = {"All"}
            if folder then 
                for _, e in pairs(folder:GetChildren()) do 
                    if not seen[e.Name] and e.Name ~= "Dummy" then
                        seen[e.Name] = true
                        table.insert(prioList, e.Name) 
                        table.insert(secList, e.Name) 
                    end 
                end 
            end
            currentScannedTypes = seen
            
            if state.PriorityDropdown then
                state.PriorityDropdown:Refresh(prioList)
            end
            if state.SecondaryDropdown then
                state.SecondaryDropdown:Refresh(secList)
            end
            
            if not silent then
                Window:Notify({Title = "Scanner", Content = "Found " .. #list-1 .. " target types.", Type = "success"})
            end
        end

        task.spawn(function()
            local folder = Workspace:WaitForChild("Client", 10) and Workspace.Client:WaitForChild("Enemies", 10)
            if not folder then return end
            
            local scanQueued = false
            local function queueScan()
                if scanQueued then return end
                scanQueued = true
                task.spawn(function()
                    task.wait(1.5)
                    PerformScan(true)
                    scanQueued = false
                end)
            end

            folder.ChildAdded:Connect(function(child)
                if child.Name ~= "Dummy" and not currentScannedTypes[child.Name] then
                    queueScan()
                end
            end)

            folder.ChildRemoved:Connect(function()
                if #folder:GetChildren() == 0 then
                    queueScan()
                end
            end)
        end)

        local CombatTab = Window:CreateTab({Name = "Combat", Icon = "rbxassetid://137397942282915"})
        local WorldsTab = Window:CreateTab({Name = "Worlds", Icon = "rbxassetid://95372066151272"})
        local GamemodesTab = Window:CreateTab({Name = "Gamemodes", Icon = "rbxassetid://98272170253039"})
        local ArtifactTab = Window:CreateTab({Name = "Artifacts", Icon = "rbxassetid://138006141373527"})

        -- COMBAT
        local FarmSec = CombatTab:AddSection({Name = "<b><font color='#FFFFFF' size='24'>Master Combat</font></b>"})
        local controlRow = FarmSec:AddRow({Columns = 1})
        controlRow[1]:AddToggle({Name = "🗡️ Combat", Default = state.Farm, Callback = function(v) state.Farm = v end})
        
        local scannerRow = FarmSec:AddRow({Columns = 2})
        state.PriorityDropdown = scannerRow[1]:AddDropdown({Name = "🎯 Priority", Options = {"None"}, Callback = function(v) state.PriorityTargetName = v end})
        scannerRow[2]:AddButton({Name = "🔍 Scan Mobs", Callback = function()
            PerformScan(false)
        end})
        state.SecondaryDropdown = FarmSec:AddDropdown({Name = "🛡️ Secondary (Multiple)", Options = {"All"}, Default = {"All"}, Multi = true, Callback = function(v) state.SecondaryTargetNames = v end})

        -- Initial scan on execution
        task.spawn(function()
            task.wait(1)
            PerformScan(true)
        end)

        local dynamicGachaMap = {}
        local function ResolveGachaIndex(name)
            if dynamicGachaMap[name] then return dynamicGachaMap[name] end
            if sharedGachas then
                local cleanName = name:gsub("%s+", ""):lower()
                -- Exact match first to avoid Rank/Ranks collisions
                for idx, gacha in pairs(sharedGachas) do
                    if gacha.Name:gsub("%s+", ""):lower() == cleanName then
                        dynamicGachaMap[name] = idx
                        return idx
                    end
                end
                -- Fuzzy fallback
                for idx, gacha in pairs(sharedGachas) do
                    local cleanGachaName = gacha.Name:gsub("%s+", ""):lower()
                    if cleanGachaName:find(cleanName) or cleanName:find(cleanGachaName) then
                        dynamicGachaMap[name] = idx
                        return idx
                    end
                end
            end
            return nil
        end

        local function StringToColorSequence(str)
            local parts = {}
            for part in string.gmatch(str, "%S+") do table.insert(parts, tonumber(part)) end
            local keypoints = {}
            for i = 1, #parts, 4 do
                if parts[i] and parts[i+1] and parts[i+2] and parts[i+3] then
                    table.insert(keypoints, ColorSequenceKeypoint.new(parts[i], Color3.new(parts[i+1], parts[i+2], parts[i+3])))
                end
            end
            if #keypoints == 0 then return nil end
            return ColorSequence.new(keypoints)
        end

        local function UpdateGachaButtonVisuals(toggleName)
            local key = GachaNameToKey[toggleName] or toggleName
            local toggle = state.Toggles[key]
            if not toggle or not toggle.Frame then return end
            
            local gachaIdx = ResolveGachaIndex(key)
            if not gachaIdx then return end
            
            if sharedGachas and sharedGachas[gachaIdx] then
                local gData = sharedGachas[gachaIdx]
                local fw = GetFramework()
                local cur = (latestPlayerData and latestPlayerData.Gachas and latestPlayerData.Gachas[tostring(gachaIdx)])
                    or (fw and fw.Data and fw.Data.Gachas and fw.Data.Gachas[tostring(gachaIdx)])
                
                if cur and gData.Pool[cur] then
                    local roll = gData.Pool[cur]
                    
                    -- Set the actual Gacha item icon
                    if roll.Icon then
                        toggle:SetIcon(roll.Icon)
                    end
                    
                    if toggle.Frame then
                        local gradStr = nil
                        -- Determine color sequence based on rarity
                        if roll.Rarity == "Secret" then
                            gradStr = "0 0.268168 0.268168 0.268168 0 0.1 0.0520517 0.0520517 0.0520517 0 0.2 0.00703671 0.00703671 0.00703671 0 0.3 0.150317 0.150317 0.150317 0 0.4 0.427164 0.427164 0.427164 0 0.5 0.731832 0.731832 0.731832 0 0.6 0.947948 0.947948 0.947948 0 0.7 0.992963 0.992963 0.992963 0 0.8 0.849683 0.849683 0.849683 0 0.9 0.572836 0.572836 0.572836 0 1 0.268168 0.268168 0.268168 0"
                        elseif roll.Rarity == "Mythical" then
                            gradStr = "0 0.858607 0.0189502 0.622443 0 0.1 0.994919 0.190966 0.314115 0 0.2 0.942189 0.481023 0.0767878 0 0.3 0.720558 0.778328 0.0011137 0 0.4 0.414681 0.969321 0.115997 0 0.5 0.141393 0.98105 0.377557 0 0.6 0.00508097 0.809034 0.685885 0 0.7 0.0578108 0.518977 0.923212 0 0.8 0.279442 0.221672 0.998886 0 0.9 0.585319 0.0306786 0.884003 0 1 0.858607 0.0189502 0.622443 0"
                        elseif roll.Rarity == "Legendary" then
                            gradStr = "0 1 0.803037 0.000198367 0 0.1 1 0.78724 0.000339706 0 0.2 1 0.745884 0.000709737 0 0.3 1 0.694766 0.00116712 0 0.4 1 0.65341 0.00153715 0 0.5 1 0.637613 0.00167849 0 0.6 1 0.65341 0.00153715 0 0.7 1 0.694766 0.00116712 0 0.8 1 0.745884 0.000709737 0 0.9 1 0.78724 0.000339706 0 1 1 0.803037 0.000198367 0"
                        end
                        
                        -- Remove old backdrop if it exists
                        local targetIcon = toggle.Frame:FindFirstChild("Icon") or toggle.Frame:FindFirstChild("IconEmoji")
                        if targetIcon then
                            local backdrop = targetIcon:FindFirstChild("LiveGachaBackdrop")
                            if backdrop then backdrop:Destroy() end
                        end
                        
                        local stroke = toggle.Frame:FindFirstChild("ToggleStroke")
                        if stroke then
                            if gradStr then
                                local grad = stroke:FindFirstChild("StrokeGradient")
                                if not grad then
                                    grad = Instance.new("UIGradient")
                                    grad.Name = "StrokeGradient"
                                    grad.Parent = stroke
                                end
                                grad.Color = StringToColorSequence(gradStr)
                                
                                stroke.Thickness = 3
                                stroke.Transparency = 0
                                stroke.Color = Color3.new(1, 1, 1)
                            else
                                local grad = stroke:FindFirstChild("StrokeGradient")
                                if grad then grad:Destroy() end
                                
                                stroke.Thickness = 1
                                stroke.Transparency = 0.5
                                stroke.Color = Color3.new(1, 1, 1)
                            end
                        end
                        
                        -- Manage the standard button state visuals independently
                        local isON = state["Auto" .. key .. "Roll"]
                        toggle.Frame.BackgroundColor3 = isON and Color3.fromRGB(15, 30, 40) or Color3.fromRGB(5, 15, 20)
                        toggle.Frame.BackgroundTransparency = isON and 0.5 or 0.8
                    end
                end
            end
        end

        local function GetGachaData(name)
            if sharedGachas then
                local cleanName = name:gsub("%s+", ""):lower()
                for _, gacha in pairs(sharedGachas) do
                    local cleanGachaName = gacha.Name:gsub("%s+", ""):lower()
                    if cleanGachaName:find(cleanName) or cleanName:find(cleanGachaName) then return gacha end
                end
            end
            return nil
        end

        local function NotifyGacha(gachaName, resultName)
            local data = GetGachaData(gachaName)
            if not data then return end
            local result = nil
            local resultIdx = nil
            for idx, p in pairs(data.Pool) do
                if p.Name == resultName then
                    result = p
                    resultIdx = idx
                    break
                end
            end
            if result then
                Window:Notify({
                    Title = "<b>GACHA: " .. gachaName:upper() .. "</b>",
                    Content = string.format("Rolled: <font color='#00E6FF'><b>%s</b></font>\nMulti: <font color='#00FF00'>%sx</font>", result.Name, result.Multiplier),
                    Icon = result.Icon, Type = "success"
                })

                -- Sync rolled result to latestPlayerData
                local gachaIdx = ResolveGachaIndex(gachaName)
                if gachaIdx and latestPlayerData then
                    if not latestPlayerData.Gachas then latestPlayerData.Gachas = {} end
                    latestPlayerData.Gachas[tostring(gachaIdx)] = resultIdx
                end

                pcall(function() UpdateGachaButtonVisuals(gachaName) end)

                if result.Rarity == "Secret" then
                    local toggle = state.Toggles[gachaName]
                    if toggle then
                        toggle:Set(false)
                    end
                    state["Auto" .. gachaName .. "Roll"] = false
                end
            end
        end

        Bridge.OnClientEvent:Connect(function(...)
            local args = {...}
            if args[1] == "General" and args[2] == "GachaController" and args[3] == "Result" then
                local gachaIdx = args[4]
                local resultName = args[5]
                local gachaName = "Unknown"
                
                -- Check Gachas data first for a dynamic match
                local fw = GetFramework()
                if fw and fw.Shared and fw.Shared.Gachas and fw.Shared.Gachas[gachaIdx] then
                    local realName = fw.Shared.Gachas[gachaIdx].Name
                    gachaName = GachaNameToKey[realName] or realName
                    dynamicGachaMap[gachaName] = gachaIdx
                else
                    for name, idx in pairs(dynamicGachaMap) do
                        if idx == gachaIdx then
                            gachaName = name
                            break
                        end
                    end
                end
                
                -- Fallback to static gachaMap if still unknown
                if gachaName == "Unknown" then
                    for name, idx in pairs(gachaMap) do
                        if idx == gachaIdx then
                            gachaName = name
                            break
                        end
                    end
                end
                
                NotifyGacha(gachaName, resultName)
            elseif args[1] == "Architect" and args[2] == "Data" and args[3] == "Receiver" then
                latestPlayerData = args[4]
                
                -- Print inventory and gacha config structure once for developers
                if not state.DiagnosticPrinted then
                    state.DiagnosticPrinted = true
                    task.spawn(function()
                        pcall(function()
                            print("------ NEBUBLOX DIAGNOSTIC START ------")
                            if latestPlayerData then
                                print("latestPlayerData Keys:")
                                for k, v in pairs(latestPlayerData) do
                                    print("  " .. tostring(k) .. " (" .. type(v) .. ")")
                                end
                                if latestPlayerData.Inventory then
                                    print("Inventory categories:")
                                    for catName, catData in pairs(latestPlayerData.Inventory) do
                                        print("  Category: " .. tostring(catName))
                                        if type(catData) == "table" then
                                            for itemName, itemVal in pairs(catData) do
                                                if type(itemVal) == "table" then
                                                    print("    Subcategory: " .. tostring(itemName))
                                                    for subName, subVal in pairs(itemVal) do
                                                        print("      " .. tostring(subName) .. " = " .. tostring(subVal))
                                                    end
                                                else
                                                    print("    " .. tostring(itemName) .. " = " .. tostring(itemVal))
                                                end
                                            end
                                        end
                                    end
                                end
                            end
                            local fw = GetFramework()
                            if fw and fw.Shared and fw.Shared.Gachas then
                                print("Gachas shared config:")
                                for idx, gData in pairs(fw.Shared.Gachas) do
                                    print("  Gacha ID: " .. tostring(idx) .. ", Name: " .. tostring(gData.Name))
                                    for propKey, propVal in pairs(gData) do
                                        if type(propVal) ~= "table" then
                                            print("    " .. tostring(propKey) .. " = " .. tostring(propVal))
                                        end
                                    end
                                end
                            end
                            print("------ NEBUBLOX DIAGNOSTIC END ------")
                        end)
                    end)
                end

                pcall(function()
                    for name, _ in pairs(state.Toggles) do
                        UpdateGachaButtonVisuals(name)
                    end
                end)
            end
        end)

        local function CollectStoreItems()
            pcall(function() FireServer("General", "Store", "Claim_Free") end)
        end

        local function InstantHatch(starName)
            local worldIndices = {
                ["Leaf Star"] = 1, ["Dragon Star"] = 2, ["Pirate Star"] = 3,
                ["Slayer Star"] = 4, ["Solo Star"] = 5, ["Hollow Star"] = 6,
                ["Z Star"] = 7, ["Cursed Star"] = 8
            }
            local teleportMap = {
                ["Leaf Star"] = "Leaf Village", ["Dragon Star"] = "Dragon Town",
                ["Pirate Star"] = "Pirate Island", ["Slayer Star"] = "Slayer Village",
                ["Solo Star"] = "Solo City", ["Hollow Star"] = "Hollow City",
                ["Z Star"] = "Z City", ["Cursed Star"] = "Cursed Academy"
            }
            local index = worldIndices[starName]
            local teleportTarget = teleportMap[starName]
            
            if index and teleportTarget then
                state.SelectedStar = starName
                state.Teleporting = false
                state.AutoHatch = true
                
                FireServer("General", "Star", "Open", index)
                FireServer("General", "SummonController", "Summon", true, index)
                FireServer("General", "StarController", "Summon", true, index)
            end
        end

local function TeleportWithPause(callback)
    task.spawn(function()
        local wasFarming = state.Farm
        state.Farm = false
        state.Teleporting = true
        
        currentScannedTypes = {["None"] = true}
        CharacterCache.Char = nil
        CharacterCache.HRP = nil
        CharacterCache.Hum = nil

        pcall(callback)
        
        task.wait(3.5)
        
        local char = player.Character
        if not char or not char:FindFirstChild("HumanoidRootPart") then
            player.CharacterAdded:Wait()
            task.wait(1.5) 
        end

        PerformScan(true)

        state.Farm = wasFarming
        state.Teleporting = false
    end)
end

        local function Teleport(world)
            TeleportWithPause(function()
                local remote = ReplicatedStorage.Remotes:FindFirstChild("TeleportWorld")
                if remote then 
                    local worlds = {["Leaf Village"] = 1, ["Dragon Town"] = 2, ["Pirate Island"] = 3, ["Slayer Village"] = 4, ["Solo City"] = 5, ["Hollow Island"] = 6, ["DungeonLobby"] = "DungeonLobby"}
                    remote:FireServer(worlds[world] or world)
                else
                    FireServer("General", "Teleport", "Teleport", world)
                end
            end)
        end

        local lastToggleState = {}
        local function AddIconToggle(column, config, activeColor)
            local originalCallback = config.Callback
            config.Color = activeColor
            local key = config.Name
            lastToggleState[key] = config.Default or false
            local toggleObj
            config.Callback = function(v)
                if originalCallback then pcall(originalCallback, v) end
                pcall(function()
                    if toggleObj and toggleObj.Frame then
                        local targetBG = v and Color3.fromRGB(15, 30, 40) or Color3.fromRGB(5, 15, 20)
                        local targetTrans = v and 0.5 or 0.8
                        toggleObj.Frame.BackgroundColor3 = targetBG
                        toggleObj.Frame.BackgroundTransparency = targetTrans
                    end
                end)
                lastToggleState[key] = v
            end
            toggleObj = column:AddToggle(config)
            pcall(function()
                local track = toggleObj.Frame:FindFirstChild("Track")
                if track then track.Visible = false end
                local textLabel = toggleObj.Frame:FindFirstChild("TextLabel")
                if textLabel then textLabel.Visible = false end
                local icon = toggleObj.Frame:FindFirstChild("Icon") or toggleObj.Frame:FindFirstChild("IconEmoji")
                if icon then
                    icon.Position = UDim2.new(0.5, 0, 0.5, 0)
                    icon.AnchorPoint = Vector2.new(0.5, 0.5)
                end
            end)
            task.spawn(function()
                task.wait(0.05)
                if toggleObj and toggleObj.Frame then
                    local isON = toggleObj:Get()
                    local targetBG = isON and Color3.fromRGB(15, 30, 40) or Color3.fromRGB(5, 15, 20)
                    local targetTrans = isON and 0.5 or 0.8
                    pcall(function() toggleObj.Frame.BackgroundColor3 = targetBG; toggleObj.Frame.BackgroundTransparency = targetTrans end)
                end
            end)
            return toggleObj
        end

        local function AddGachaToggle(tab, config, activeColor)
            local originalCallback = config.Callback
            config.Color = activeColor
            local key = GachaNameToKey[config.Name] or config.Name
            lastToggleState[key] = config.Default or false
            local toggleObj
            config.Callback = function(v)
                if v then
                    local gachaIdx = ResolveGachaIndex(key)
                    if gachaIdx and CheckGachaSecret(gachaIdx) then
                        state["Auto" .. key .. "Roll"] = false
                        if toggleObj then toggleObj:Set(false) end
                        pcall(function() Window:Notify({Title = "GACHA", Content = "Secret equipped! Auto Roll not allowed.", Type = "warning"}) end)
                        return
                    end
                end
                if originalCallback then pcall(originalCallback, v) end
                if lastToggleState[key] ~= v then
                    lastToggleState[key] = v
                    pcall(function() UpdateGachaButtonVisuals(config.Name) end)
                end
            end
            toggleObj = tab:AddToggle(config)
            return toggleObj
        end

        -- Creates a row whose frame is shrunk & centered so buttons are packed tight together
        local function AddCompactRow(section, numCols, optBtnSize, optPadding)
            local cols = section:AddRow({Columns = numCols})
            task.spawn(function()
                task.wait(0.05)
                pcall(function()
                    local rowFrame = cols[1] and cols[1].Frame and cols[1].Frame.Parent
                    if not rowFrame then return end
                    local btnSize = optBtnSize or 60
                    local padding = optPadding or 0
                    rowFrame.Size = UDim2.new(1, 0, 0, 0)
                    rowFrame.AutomaticSize = Enum.AutomaticSize.Y
                    
                    local listLayout = rowFrame:FindFirstChildOfClass("UIListLayout")
                    if listLayout then
                        listLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
                        if padding > 0 then
                            listLayout.Padding = UDim.new(0, padding)
                        end
                    end
                    
                    for _, col in ipairs(cols) do
                        if col.Frame then
                            col.Frame.Size = UDim2.new(0, btnSize, 0, 0)
                            col.Frame.AutomaticSize = Enum.AutomaticSize.Y
                        end
                    end
                end)
            end)
            return cols
        end

        -- WORLD 1: LEAF VILLAGE
        WorldsTab:AddBanner({
            Title = "LEAF VILLAGE", 
            Image = "rbxassetid://137515547119181", 
            Color = Color3.fromRGB(0, 230, 255),
            Callback = function() Teleport("Leaf Village") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Leaf Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(0, 230, 255))
        state.Toggles.Clans = AddGachaToggle(WorldsTab, {Name = "Clans", Icon = "rbxassetid://79206141217919", Scale = 1.2, Default = state.AutoClansRoll, Callback = function(v) state.AutoClansRoll = v end}, Color3.fromRGB(0, 230, 255))
        state.Toggles.Kekkei = AddGachaToggle(WorldsTab, {Name = "Kekkei Genkai", Icon = "rbxassetid://117295243285096", Scale = 1.2, Default = state.AutoKekkeiRoll, Callback = function(v) state.AutoKekkeiRoll = v end}, Color3.fromRGB(0, 230, 255))
        state.Toggles.Elements = AddGachaToggle(WorldsTab, {Name = "Elements", Icon = "rbxassetid://105675446512753", Scale = 1.2, Default = state.AutoElementsRoll, Callback = function(v) state.AutoElementsRoll = v end}, Color3.fromRGB(0, 230, 255))

        -- WORLD 2: DRAGON TOWN
        WorldsTab:AddBanner({
            Title = "DRAGON TOWN", 
            Image = "rbxassetid://116378798469077", 
            Color = Color3.fromRGB(255, 30, 60),
            Callback = function() Teleport("Dragon Town") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Dragon Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(255, 30, 60))
        state.Toggles.Races = AddGachaToggle(WorldsTab, {Name = "Races", Icon = "rbxassetid://101312726711773", Scale = 1.2, Default = state.AutoRacesRoll, Callback = function(v) state.AutoRacesRoll = v end}, Color3.fromRGB(255, 30, 60))
        state.Toggles.Ki = AddGachaToggle(WorldsTab, {Name = "Ki", Icon = "rbxassetid://117635429060388", Scale = 1.2, Default = state.AutoKiRoll, Callback = function(v) state.AutoKiRoll = v end}, Color3.fromRGB(255, 30, 60))
        state.Toggles.ZCapsule = AddGachaToggle(WorldsTab, {Name = "Z Capsule", Icon = "rbxassetid://70893493500096", Scale = 1.2, Default = state.AutoZCapsuleRoll, Callback = function(v) state.AutoZCapsuleRoll = v end}, Color3.fromRGB(255, 30, 60))
        state.Toggles.Transformations = AddGachaToggle(WorldsTab, {Name = "Transformations", Icon = "rbxassetid://119104172153111", Scale = 1.2, Default = state.AutoTransformationsRoll, Callback = function(v) state.AutoTransformationsRoll = v end}, Color3.fromRGB(255, 30, 60))


        -- WORLD 3: PIRATE ISLAND
        WorldsTab:AddBanner({
            Title = "PIRATE ISLAND", 
            Image = "rbxassetid://111364058523000", 
            Color = Color3.fromRGB(255, 200, 0),
            Callback = function() Teleport("Pirate Island") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Pirate Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(255, 200, 0))
        state.Toggles.Haki = AddGachaToggle(WorldsTab, {Name = "Haki", Icon = "rbxassetid://130141035541433", Scale = 1.2, Default = state.AutoHakiRoll, Callback = function(v) state.AutoHakiRoll = v end}, Color3.fromRGB(255, 200, 0))
        state.Toggles.Fruits = AddGachaToggle(WorldsTab, {Name = "Fruits", Icon = "rbxassetid://129379991897111", Scale = 1.2, Default = state.AutoFruitsRoll, Callback = function(v) state.AutoFruitsRoll = v end}, Color3.fromRGB(255, 200, 0))

        -- WORLD 4: SLAYER VILLAGE
        WorldsTab:AddBanner({
            Title = "SLAYER VILLAGE", 
            Image = "rbxassetid://115231842423898", 
            Color = Color3.fromRGB(255, 0, 100),
            Callback = function() Teleport("Slayer Village") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Slayer Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(255, 0, 100))
        state.Toggles.Breathings = AddGachaToggle(WorldsTab, {Name = "Breathings", Icon = "rbxassetid://106248355866318", Scale = 1.2, Default = state.AutoBreathingsRoll, Callback = function(v) state.AutoBreathingsRoll = v end}, Color3.fromRGB(255, 0, 100))
        state.Toggles.DemonArts = AddGachaToggle(WorldsTab, {Name = "Demon Arts", Icon = "rbxassetid://116250207503412", Scale = 1.2, Default = state.AutoDemonArtsRoll, Callback = function(v) state.AutoDemonArtsRoll = v end}, Color3.fromRGB(255, 0, 100))

        -- WORLD 5: SOLO CITY
        WorldsTab:AddBanner({
            Title = "SOLO CITY", 
            Image = "rbxassetid://123990541518169", 
            Color = Color3.fromRGB(150, 0, 255),
            Callback = function() Teleport("Solo City") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Solo Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(150, 0, 255))
        state.Toggles.Ranks = AddGachaToggle(WorldsTab, {Name = "Ranks", Icon = "rbxassetid://103894774296487", Scale = 1.2, Default = state.AutoRanksRoll, Callback = function(v) state.AutoRanksRoll = v end}, Color3.fromRGB(150, 0, 255))
        state.Toggles.Quincy = AddGachaToggle(WorldsTab, {Name = "Shadows", Icon = "rbxassetid://78405166477276", Scale = 1.2, Default = state.AutoQuincyRoll, Callback = function(v) state.AutoQuincyRoll = v end}, Color3.fromRGB(150, 0, 255))

        -- WORLD 6: HOLLOW ISLAND
        WorldsTab:AddBanner({
            Title = "HOLLOW ISLAND", 
            Image = "rbxassetid://125651183404680", 
            Color = Color3.fromRGB(180, 0, 255),
            Callback = function() Teleport("Hollow Island") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Hollow Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(180, 0, 255))
        state.Toggles.Bankais = AddGachaToggle(WorldsTab, {Name = "Bankais", Icon = "rbxassetid://92233186549146", Scale = 1.2, Default = state.AutoBankaisRoll, Callback = function(v) state.AutoBankaisRoll = v end}, Color3.fromRGB(180, 0, 255))
        state.Toggles.LosEspadas = AddGachaToggle(WorldsTab, {Name = "Los Espadas", Icon = "rbxassetid://103867631735069", Scale = 1.2, Default = state.AutoLosEspadasRoll, Callback = function(v) state.AutoLosEspadasRoll = v end}, Color3.fromRGB(180, 0, 255))
        state.Toggles.Shikais = AddGachaToggle(WorldsTab, {Name = "Shikais", Icon = "rbxassetid://79632228052466", Scale = 1.2, Default = state.AutoShikaisRoll, Callback = function(v) state.AutoShikaisRoll = v end}, Color3.fromRGB(180, 0, 255))
        state.Toggles.Auras = AddGachaToggle(WorldsTab, {Name = "Auras", Icon = "rbxassetid://131626643424139", Scale = 1.2, Default = state.AutoAurasRoll, Callback = function(v) state.AutoAurasRoll = v end}, Color3.fromRGB(180, 0, 255))

        -- WORLD 7: Z CITY
        WorldsTab:AddBanner({
            Title = "Z CITY", 
            Image = "rbxassetid://139170660316598", 
            Color = Color3.fromRGB(255, 165, 0),
            Callback = function() Teleport("Z City") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Z Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(255, 165, 0))
        state.Toggles.HeroesClass = AddGachaToggle(WorldsTab, {Name = "Heroes Class", Icon = "rbxassetid://138654742879590", Scale = 1.2, Default = state.AutoHeroesClassRoll, Callback = function(v) state.AutoHeroesClassRoll = v end}, Color3.fromRGB(255, 165, 0))
        state.Toggles.Rank = AddGachaToggle(WorldsTab, {Name = "Rank", Icon = "rbxassetid://99452952484783", Scale = 1.2, Default = state.AutoRankRoll, Callback = function(v) state.AutoRankRoll = v end}, Color3.fromRGB(255, 165, 0))

        -- WORLD 8: CURSED ACADEMY
        WorldsTab:AddBanner({
            Title = "CURSED ACADEMY", 
            Image = "rbxassetid://101201552285721", 
            Color = Color3.fromRGB(0, 200, 120),
            Callback = function() Teleport("Cursed Academy") end
        })
        AddGachaToggle(WorldsTab, {
            Name = "Hatch", Icon = "rbxassetid://78290838375298", Default = false, Scale = 1.2,
            Callback = function(v) if v then InstantHatch("Cursed Star") else state.AutoHatch = false; FireServer("General", "AntiAfk", "Auto_Summon", false) end end
        }, Color3.fromRGB(0, 200, 120))
        state.Toggles.ShinyMachine = AddGachaToggle(WorldsTab, {Name = "ShinyMachine", Icon = "rbxassetid://118854643785344", Scale = 1.2, Default = state.AutoShinyMachineRoll, Callback = function(v) state.AutoShinyMachineRoll = v end}, Color3.fromRGB(0, 200, 120))
        state.Toggles.SorcererGrade = AddGachaToggle(WorldsTab, {Name = "Sorcerer Grade", Icon = "rbxassetid://133314174384557", Scale = 1.2, Default = state.AutoSorcererGradeRoll, Callback = function(v) state.AutoSorcererGradeRoll = v end}, Color3.fromRGB(0, 200, 120))
        state.Toggles.InnateTechniques = AddGachaToggle(WorldsTab, {Name = "Innate Techniques", Icon = "rbxassetid://78540511924619", Scale = 1.2, Default = state.AutoInnateTechniquesRoll, Callback = function(v) state.AutoInnateTechniquesRoll = v end}, Color3.fromRGB(0, 200, 120))

        -- ARTIFACTS
        local ArtSec = ArtifactTab:AddSection({Name = "<b><font color='#00E6FF'>ARTIFACT AUTOMATION</font></b>", Icon = "rbxassetid://138006141373527", IconSize = 24})
        
        local artUpRow = ArtSec:AddRow({Columns = 2})
        artUpRow[1]:AddButton({
            Name = "<b><font color='#00FF00'>Upgrade Slot 1</font></b>",
            Callback = function() FireServer("General", "Artifacts", "Upgrade", 1) end
        })

        artUpRow[2]:AddButton({
            Name = "<b><font color='#00FF00'>Upgrade Slot 2</font></b>",
            Callback = function() FireServer("General", "Artifacts", "Upgrade", 2) end
        })

        ArtSec:AddDivider()

        local ArtEquipSec = ArtifactTab:AddSection({Name = "<b><font color='#FFD700'>QUICK EQUIP</font></b>", Icon = "rbxassetid://138006141373527", IconSize = 24})
        local artList = {"Damage", "Luck", "Drops", "Coins", "Stars", "Exp", "Fighters", "Passive"}
        
        local artRow1 = ArtEquipSec:AddRow({Columns = 2})
        artRow1[1]:AddDropdown({
            Name = "Slot 1 Artifact",
            Options = artList,
            Default = "Damage",
            Callback = function(v) 
                local idx = table.find(artList, v)
                if idx then FireServer("General", "Artifacts", "Equip", idx, 1) end
            end
        })

        artRow1[2]:AddDropdown({
            Name = "Slot 2 Artifact",
            Options = artList,
            Default = "Luck",
            Callback = function(v) 
                local idx = table.find(artList, v)
                if idx then FireServer("General", "Artifacts", "Equip", idx, 2) end
            end
        })

        -- Background Loop for Artifacts
        task.spawn(function()
            while task.wait(1) do
                if not state.Nebublox_Running then break end
                
                if state.AutoUpgradeSlot1 then
                    FireServer("General", "Artifacts", "Upgrade", 1)
                end
                
                if state.AutoUpgradeSlot2 then
                    FireServer("General", "Artifacts", "Upgrade", 2)
                end
            end
        end)

        -- TRIAL
        GamemodesTab:AddToggle({
            Name = "<b><font size='26'>LOBBY</font></b>",
            Icon = "rbxassetid://115885479382953",
            Banner = true, Scale = 2,
            Callback = function(v) if v then TeleportWithPause(function() FireServer("General", "Teleport", "Teleport", "Lobby") end) end end
        })

        local GamemodesAutoSec = GamemodesTab:AddSection({Icon = "rbxassetid://107020094020175", Scale = 1.2, Name = "<b><font color='#FFFFFF'>TRIALS</font></b>"})
        local topRow = GamemodesAutoSec:AddRow({Columns = 3})
        topRow[1]:AddToggle({Name = "Easy Trial", Default = state.AutoTrial1, Callback = function(v) state.AutoTrial1 = v end})
        topRow[2]:AddToggle({Name = "Med Trial", Default = state.AutoTrial2, Callback = function(v) state.AutoTrial2 = v end})
        topRow[3]:AddToggle({Name = "Hard Trial", Default = state.AutoTrial3, Callback = function(v) state.AutoTrial3 = v end})
        
        local bottomRow = GamemodesAutoSec:AddRow({Columns = 2})
        bottomRow[1]:AddInput({Placeholder = "Leave Wave", Default = tostring(state.LeaveWave or 50), Callback = function(v) state.LeaveWave = tonumber(v) or 0 end})
        bottomRow[2]:AddToggle({Name = "Auto Return", Default = state.AutoReturn, Callback = function(v) 
            state.AutoReturn = v 
            if v then
                local hrp = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
                if hrp then 
                    state.SavedPosition = hrp.CFrame
                    pcall(function() Window:Notify({Title = "Pos Saved", Content = "Current coordinates saved for Auto Return.", Type = "success"}) end)
                end
            end
        end})
local towerSection = GamemodesTab:AddSection({Name = "<b><font color='#FFFFFF'>TOWER</font></b>"})

local towerTopRow = towerSection:AddRow({Columns = 2})
towerTopRow[1]:AddToggle({Name = "<b><font color='#FFFFFF'>TOWER</font></b>", Icon = "🏯", Callback = function(v) 
    state.AutoEnterTower = v
    if v then 
        TeleportWithPause(function() FireServer("General", "Teleport", "Teleport", "Tower") end) 
    end 
end})

local towerBottomRow = towerSection:AddRow({Columns = 2})
towerBottomRow[1]:AddInput({Placeholder = "Leave at Wave", Default = tostring(state.LeaveWave or 50), Callback = function(v) 
    state.LeaveWave = tonumber(v) or 0 
end})

towerBottomRow[2]:AddToggle({Name = "Auto Return", Default = state.AutoReturn, Callback = function(v) 
    state.AutoReturn = v 
    if v then
        local hrp = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
        if hrp then 
            state.SavedPosition = hrp.CFrame
            pcall(function() 
                Window:Notify({Title = "Pos Saved", Content = "Current coordinates saved for Auto Return.", Type = "success"}) 
            end)
        end
    end
end})
        
        -- AUTOMATION (Relocated to Combat)
        local QuestSec = CombatTab:AddSection({Name = "<b>Automation & Utilities</b>"})
        local utilRow = QuestSec:AddRow({Columns = 2})
        
        utilRow[1]:AddButton({
            Name = "<font color='rgb(255, 0, 0)'><b>REDEEM CODES</b></font>", 
            Icon = "rbxassetid://134633670119404", 
            Callback = function() 
                for _, code in pairs(promoCodes) do 
                    FireServer("General", "Codes", "Redeem", code) 
                    task.wait(0.1) 
                end 
                Window:Notify({Title = "Codes", Content = "Finished redeeming all promo codes.", Type = "success"})
            end
        })

        utilRow[2]:AddToggle({
            Name = "<b><font color='#FFFF00'>COLLECT CHESTS</font></b>",
            Icon = "rbxassetid://112238976309873",
            Default = state.AutoCollectChests,
            Callback = function(v) state.AutoCollectChests = v end
        })

        local PotionSec = CombatTab:AddSection({Name = "<b><font color='#FFAA00'>Auto Potions</font></b>"})
        local potRow1 = AddCompactRow(PotionSec, 3, 90, 30)
        AddIconToggle(potRow1[1], {Name = "Damage", Icon = "rbxassetid://132388920999229", Default = state.AutoDamagePotion, Callback = function(v) state.AutoDamagePotion = v end}, Color3.fromRGB(255, 170, 0))
        AddIconToggle(potRow1[2], {Name = "Luck", Icon = "rbxassetid://75206119348092", Default = state.AutoLuckPotion, Callback = function(v) state.AutoLuckPotion = v end}, Color3.fromRGB(255, 170, 0))
        AddIconToggle(potRow1[3], {Name = "Gacha Luck", Icon = "rbxassetid://86669265587435", Default = state.AutoGachaLuckPotion, Callback = function(v) state.AutoGachaLuckPotion = v end}, Color3.fromRGB(255, 170, 0))
        
        local potRow2 = AddCompactRow(PotionSec, 3, 90, 30)
        AddIconToggle(potRow2[1], {Name = "Coins", Icon = "rbxassetid://102656577976109", Default = state.AutoCoinsPotion, Callback = function(v) state.AutoCoinsPotion = v end}, Color3.fromRGB(255, 170, 0))
        AddIconToggle(potRow2[2], {Name = "Drops", Icon = "rbxassetid://110887034515663", Default = state.AutoDropsPotion, Callback = function(v) state.AutoDropsPotion = v end}, Color3.fromRGB(255, 170, 0))
        AddIconToggle(potRow2[3], {Name = "Exp", Icon = "rbxassetid://90949980223915", Default = state.AutoExpPotion, Callback = function(v) state.AutoExpPotion = v end}, Color3.fromRGB(255, 170, 0))
 
        state.AntiAfk = true

        -- LOOPS (Restored Background Automation)
        local function GetGachaIndex(name)
            local fw = GetFramework()
            if not fw or not fw.Shared or not fw.Shared.Gachas then return nil end
            for i, gacha in pairs(fw.Shared.Gachas) do if gacha.Name:lower():find(name:lower()) then return i end end
            return nil
        end

        task.spawn(function()
            local fw = GetFramework()
            if fw then
                local waitStart = tick()
                while not (fw.Shared and fw.Shared.Gachas) and (tick() - waitStart < 30) do
                    task.wait(1)
                end
            end

            local gachaMap = {}
            local function usePotionIfNeeded(potionName)
                if latestPlayerData then
                    if latestPlayerData.Inventory and latestPlayerData.Inventory.Potion then
                        local count = latestPlayerData.Inventory.Potion[potionName]
                        if count and tonumber(count) > 0 then
                            FireServer("General", "Potions", "Use", potionName)
                        end
                    end
                end
            end

            -- Fast Potion Spammer
            task.spawn(function()
                while task.wait() do
                    if not state.Nebublox_Running then break end
                    if state.AutoDamagePotion then usePotionIfNeeded("DamagePotion") end
                    if state.AutoLuckPotion then usePotionIfNeeded("LuckPotion") end
                    if state.AutoGachaLuckPotion then usePotionIfNeeded("GachaLuckPotion") end
                    if state.AutoCoinsPotion then usePotionIfNeeded("CoinsPotion") end
                    if state.AutoDropsPotion then usePotionIfNeeded("DropsPotion") end
                    if state.AutoExpPotion then usePotionIfNeeded("ExpPotion") end
                    task.wait(0.05) -- Very fast spam
                end
            end)

            local function GetInventoryItemCount(itemName)
                local fw = GetFramework()
                local data = latestPlayerData or (fw and fw.Data)
                if not data or not data.Inventory then return 0 end
                
                -- Check category cache first for O(1) retrieval
                local cachedCat = currencyCategoryCache[itemName]
                if cachedCat then
                    local catData = data.Inventory[cachedCat]
                    if type(catData) == "table" then
                        if catData[itemName] then
                            return tonumber(catData[itemName]) or 0
                        end
                        for subName, subVal in pairs(catData) do
                            if type(subVal) == "table" and subVal[itemName] then
                                return tonumber(subVal[itemName]) or 0
                            end
                        end
                    elseif catData == itemName then
                        return tonumber(catData) or 0
                    end
                end
                
                -- Dynamic fallback lookup
                for catName, catData in pairs(data.Inventory) do
                    if type(catData) == "table" then
                        if catData[itemName] then
                            currencyCategoryCache[itemName] = catName
                            return tonumber(catData[itemName]) or 0
                        end
                        for subName, subVal in pairs(catData) do
                            if type(subVal) == "table" and subVal[itemName] then
                                currencyCategoryCache[itemName] = catName
                                return tonumber(subVal[itemName]) or 0
                            end
                        end
                    elseif catName == itemName then
                        currencyCategoryCache[itemName] = catName
                        return tonumber(catData) or 0
                    end
                end
                return 0
            end

            local function HandleRoll(toggleName)
                local gachaIdx = ResolveGachaIndex(toggleName)
                if state["Auto" .. toggleName .. "Roll"] and gachaIdx then
                    if sharedGachas and sharedGachas[gachaIdx] then
                        local gData = sharedGachas[gachaIdx]
                        if gData.Currency then
                            local lastCheck = lastCostCheck[toggleName] or 0
                            if tick() - lastCheck > 0.5 then
                                lastCostCheck[toggleName] = tick()
                                local cost = gData.Cost or 1
                                local count = GetInventoryItemCount(gData.Currency)
                                if count < cost then
                                    state["Auto" .. toggleName .. "Roll"] = false
                                    local toggle = state.Toggles[toggleName]
                                    if toggle then toggle:Set(false) end
                                    pcall(function()
                                        Window:Notify({
                                            Title = "GACHA LIMIT",
                                            Content = string.format("Out of %s for %s! Stopping auto-roll.", gData.Currency, toggleName),
                                            Type = "warning"
                                        })
                                    end)
                                    return
                                end
                            end
                        end
                    end

                    if CheckGachaSecret(gachaIdx) then
                        state["Auto" .. toggleName .. "Roll"] = false
                        local toggle = state.Toggles[toggleName]
                        if toggle then toggle:Set(false) end
                        pcall(function() Window:Notify({Title = "GACHA", Content = "Secret obtained in " .. toggleName .. "! Stopping...", Type = "success"}) end)
                    else
                        FireServer("General", "GachaController", "Reroll", gachaIdx)
                    end
                end
            end

            -- Dedicated Fast Gacha Roll Loop (0.08s)
            task.spawn(function()
                while task.wait(0.08) do
                    if not state.Nebublox_Running then break end
                    HandleRoll("Clans"); HandleRoll("Kekkei")
                    HandleRoll("Races"); HandleRoll("Ki")
                    HandleRoll("ZCapsule"); HandleRoll("Transformations")
                    HandleRoll("Fruits"); HandleRoll("Haki")
                    HandleRoll("Breathings"); HandleRoll("DemonArts")
                    HandleRoll("Ranks"); HandleRoll("Auras")
                    HandleRoll("Bankais"); HandleRoll("Shadows")
                    HandleRoll("Shikais"); HandleRoll("LosEspadas")
                    HandleRoll("Elements")
                    HandleRoll("Rank"); HandleRoll("HeroesClass")
                    HandleRoll("ShinyMachine"); HandleRoll("SorcererGrade"); HandleRoll("InnateTechniques")
                end
            end)

            while task.wait(0.4) do
                if not state.Nebublox_Running then break end
                
                -- AUTO POTIONS (Moved to dedicated fast loop)

                -- CONTINUOUS AUTO HATCH
                if state.AutoHatch and state.SelectedStar and not state.HatchLoopActive then
                    state.HatchLoopActive = true
                    local worldIndices = {
                        ["Leaf Star"] = 1, ["Dragon Star"] = 2, ["Pirate Star"] = 3,
                        ["Slayer Star"] = 4, ["Solo Star"] = 5, ["Hollow Star"] = 6,
                        ["Z Star"] = 7, ["Cursed Star"] = 8
                    }
                    task.spawn(function()
                        while state.AutoHatch and state.Nebublox_Running do
                            local idx = worldIndices[state.SelectedStar]
                            if idx then
                                pcall(function() FireServer("General", "Star", "Open", idx) end)
                                pcall(function() FireServer("General", "SummonController", "Summon", true, idx) end)
                            end
                            task.wait(0.05)
                        end
                        state.HatchLoopActive = false
                    end)
                end

                if state.AutoHatch and tick() % 2 < 1 then
                    local worldIndices = {["Leaf Star"] = 1, ["Dragon Star"] = 2, ["Pirate Star"] = 3, ["Slayer Star"] = 4, ["Solo Star"] = 5, ["Hollow Star"] = 6, ["Z Star"] = 7, ["Cursed Star"] = 8}
                    local index = worldIndices[state.SelectedStar or "Leaf Star"]
                    if index and CheckGachaSecret(index) then
                        state.AutoHatch = false
                        FireServer("General", "AntiAfk", "Auto_Summon", false)
                        pcall(function() Window:Notify({Title = "STAR", Content = "Secret obtained! Hatching stopped.", Type = "success"}) end)
                    end
                end
            end
        end)

        task.spawn(function()
            while task.wait(5) do
                if not state.Nebublox_Running then break end
                pcall(function()
                    local fw = GetFramework()
                    local now = DateTime.now():ToUniversalTime()
                    local day = now.Day
                    if fw and fw.Data and fw.Data.Chests then
                        if fw.Data.Chests.Daily ~= day then FireServer("General", "Chests", "Claim", "Daily") end
                        if fw.Data.Chests.Group ~= day then FireServer("General", "Chests", "Claim", "Group") end
                        if fw.Data.Chests.VIP ~= day then FireServer("General", "Chests", "Claim", "VIP") end
                        if fw.Data.Chests.Time ~= day then FireServer("General", "Chests", "Claim", "Time") end
                        if fw.Shared and fw.Shared.TimeRewards and fw.Data.TimeRewards then
                            for i = 1, 8 do
                                local reward = fw.Shared.TimeRewards[i]
                                local claimed = fw.Data.TimeRewards.Claimed["Reward" .. i]
                                local playtime = fw.Data.TimeRewards.PlayTime
                                if reward and not claimed and playtime >= reward.Time then
                                    FireServer("General", "TimeRewards", "Claim", i)
                                end
                            end
                        end
                    else
                        for _, c in ipairs({"Daily", "Time", "Group", "VIP"}) do FireServer("General", "Chests", "Claim", c) end
                    end
                end)
                -- AUTO COLLECT CHESTS via ProximityPrompt
                if state.AutoCollectChests then
                    pcall(function()
                        local chestNames = {"Daily", "Group", "Time", "VIP"}
                        for _, name in ipairs(chestNames) do
                            pcall(function()
                                local prompt = Workspace.Server.Chests[name].main.Prompt
                                if prompt then fireproximityprompt(prompt) end
                            end)
                        end
                    end)
                end
                if state.AutoClaim then CollectStoreItems() end

-- ==========================================
-- GAMEMODES & AUTO RETURN FIX
-- ==========================================
local wantsTrial = state.AutoTrial1 or state.AutoTrial2 or state.AutoTrial3
local wantsTower = state.AutoEnterTower
local doingGamemode = wantsTrial or wantsTower

-- 1. Detect if we are ALREADY inside the gamemode to prevent spamming 'Join'
local inTrial = false
local inTower = false
pcall(function()
    local fw = GetFramework()
    if fw and fw.Data then
        if fw.Data.Trial and type(fw.Data.Trial) == "table" and fw.Data.Trial.Wave then inTrial = true end
        if fw.Data.Tower and type(fw.Data.Tower) == "table" and fw.Data.Tower.Wave then inTower = true end
    end
end)

-- Trials Automation (Only joins if you aren't already in it)
if wantsTrial and IsAtLobby() and not state.Teleporting and not inTrial then
    TeleportWithPause(function()
        if state.AutoTrial1 then FireServer("Gamemodes", "Trial", "Join", 1) end
        if state.AutoTrial2 then FireServer("Gamemodes", "Trial", "Join", 2) end
        if state.AutoTrial3 then FireServer("Gamemodes", "Trial", "Join", 3) end
    end)
end

-- Tower Automation (Only joins if you aren't already in it)
if wantsTower and IsAtLobby() and not state.Teleporting and not inTower then
    TeleportWithPause(function()
        FireServer("Gamemodes", "Tower", "Create", "Single")
    end)
end

-- Auto Return (DISABLED while you are actively trying to do a Gamemode)
if state.AutoReturn and state.SavedPosition and not IsAtLobby() and not state.Teleporting and not doingGamemode then
    local hrp = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
    if hrp and (hrp.Position - state.SavedPosition.Position).Magnitude > 20 then
        if state.SavedPosition.Position.Magnitude > 10 then
            local oldFarm = state.Farm
            state.Farm = false
            state.Teleporting = true
            hrp.CFrame = state.SavedPosition
            task.wait(3)
            PerformScan(true)
            state.Farm = oldFarm
            state.Teleporting = false
        end
    end
end

-- Gamemode Leave Logic
pcall(function() 
    local fw = GetFramework()
    if fw and fw.Data and fw.Data.Trial and fw.Data.Trial.Wave >= state.LeaveWave then 
        FireServer("General", "Trial", "Leave") 
    end 
end)
-- ==========================================
            end
        end)

        task.spawn(function()
            local function FormatValue(val)
                if not val then return "0" end
                local num = tonumber(tostring(val):gsub(",", ""):match("[%d%.]+")) or 0
                if num >= 1e33 then return string.format("%.2fDc", num/1e33)
                elseif num >= 1e30 then return string.format("%.2fNo", num/1e30)
                elseif num >= 1e27 then return string.format("%.2fOc", num/1e27)
                elseif num >= 1e24 then return string.format("%.2fSp", num/1e24)
                elseif num >= 1e21 then return string.format("%.2fSx", num/1e21)
                elseif num >= 1e18 then return string.format("%.2fQi", num/1e18)
                elseif num >= 1e15 then return string.format("%.2fQa", num/1e15)
                elseif num >= 1e12 then return string.format("%.2fT", num/1e12)
                elseif num >= 1e9 then return string.format("%.2fB", num/1e9)
                elseif num >= 1e6 then return string.format("%.2fM", num/1e6)
                elseif num >= 1e3 then return string.format("%.2fK", num/1e3)
                end
                return tostring(val)
            end

            while task.wait(1) do
                -- Ensure state exists before checking it
                if not state or not state.Nebublox_Running then break end
                
                local success, err = pcall(function()
                    -- Add safety checks for the GUI
                    local playerGui = player:FindFirstChild("PlayerGui")
                    if not playerGui then return end
                    
                    local ui = playerGui:FindFirstChild("UI")
                    if not ui then return end

                    local hud = ui:FindFirstChild("HUD")
                    if not hud then return end

                    -- Fetch the text (Ensure these paths match the game EXACTLY)
                    local function safeText(root, ...)
                        local obj = root
                        for _, name in ipairs({...}) do
                            if not obj then return nil end
                            obj = obj:FindFirstChild(name)
                        end
                        if obj and (obj:IsA("TextLabel") or obj:IsA("TextBox") or obj:IsA("TextButton")) then
                            return obj.Text
                        end
                        return nil
                    end

                    local function recursiveText(root, name)
                        if not root then return nil end
                        local obj = root:FindFirstChild(name, true)
                        if obj and (obj:IsA("TextLabel") or obj:IsA("TextBox") or obj:IsA("TextButton")) then
                            return obj.Text
                        end
                        if obj then
                            local amt = obj:FindFirstChild("Amount") or obj:FindFirstChild("Text")
                            if amt and (amt:IsA("TextLabel") or amt:IsA("TextBox") or amt:IsA("TextButton")) then
                                return amt.Text
                            end
                        end
                        return nil
                    end

                    local coins = latestPlayerData and latestPlayerData.Coins 
                        or latestPlayerData and latestPlayerData.Stats and latestPlayerData.Stats["Total Coins"]
                        or safeText(hud, "Left", "Coins") 
                        or safeText(hud, "Left", "Coins", "Amount") 
                        or recursiveText(hud, "Coins") 
                        or "0"

                    local dps = latestPlayerData and latestPlayerData.Stats and latestPlayerData.Stats.DPS
                        or safeText(hud, "Left", "DPS", "Frame") 
                        or safeText(hud, "Left", "DPS") 
                        or recursiveText(hud, "DPS") 
                        or "0"

                    local tickets = latestPlayerData and latestPlayerData.Inventory and latestPlayerData.Inventory.Material and latestPlayerData.Inventory.Material.Ticket
                        or safeText(ui, "Frames", "Items", "Frame", "List", "Ticket", "Frame", "Amount")
                        or safeText(ui, "Frames", "Items", "Frame", "List", "Ticket")
                        or recursiveText(ui, "Ticket")
                        or recursiveText(ui, "Tickets")
                        or "0"
                    
                    Window:SetSidebarStats({
                        {Text = "<b>DPS:</b> " .. FormatValue(dps), Icon = "rbxassetid://113164728906904", Color = "0 0.905882 0.470588 0.286275 0 0.27 0.905882 0.470588 0.286275 0 1 0.870588 0.211765 0.211765 0"},
                        {Text = "<b>Coins:</b> " .. FormatValue(coins), Icon = "rbxassetid://135020028858733", Color = "0 1 0.937255 0.615686 0 1 0.827451 0.611765 0.00392157 0"},
                        {Text = "<b>Tickets:</b> " .. FormatValue(tickets), Icon = "rbxassetid://104372268322988", Color = "0 0.0549404 0.919866 0.525194 0 0.1 0.00600419 0.680094 0.813902 0 0.2 0.145758 0.371533 0.98271 0 0.3 0.42082 0.112042 0.967139 0 0.4 0.726126 0.000737229 0.773137 0 0.5 0.94506 0.0801343 0.474806 0 0.6 0.993996 0.319906 0.186098 0 0.7 0.854242 0.628467 0.0172904 0 0.8 0.57918 0.887958 0.0328611 0 0.9 0.273874 0.999263 0.226863 0 1 0.0549404 0.919866 0.525194 0"}
                    })

                    local status = "Idle"
                    if state.Farm then status = "Automating Combat..."
                    elseif state.AutoHatch then status = "Hatching Stars..."
                    elseif state.AutoClansRoll or state.AutoKekkeiRoll or state.AutoRacesRoll then status = "Rolling Gacha..." end
                    
                    Window:SetProfileDesc(status)
                end)

                -- This will tell you exactly WHY it isn't updating
                if not success then
                    warn("[UI Update Loop Error]: " .. tostring(err))
                end
            end
        end)

        -- MASTER FARM LOOP (RAW SPEED + LOGIC FIXES)
        task.spawn(function()
            local function GetTarget()
                local folder = Workspace:FindFirstChild("Client") and Workspace.Client:FindFirstChild("Enemies")
                if not folder then return nil end

                -- HARDCODED: Ignored Dummy here so nothing targets it ever.
                local function isValid(e)
                    local hum = e:FindFirstChildOfClass("Humanoid")
                    return e:IsA("Model") and e.PrimaryPart and hum and hum.Health > 0 and e.Name ~= "Dummy"
                end

                -- 1. Priority Target
                if state.PriorityTargetName and state.PriorityTargetName ~= "None" then
                    if state.PriorityTargetName == "All" then
                        for _, e in pairs(folder:GetChildren()) do if isValid(e) then return e end end
                    else
                        for _, e in pairs(folder:GetChildren()) do
                            if e.Name == state.PriorityTargetName and isValid(e) then
                                return e
                            end
                        end
                    end
                end

                -- 2. Secondary Targets
                if state.SecondaryTargetNames and #state.SecondaryTargetNames > 0 then
                    for _, name in pairs(state.SecondaryTargetNames) do
                        if name == "All" then
                            for _, e in pairs(folder:GetChildren()) do if isValid(e) then return e end end
                        else
                            for _, e in pairs(folder:GetChildren()) do
                                if e.Name == name and isValid(e) then
                                    return e
                                end
                            end
                        end
                    end
                end

                -- 3. Closest Target
                local t, mv = nil, math.huge
                local hrp = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
                if not hrp then return nil end -- Fix: Prevent error if player HRP doesn't exist

                for _, e in pairs(folder:GetChildren()) do
                    if isValid(e) then
                        local d = (hrp.Position - e.PrimaryPart.Position).Magnitude
                        if d < mv then mv = d; t = e end
                    end
                end
                return t
            end

            while task.wait(0.1) do
                if not state.Nebublox_Running then break end
                if not state.Farm or state.Teleporting then continue end

                local target = GetTarget()
                
                if target and target.PrimaryPart and player.Character and player.Character.PrimaryPart then
                    local targetPos = target.PrimaryPart.Position
                    local playerPos = player.Character.PrimaryPart.Position
                    
                    -- Calculate the horizontal distance to the target (ignoring height differences)
                    local diff = Vector3.new(playerPos.X - targetPos.X, 0, playerPos.Z - targetPos.Z)
                    local distance = diff.Magnitude

                    -- THE SWEET SPOT LOGIC:
                    -- Only pivot if we are further than 6 studs (too far) or closer than 2 studs (inside the enemy)
                    if distance > 6 or distance < 2 then
                        local dir
                        if distance == 0 then 
                            dir = Vector3.new(0, 0, 1) 
                        else 
                            dir = diff.Unit 
                        end
                        
                        -- Calculate optimal position: exactly 4 studs away, horizontally
                        local farmPos = targetPos + (dir * 4)
                        
                        -- Maintain the target's Y level so we don't accidentally clip into the ground
                        farmPos = Vector3.new(farmPos.X, targetPos.Y, farmPos.Z)
                        
                        -- Instantly snap to the perfect position, facing the target
                        player.Character:PivotTo(CFrame.new(farmPos, targetPos))
                        
                        -- Reset character velocity so you don't go flying after a teleport
                        local hrp = player.Character:FindFirstChild("HumanoidRootPart")
                        if hrp then
                            hrp.Velocity = Vector3.zero
                            hrp.RotVelocity = Vector3.zero
                        end
                    end

                    -- ---------------------------------------------------------
                    -- Combat Execution (Fires regardless of whether we moved)
                    -- ---------------------------------------------------------
                    local ff = Workspace:FindFirstChild("Server") and Workspace.Server:FindFirstChild("Fighters") and Workspace.Server.Fighters:FindFirstChild(tostring(player.UserId))
                    
                    if ff then
                        for _, f in pairs(ff:GetChildren()) do
                            FireServer("Fighters", "Attack", "Do_Damage", f.Name)
                        end
                        FireServer("Fighters", "Attack", "Interact", "World", target)
                    end
                end
            end
        end)

        player.Idled:Connect(function() if state.AntiAfk then game:GetService("VirtualUser"):CaptureController(); game:GetService("VirtualUser"):ClickButton2(Vector2.new()) end end)
        Window:Notify({Title = "<b><font color='#00E6FF'>ANIME</font> <font color='#FF1E3C'>HEROES</font></b>", Content = "Premium Sidebar v2.9.0 Ready.", Type = "success"})
    end)
end

InitializeApp()
