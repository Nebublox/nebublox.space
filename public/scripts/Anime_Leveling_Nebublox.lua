-- // NEBUBLOX : ANIME LEVELING (v6.1 - Perfected Sync)
local scriptArgs = {getgenv().Nebublox_Key}

-- [ GLOBAL EXECUTOR FAILSAFES ]
local loadst = getgenv().loadstring or loadstring
getgenv().firetouchinterest = getgenv().firetouchinterest or function() end
getgenv().getconnections = getgenv().getconnections or function() return {} end
getgenv().get_signal_cons = getgenv().get_signal_cons or function() return {} end
getgenv().setfpscap = getgenv().setfpscap or function() end
getgenv().cloneref = getgenv().cloneref or function(v) return v end

if not loadst then
    warn("[NEBUBLOX] CRITICAL ERROR: Your executor does not support 'loadstring'. This script requires it to function.")
    return
end

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local VirtualUser = game:GetService("VirtualUser")
local HttpService = game:GetService("HttpService")

local player = Players.LocalPlayer

-- // [ ASSET & PATH CONSTANTS ] //
local WORLD_SPAWNS = {
    ["Planet Namek"]    = "World1.SpawnLocation",
    ["Blackflag Kingdom"] = "World2.SpawnLocation",
    ["Clover Kingdom"]  = "World3.SpawnLocation",
    ["Slayer Town"]     = "World4.SpawnLocation",
    ["Ghoul City"]      = "World5.SpawnLocation",
    ["Wandenreich"]     = "World6.SpawnLocation",
    ["Inferno City"]    = "World7.SpawnLocation",
    ["Sorcerer High"]   = "World8.SpawnLocation",
    ["Double Dungeons"] = "World9.SpawnLocation",
    ["Leaf Village"] = "World10.SpawnLocation",
    ["Shiganzina"] = "World11.SpawnLocation",
    ["Bizzare Town"] = "World12.SpawnLocation"
}

local function CleanupPreviousInstance()
    local stateKeys = {"NebuState_AnimeLeveling", "NebuState", "NebuState_Leveling", "Nebublox_State"}
    for _, key in ipairs(stateKeys) do
        if getgenv()[key] then
            pcall(function() getgenv()[key].Nebublox_Running = false end)
            getgenv()[key] = nil
        end
    end

    if getgenv()._nebuLeveling_connections then
        for _, conn in pairs(getgenv()._nebuLeveling_connections) do
            pcall(function() if typeof(conn) == "RBXScriptConnection" then conn:Disconnect() end end)
        end
    end
    getgenv()._nebuLeveling_connections = {}

    pcall(function()
        local function clearUI(parent)
            for _, v in pairs(parent:GetChildren()) do
                if v.Name == "NebubloxUI" or v.Name == "NebubloxNotifs" or v.Name:find("Nebublox") then
                    v:Destroy()
                end
            end
        end
        clearUI(game:GetService("CoreGui"))
        clearUI(player:WaitForChild("PlayerGui"))
    end)

    getgenv().Nebublox = nil
    task.wait(0.2)
end

CleanupPreviousInstance()

-- State Management 
local function InitializeApp()
    if not getgenv().Nebublox_Verified then 
        warn("[NEBUBLOX] SECURITY ALERT: UNAUTHORIZED STANDALONE EXECUTION.")
        return
    end
    
    local state = getgenv().NebuState_AnimeLeveling
    if state and state.Initialized then return end
    
    -- [ PERSISTENCE LAYER ]
    getgenv().Nebu_Persistence = getgenv().Nebu_Persistence or {}
    local persistence = getgenv().Nebu_Persistence

    getgenv().NebuState_AnimeLeveling = {
        Nebublox_Running = true,
        Farm = persistence.Farm or false, 
        Noclip = true,
        Equip = true,
        PriorityTargetName = "None",
        SecondaryTargetNames = {"All"},
        CurrentTarget = nil,
        IsTeleporting = false,
        ShowRadius = true,
        AutoRewards = true,
        AutoChests = true,
        AutoCodes = true,
        AutoDailyStreak = true,
        PetSyncEnabled = true,
        HideGacha = true,
        AutoRollMask = false,
        AutoUpgradeKagune = false,
        AutoHatch = false,
        HatchDelay = 0.8,
        GachaDelay = 0.1,
        TowerRaid = false,
        TowerLeaveWave = 0,
        TowerRaidMedium = false,
        TowerMediumLeaveWave = 0,
        AutoReturnToSpot = persistence.AutoReturnToSpot or false,
        WisteriaRaid = false,
        WisteriaLeaveWave = 0,
        WisteriaKeys = 0,
        WisteriaMaxWave = 0,
        WisteriaLobbies = {},
        EasterRaid = false,
        EasterRaidLeaveWave = 0,
        WandenreichRaid = false,
        WandenreichLeaveWave = 0,
        WandenreichLobbies = {},
        StatsToTrain = {},
        MainWindow = nil,
        SavedReturnPos = persistence.SavedReturnPos,
        SavedReturnWorld = persistence.SavedReturnWorld,
        LvlCCGRank = false,
        LvlExchangeLeveling = false,
        RollExchangePower = false,
        LvlShinyLeveling = false,
        LvlIgnitionRank = false,
        RollBreathingPower = false,
        LvlBloodArt = false,
        RollGrimoiresPower = false,
        RollHashiraPower = false,
        RollDivisionsPower = false,
        RollManaPower = false,
        RollDemonPower = false,
        RollProsperityPower = false,
        RollEasterPower = false,
        RollSaiyanPower = false,
        RollDragonBallPower = false,
        RollFruitPower = false,
        RollBlessingPower = false,
        LvlHaki = false,
        LvlWisteria = false,
        RollMaskPower = false,
        LvlKagune = false,
        RollRacePower = false,
        RollBankaiPower = false,
        LvlSpiritual = false,
        LvlFinger = false,
        LvlShikigamiRank = false,
        LvlEssenceRank = false,
        RollEasyArtifactPower = false,
        RollMediumArtifactPower = false,
        LvlCursedLeveling = false,
        RollHunterPower = false,
        LvlShadowLeveling = false,
        LvlGateLeveling = false,
        LvlFireLeveling = false,
        LvlLightningLeveling = false,
        LvlWaterLeveling = false,
        LvlNatureLeveling = false,
        LvlShinyTotem = false,
        RollChakraPower = false,
        LvlSerumRank = false,
        RollScoutPower = false,
        RollTitanPower = false,
        RollCellPower = false,
        LvlManipulationRank = false,
        RollPyrokeneticPower = false,
        LvlBountyRank = false,
        LvlHoarderRank = false,
        LvlEnergyTotem = false,
        LvlDamageTotem = false,
        LvlExchangeRank = false,
        AutoPetPower = false,
        TowerOverdrive = false,
        CachedFarmState = false,
        RollStandPower = false,
        LvlRippleLeveling = false,
        StartTime = tick(),
    }







    local state = getgenv().NebuState_AnimeLeveling
    local g = getgenv()

    local function getGradient(text, type)
        local res = ""
        local cols = {"#FFFFFF"}
        
        if type == "Mythical" then
            cols = {"#FF00F2", "#009DFF", "#00FFFF", "#02F900", "#8AFA00", "#FFEE00", "#FFB300", "#FF7700"}
        elseif type == "Secret" then
            cols = {"#FF0004", "#E20004", "#C50003", "#A80003", "#8B0002", "#6F0001", "#520000"}
        elseif type == "Divine" then
            cols = {"#00FFFF", "#55FFFF", "#AAFFFF", "#FFFFFF", "#FFFFAA", "#FFFF55", "#FFFF00"}
        elseif type == "Legendary" then
            cols = {"#FFB300", "#FFCC00", "#FFD700", "#FFE600", "#FFFF00", "#FFE600", "#FFD700", "#FFCC00"}
        elseif type == "Haki" then
            cols = {"#B700FF", "#8A00FF", "#B700FF", "#8A00FF", "#B700FF"}
        elseif type == "Hoarder" then
            cols = {"#0091FF", "#00BFFF", "#0091FF", "#00BFFF", "#0091FF"}
        end
        
        for i = 1, #text do
            local char = text:sub(i, i)
            if char == " " then
                res = res .. " "
            else
                local col = cols[((i - 1) % #cols) + 1]
                res = res .. "<font color='" .. col .. "'>" .. char .. "</font>"
            end
        end
        return res
    end

    local function trackConnection(conn)
        if conn then table.insert(g._nebuLeveling_connections, conn) end
        return conn
    end

    -- ===========================================
    -- SAFE DATA FETCHING ENGINE (CRASH-PROOF)
    -- ===========================================
    local function safeRequire(mod)
        local success, result = pcall(function() return require(mod) end)
        if success then return result end
        return nil
    end

    local function GetPetCount(data)
        if not data then return 0 end
        local count = 0
        local items = data.Items or {}
        for _, item in pairs(items) do
            if item.Type == "Pet" then count = count + 1 end
        end
        if count == 0 and data.Pets then
            for _, _ in pairs(data.Pets) do count = count + 1 end
        end
        return count
    end

    local function GetLiveLevel(data, key)
        if not data then return 0 end
        local cleanKey = key:gsub("Leveling", ""):gsub("Rank", ""):gsub("RankUp", ""):gsub("Power", "")
        
        local val = data[key] or 
                    data[cleanKey] or
                    data[key .. "Level"] or 
                    data[cleanKey .. "Level"] or
                    data[key .. "Rank"] or
                    data[cleanKey .. "Rank"] or
                    (data.Mastery and (data.Mastery[key] or data.Mastery[cleanKey] or data.Mastery[key .. "Level"] or data.Mastery[cleanKey .. "Level"])) or 
                    (data.Progression and (data.Progression[key] or data.Progression[cleanKey] or data.Progression[key .. "Rank"] or data.Progression[cleanKey .. "Rank"])) or
                    (data.Levels and (data.Levels[key] or data.Levels[cleanKey])) or 
                    (data.Masteries and (data.Masteries[key] or data.Masteries[cleanKey])) or
                    (data.Statistics and (data.Statistics[key] or data.Statistics[cleanKey])) or
                    (data.CurrentLevels and (data.CurrentLevels[key] or data.CurrentLevels[cleanKey]))
        
        if type(val) == "table" and (val.Level or val.Rank or val.Value) then
            val = val.Level or val.Rank or val.Value
        end
        
        return tonumber(val) or 0
    end


    local function GetPlayerData()
        -- [ PRIORITY 1: NATIVE OMNI ENGINE ]
        local omni = ReplicatedStorage:FindFirstChild("Omni")
        if omni then
            local success, mod = pcall(function() return require(omni) end)
            if success and mod and mod.Data then return mod.Data end
        end

        -- [ PRIORITY 2: APOLLO CLIENT ENGINE ]
        local apollo = ReplicatedStorage:FindFirstChild("Apollo") or ReplicatedStorage:FindFirstChild("ApolloClient")
        if apollo then
            local success, mod = pcall(function() return require(apollo) end)
            if success and type(mod) == "table" then
                if mod.GetData then return mod.GetData() end
                if mod.GetState then return mod.GetState() end
                if mod.Data then return mod.Data end
                
                -- Recursive sub-module check
                local state = apollo:FindFirstChild("State") or apollo:FindFirstChild("Data") or apollo:FindFirstChild("Store") or apollo:FindFirstChild("Profiles")
                if state and state:IsA("ModuleScript") then
                    local sData = safeRequire(state)
                    if type(sData) == "table" then return sData end
                end
            end
        end

        -- [ PRIORITY 3: PROFILES / STORE ENGINE ]
        local prof = ReplicatedStorage:FindFirstChild("Profiles") or ReplicatedStorage:FindFirstChild("Store") or ReplicatedStorage:FindFirstChild("DataStore")
        if prof and prof:IsA("ModuleScript") then
            local data = safeRequire(prof)
            if type(data) == "table" then 
                if data[player.Name] then return data[player.Name] end
                if data[tostring(player.UserId)] then return data[tostring(player.UserId)] end
                return data 
            end
        end



        -- [ PRIORITY 3: PLAYERDATA MODULE ]
        local playerPath = ReplicatedStorage:FindFirstChild("PlayerData") and ReplicatedStorage.PlayerData:FindFirstChild(tostring(player.UserId))
        if playerPath and playerPath:IsA("ModuleScript") then
            local data = safeRequire(playerPath)
            if type(data) == "table" then return data end
        end

        -- [ PRIORITY 4: CLIENT STATE ]
        local stateMod = ReplicatedStorage:FindFirstChild("Client") and ReplicatedStorage.Client:FindFirstChild("State")
        if not stateMod then 
            stateMod = ReplicatedStorage:FindFirstChild("ModuleScripts") and ReplicatedStorage.ModuleScripts:FindFirstChild("State") 
        end
        if stateMod then
            local mod = safeRequire(stateMod)
            if type(mod) == "table" then
                if type(mod.GetData) == "function" then
                    local success, data = pcall(mod.GetData)
                    if success and type(data) == "table" then return data end
                elseif mod.Data then
                    return mod.Data
                end
            end
        end
        
        -- [ PRIORITY 5: ROBUST UI SCRAPER (FINAL FALLBACK) ]
        local uiData = { Progression = {}, Mastery = {}, Statistics = {} }

        pcall(function()
            local frames = player.PlayerGui.Main.Frames
            local function scrape(frameName, targetKey, subPath)
                local frame = frames:FindFirstChild(frameName)
                if frame then
                    local obj = frame
                    for _, p in ipairs(subPath) do
                        obj = obj:FindFirstChild(p)
                        if not obj then break end
                    end
                    if obj and (obj:IsA("TextLabel") or obj:IsA("TextBox")) then
                        local val = tonumber(obj.Text:match("%d+"))
                        if val then uiData[targetKey] = val end
                    end
                end
            end

            -- [ PROGRESSION SCRAPING ]
            scrape("BountyRank", "BountyRank", {"Container", "List", "Current", "RankHolder", "Rank"})
            scrape("IgnitionRank", "IgnitionRank", {"Container", "List", "Current", "RankHolder", "Rank"})
            scrape("CCGRank", "CCGRank", {"Container", "List", "Current", "RankHolder", "Rank"})
            scrape("ExchangeRank", "ExchangeRank", {"Container", "List", "Current", "RankHolder", "Rank"})
            scrape("HoarderRank", "HoarderRank", {"Container", "List", "Current", "RankHolder", "Rank"})
            scrape("Finger", "Finger", {"Container", "List", "Current", "RankHolder", "Rank"})
            scrape("ShikigamiRank", "ShikigamiRank", {"Container", "List", "Current", "RankHolder", "Rank"})
            scrape("EssenceRank", "EssenceRank", {"Container", "List", "Current", "RankHolder", "Rank"})

            scrape("ShinyLeveling", "ShinyLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("EnergyTotem", "EnergyTotem", {"Container", "Boosts", "Frame", "Level"})
            scrape("DamageTotem", "DamageTotem", {"Container", "Boosts", "Frame", "Level"})
            scrape("Haki", "Haki", {"Container", "Boosts", "Frame", "Level"})
            scrape("ExchangeLeveling", "ExchangeLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("ExchangePowers", "ExchangePower", {"Container", "Boosts", "Frame", "Level"})
            scrape("BloodArt", "BloodArt", {"Container", "Boosts", "Frame", "Level"})
            scrape("Wisteria", "Wisteria", {"Container", "Boosts", "Frame", "Level"})
            scrape("Kagune", "Kagune", {"Container", "Boosts", "Frame", "Level"})
            scrape("Spiritual", "Spiritual", {"Container", "Boosts", "Frame", "Level"})
            scrape("CursedLeveling", "CursedLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("ShadowLeveling", "ShadowLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("GateLeveling", "GateLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("FireLeveling", "FireLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("LightningLeveling", "LightningLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("WaterLeveling", "WaterLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("NatureLeveling", "NatureLeveling", {"Container", "Boosts", "Frame", "Level"})
            scrape("ShinyTotem", "ShinyTotem", {"Container", "Boosts", "Frame", "Level"})
            scrape("EasterBasketLeveling", "EasterBasketLeveling", {"Container", "Boosts", "Frame", "Level"})

            -- [ POWER NAME SCRAPING ]
            local profile = frames:FindFirstChild("Profile")
            local powerFrame = profile and profile:FindFirstChild("MainFrame") and profile.MainFrame:FindFirstChild("Powers")
            if powerFrame then
                for _, pFrame in ipairs(powerFrame:GetChildren()) do
                    if pFrame:IsA("Frame") then
                        local pName = pFrame:FindFirstChild("PowerName") or pFrame:FindFirstChild("Name") or pFrame:FindFirstChild("Label")
                        if pName and pName:IsA("TextLabel") then
                            local text = pName.Text:gsub("<[^>]+>", ""):gsub("%s+", " ")
                            uiData[pFrame.Name] = text
                            uiData[pFrame.Name .. "Power"] = text
                        end
                    end
                end
            end
        end)
        
        return uiData
    end




    -- [ NEW ] Gacha Rarity Listener (Anime Leveling Parity)
    local function GetRarityColor(rarity)
        local colors = {
            ["Legendary"] = "#FFD700",
            ["Mythical"] = "#FF008F",
            ["Secret"] = "#FF0000"
        }
        return colors[rarity] or "#FFFFFF"
    end

    local lastItemCount = 0
    task.spawn(function()
        while state.Nebublox_Running do
            pcall(function()
                local data = GetPlayerData()
                local items = data.Items or data.Inventory or {}
                local currentCount = 0
                for _, _ in pairs(items) do currentCount = currentCount + 1 end
                
                if lastItemCount > 0 and currentCount > lastItemCount then
                    -- Detect new item
                    for _, item in pairs(items) do
                        if item.Rarity and (item.Rarity == "Secret" or item.Rarity == "Mythical" or item.Rarity == "Legendary") then
                            if not item.Notified then
                                item.Notified = true
                                task.spawn(function()
                                    if getgenv().NebubloxWindow then
                                        getgenv().NebubloxWindow:Notify({
                                            Title = "GACHA SUCCESS",
                                            Content = string.format("You pulled a <font color='%s'><b>%s</b></font> (%s)!", GetRarityColor(item.Rarity), item.Name or "Unknown", item.Rarity),
                                            Duration = 10
                                        })
                                    end
                                end)
                            end
                        end
                    end
                end
                lastItemCount = currentCount
            end)
            task.wait(2)
        end
    end)


    local promoCodes = {
        "Leveling", "Update1", "Part 2", "Part 3", "Bugfix", "1.5K Likes", "2.5K Likes", "Sunday", "Easter", 
        "HYPE", "2K CCU", "1K CCU", "7K Favs", "Shutdown!", "Release",
        "Tower", "Quests", "10K Favs", "Wandenreich", "Aizen", "6K Likes",
        "Milestones", "20K Favs", "Inferno", "Update 3", "Shinra",
        "Peak", "Shadow Monarch", "Update 5", "Hunters", "Double Dungeon", 
        "Artifacts", "Achievements", "Cursed", "Medium", "Hoarder", "Mahoraga",
        "Shikigami", "Essence", "Drops", "Update 6", "Leaf Village", "Ramen", "Elements",
        "Fire", "Nature", "Shiny Totem", "Hashira", "Mana", "Easier",
        "Titans", "Serum", "Scouts", "World 11", "Update 7",
        "Pyrokenetics", "Manipulation", "Level 300", "Titan", "Cells", "40k Favs",
        "Jojo", "Stands", "Ripple", "World 12", "Update 8"
    }

    local CurrentAreaName = ""
    local CurrentEnemyContainer = nil

    local function DetectContainer(parent)
        if not parent then return nil end
        return parent:FindFirstChild("Enemy") or parent:FindFirstChild("Enemies") 
            or parent:FindFirstChild("Speacial") or parent:FindFirstChild("Special")
            or parent:FindFirstChild("Mobs") or parent:FindFirstChild("Bosses")
            or parent:FindFirstChild("Map") or parent:FindFirstChild("Raid1")
    end

    local function GetCurrentZone()
        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        if not root then return nil end

        local data = GetPlayerData()
        local mapNames = {"World1", "World2", "World3", "World4", "World5", "World6", "World7", "World8", "World9", "World10", "World11", "Map", "EasterRaid", "WisteriaRaid", "TowerRaid", "Trial", "Infinite", "Tower"}
        
        -- 1. Physical Folder Detection (spawn-safe)
        for _, obj in ipairs(Workspace:GetChildren()) do
            if table.find(mapNames, obj.Name) or obj.Name:find("Raid") or obj.Name:find("Tower") or obj.Name:find("Trial") or obj.Name:find("Infinite") then
                local spawn = obj:FindFirstChild("SpawnLocation") or obj:FindFirstChild("Spawn")
                if spawn and (root.Position - spawn.Position).Magnitude < 1500 then
                    CurrentAreaName = obj.Name
                    CurrentEnemyContainer = DetectContainer(obj)
                    return obj
                end
            end
        end

        -- 2. Physical Enemy Proximity (combat-safe)
        local bestMatch = nil
        local bestDist = 2000
        for _, obj in ipairs(Workspace:GetChildren()) do
            if table.find(mapNames, obj.Name) then
                local container = DetectContainer(obj)
                if container then
                    local sample = container:FindFirstChildOfClass("Model")
                    local sRoot = sample and (sample:FindFirstChild("HumanoidRootPart") or sample.PrimaryPart)
                    if sRoot then
                        local dist = (root.Position - sRoot.Position).Magnitude
                        if dist < bestDist then
                            bestDist = dist
                            bestMatch = obj
                            CurrentAreaName = obj.Name
                            CurrentEnemyContainer = container
                        end
                    end
                end
            end
        end

        if bestMatch then return bestMatch end

        -- 3. Fallback to Data.LastArea
        if data.LastArea then
            local world = Workspace:FindFirstChild(tostring(data.LastArea))
            if world then
                CurrentAreaName = tostring(data.LastArea)
                CurrentEnemyContainer = DetectContainer(world) 
                return world
            end
        end

        return nil
    end

    -- [ DYNAMIC ZONE WATCHER ]
    local LastKnownZone = ""
    task.spawn(function()
        while state.Nebublox_Running do
            pcall(function()
                local zone = GetCurrentZone()
                local zoneName = zone and zone.Name or "NONE"
                
                if zoneName ~= LastKnownZone then
                    LastKnownZone = zoneName
                    state.CurrentTarget = nil
                    CurrentAreaName = ""
                    CurrentEnemyContainer = nil
                    
                    task.wait(1) -- Wait for world assets to finalize
                    UpdateScanner()
                    
                    if getgenv().NebubloxWindow then
                        getgenv().NebubloxWindow:Notify({
                            Title = "ZONE TRANSITION",
                            Content = "New zone detected: " .. zoneName .. ". Cache refreshed.",
                            Type = "success",
                            Duration = 3
                        })
                    end
                end
            end)
            task.wait(1.5)
        end
    end)

    local function SaveOriginPosition()
        if state.IsTeleporting then return end
        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        local zone = GetCurrentZone()
        local zoneName = zone and zone.Name or ""
        local inRaid = zoneName:find("Raid") or zoneName:find("Tower") or zoneName:find("Easter")
        
        if root and zoneName ~= "" and not inRaid then
            state.SavedReturnPos = root.CFrame
            state.SavedReturnWorld = zoneName
            
            getgenv().Nebu_Persistence.SavedReturnPos = root.CFrame
            getgenv().Nebu_Persistence.SavedReturnWorld = zoneName
        end
    end

    local function GetCleanName(name)
        if not name then return "" end
        return name:gsub("%s*%(.-%)%s*", ""):gsub("%d+$", ""):gsub("%s+$", "")
    end

    local function IsEnemyValid(enemy)
        if not enemy or not enemy.Parent then return false end
        
        local root = enemy:FindFirstChild("HumanoidRootPart") or enemy:FindFirstChild("Hitbox")
        if not root then return false end
        if root.Position.Y < -500 then return false end

        if enemy:GetAttribute("Initialized") == false then return false end
        if enemy:GetAttribute("Attackable") == false then return false end

        if enemy:GetAttribute("Dead") == true then return false end
        if enemy:GetAttribute("Health") == 0 then return false end

        local hum = enemy:FindFirstChildOfClass("Humanoid")
        if hum and hum.Health <= 0 then return false end
        
        local customHealth = enemy:FindFirstChild("Health")
        if customHealth and (customHealth:IsA("NumberValue") or customHealth:IsA("IntValue")) then
            if customHealth.Value <= 0 then return false end
        end

        local fill = enemy:FindFirstChild("BarFill", true)
        if fill and fill:IsA("GuiObject") then
            if fill.Size.X.Scale <= 0 and fill.Size.X.Offset <= 0 then return false end
        end

        if Players:GetPlayerFromCharacter(enemy) then return false end

        return true
    end

    local function GetEnemies()
        local zone = GetCurrentZone()
        local container = CurrentEnemyContainer
        if not container then return {} end
        
        local enemies = {}
        for _, obj in ipairs(container:GetChildren()) do
            if obj:IsA("Model") and IsEnemyValid(obj) then
                table.insert(enemies, obj)
            end
        end
        return enemies
    end

    local function IsPlayerInCombat()
        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        if not root then return false end
        
        local enemyContainer = CurrentEnemyContainer
        if enemyContainer then
            for _, enemy in ipairs(enemyContainer:GetChildren()) do
                local eRoot = enemy:IsA("Model") and (enemy:FindFirstChild("HumanoidRootPart") or enemy.PrimaryPart)
                if eRoot and (root.Position - eRoot.Position).Magnitude < 50 then
                    return true
                end
            end
        end
        return false
    end

    local function UpdateScanner()
        local zone = GetCurrentZone()
        local container = CurrentEnemyContainer
        local enemies = GetEnemies()
        
        local seen = {}
        local priorityList = {"None"}
        local secondaryList = {"All"}
        
        for _, e in ipairs(enemies) do
            local clean = GetCleanName(e.Name)
            if clean ~= "" and not seen[clean] then
                seen[clean] = true
                table.insert(priorityList, clean)
                table.insert(secondaryList, clean)
            end
        end
        
        table.sort(priorityList)
        table.sort(secondaryList)
        
        local priorityDropdown = state.PriorityDropdownReference
        local secondaryDropdown = state.SecondaryDropdownReference
        if priorityDropdown then priorityDropdown:Refresh(priorityList) end
        if secondaryDropdown then secondaryDropdown:Refresh(secondaryList) end

        local zoneStr = zone and zone.Name or "NONE"
        local contStr = container and container.Name or "NONE"
        
        return enemies
    end

    local VFX_Pool = { Cache = {} }
    function VFX_Pool:Get(name, class, props)
        self.Cache[name] = self.Cache[name] or {}
        local inst = nil
        if #self.Cache[name] > 0 then 
            inst = table.remove(self.Cache[name]) 
        else
            inst = Instance.new(class)
            if class == "Frame" then
                local corner = Instance.new("UICorner")
                corner.CornerRadius = UDim.new(1, 0)
                corner.Parent = inst
            end
        end
        for k, v in pairs(props or {}) do pcall(function() inst[k] = v end) end
        return inst
    end

    function VFX_Pool:Return(name, inst)
        if not inst then return end
        inst.Parent = nil
        table.insert(self.Cache[name], inst)
    end

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
                if s and (res:find("NEBUBLOX UI") or res:find("SUPERNOVA")) then
                    rawCode = res
                else
                    local github = "https://raw.githubusercontent.com/Nebublox/DarkMatterV1/main/scripts/NebubloxUI.lua"
                    local s2, res2 = pcall(game.HttpGet, game, github)
                    if s2 and (res2:find("NEBUBLOX UI") or res2:find("SUPERNOVA")) then
                        rawCode = res2
                    else
                        local fallback = "https://raw.githubusercontent.com/Nebublox/DarkMatterV1/main/NebubloxUI.lua"
                        local s3, res3 = pcall(game.HttpGet, game, fallback)
                        if s3 and (res3:find("NEBUBLOX UI") or res3:find("SUPERNOVA")) then
                            rawCode = res3
                        end
                    end
                end
            end

            if rawCode then
                local fn, compileErr = loadst(rawCode)
                if fn then 
                    local ok, result = pcall(fn)
                    if ok and type(result) == "table" then 
                        getgenv().Nebublox = result
                        return result 
                    else
                        warn("[NEBUBLOX] Library initialization failed with error: ", tostring(result))
                        error("[NEBUBLOX] Key System passed, but library initialization failed.")
                    end
                else
                    error("[NEBUBLOX] Failed to compile library: " .. tostring(compileErr))
                end
            end
            
            game.StarterGui:SetCore("SendNotification", {
                Title = "Load Error",
                Text = "Nebublox servers might be down. Library not found.",
                Duration = 10
            })
            error("[NEBUBLOX] CRITICAL: Library source not found.")
        end)()
    end

    local function SafeTeleport(cf)
        pcall(function()
            local char = player.Character
            local root = char and char:FindFirstChild("HumanoidRootPart")
            if root then
                root.AssemblyLinearVelocity = Vector3.zero
                root.AssemblyAngularVelocity = Vector3.zero
                root.CFrame = cf
            end
        end)
    end

    local function NativeTeleport(cf)
        SafeTeleport(cf)
    end

    local function NativeUniverseJump(worldId)
        pcall(function()
            local remotes = ReplicatedStorage:FindFirstChild("Remotes")
            if remotes and remotes:FindFirstChild("Teleport") then
                remotes.Teleport:FireServer(worldId)
            end
        end)
    end

    local function TeleportToWorld(worldId)
        if not worldId or worldId == "" then worldId = "World1" end
        local worldMap = {
            ["Planet Namek"]     = "World1", ["Blackflag Kingdom"] = "World2", ["Clover Kingdom"] = "World3",
            ["Slayer Town"]      = "World4", ["Ghoul City"] = "World5", ["Wandenreich"] = "World6",
            ["Inferno City"]     = "World7", ["Sorcerer High"] = "World8", ["Double Dungeons"] = "World9",
            ["Leaf Village"]     = "World10", ["Shiganzina"] = "World11", ["Bizzare Town"] = "World12",
            ["World1"] = "World1", ["World2"] = "World2", ["World3"] = "World3", ["World4"] = "World4", ["World5"] = "World5",
            ["World6"] = "World6", ["World7"] = "World7", ["World8"] = "World8", ["World9"] = "World9", ["World10"] = "World10", ["World11"] = "World11", ["World12"] = "World12"
        }
        local worldIndices = {
            ["Planet Namek"] = "1", ["Blackflag Kingdom"] = "2", ["Clover Kingdom"] = "3",
            ["Slayer Town"] = "4", ["Ghoul City"] = "5", ["Wandenreich"] = "6",
            ["Inferno City"] = "7", ["Sorcerer High"] = "8", ["Double Dungeons"] = "9",
            ["Leaf Village"] = "10", ["Shiganzina"] = "11", ["Bizzare Town"] = "12",
            ["World1"] = "1", ["World2"] = "2", ["World3"] = "3", ["World4"] = "4", ["World5"] = "5",
            ["World6"] = "6", ["World7"] = "7", ["World8"] = "8", ["World9"] = "9", ["World10"] = "10", ["World11"] = "11", ["World12"] = "12",
        }
        
        local internalId = worldMap[worldId] or worldId
        local index = worldIndices[worldId]
        
        state.IsTeleporting = true
        state.CurrentTarget = nil
        
        task.spawn(function()
            local wasFarming = state.Farm
            state.Farm = false
            
            AddLog("Teleporting to " .. worldId .. "...")
            
            -- [ METHOD 1: UI CLICKING ]
            local success = false
            pcall(function()
                if index then
                    local frame = player.PlayerGui.Main.Frames.Teleport.ScrollingFrame:FindFirstChild(index)
                    local btn = frame and frame:FindFirstChild("Teleport")
                    if btn then
                        for _, connection in pairs(getconnections(btn.MouseButton1Click)) do
                            connection:Fire()
                        end
                        success = true
                    end
                end
            end)

            -- [ METHOD 2: REMOTE FALLBACK ]
            if not success then
                NativeUniverseJump(internalId)
            end
            
            task.wait(5)
            state.IsTeleporting = false
            if wasFarming then state.Farm = true end
        end)
    end

    local function FindBestTarget(ignoreFilters)
        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        if not root then return nil end

        local enemies = GetEnemies()
        if not enemies or #enemies == 0 then return nil end

        if state.PriorityTargetName ~= "None" then
            local priorityEnemy = nil
            local shortestPriorityDist = math.huge 
            for _, obj in ipairs(enemies) do
                if GetCleanName(obj.Name) == state.PriorityTargetName then
                    local enemyRoot = obj:FindFirstChild("HumanoidRootPart") or obj.PrimaryPart
                    if enemyRoot then
                        local dist = (root.Position - enemyRoot.Position).Magnitude
                        if dist < shortestPriorityDist then
                            shortestPriorityDist = dist
                            priorityEnemy = obj
                        end
                    end
                end
            end
            if priorityEnemy then return priorityEnemy end
        end

        local closestEnemy = nil
        local shortestDist = math.huge

        for _, obj in ipairs(enemies) do
            local isSecondary = false
            local cleanName = GetCleanName(obj.Name)
            if table.find(state.SecondaryTargetNames, "All") then
                isSecondary = true
            else
                for _, name in ipairs(state.SecondaryTargetNames) do
                    if cleanName == name then isSecondary = true break end
                end
            end

            if isSecondary or ignoreFilters then
                local enemyRoot = obj:FindFirstChild("HumanoidRootPart") or obj.PrimaryPart
                if enemyRoot then
                    local dist = (root.Position - enemyRoot.Position).Magnitude
                    if dist < shortestDist then
                        shortestDist = dist
                        closestEnemy = obj
                    end
                end
            end
        end

        return closestEnemy
    end

    local function GetRaidHUD()
        return player.PlayerGui:FindFirstChild("Main") and player.PlayerGui.Main:FindFirstChild("HUD") and player.PlayerGui.Main.HUD:FindFirstChild("Dungeon")
    end

    local function GetCurrentWave()
        local wave = 0
        pcall(function()
            local dungeon = GetRaidHUD()
            if dungeon and dungeon.Visible then
                local waveObj = nil
                
                -- Path 1: HUD.Dungeon.RaidsInfo.WavesFrame.Wave (or WavesLabel/WavesFrame itself)
                local raidsInfo = dungeon:FindFirstChild("RaidsInfo")
                local wavesFrame = raidsInfo and raidsInfo:FindFirstChild("WavesFrame")
                if wavesFrame then
                    waveObj = wavesFrame:FindFirstChild("Wave") 
                        or wavesFrame:FindFirstChild("WavesLabel")
                        or wavesFrame
                end
                
                -- Path 2: Recursive fallback in Dungeon for WavesFrame
                if not waveObj then
                    local recursiveWavesFrame = dungeon:FindFirstChild("WavesFrame", true)
                    if recursiveWavesFrame then
                        waveObj = recursiveWavesFrame:FindFirstChild("Wave")
                            or recursiveWavesFrame:FindFirstChild("WavesLabel")
                            or recursiveWavesFrame
                    end
                end
                
                -- Path 3: Direct recursive fallback for Wave or WavesLabel
                if not waveObj then
                    waveObj = dungeon:FindFirstChild("Wave", true)
                        or dungeon:FindFirstChild("WavesLabel", true)
                end
                
                if waveObj and (waveObj:IsA("TextLabel") or waveObj:IsA("TextBox") or waveObj:IsA("TextButton")) then
                    local text = waveObj.Text
                    wave = tonumber(text:match("%d+")) or 0
                end
            end
        end)
        return wave
    end

    local function ScrapePowerIcon(powerKey)
        local iconId = nil
        pcall(function()
            local powers = player.PlayerGui:FindFirstChild("Main") and player.PlayerGui.Main:FindFirstChild("Frames") and player.PlayerGui.Main.Frames:FindFirstChild("Profile") and player.PlayerGui.Main.Frames.Profile:FindFirstChild("MainFrame") and player.PlayerGui.Main.Frames.Profile.MainFrame:FindFirstChild("Powers")
            if powers then
                local pFrame = powers:FindFirstChild(powerKey)
                if pFrame and pFrame:FindFirstChild("Icon") and pFrame.Icon:IsA("ImageLabel") then
                    iconId = pFrame.Icon.Image
                end
            end
        end)
        return iconId
    end

    -- ===========================================
    -- UNIFIED COMBAT & MOVEMENT LOOP (GROUND COMBAT)
    -- ===========================================
    trackConnection(RunService.Stepped:Connect(function(_, dt)
        if not state.Nebublox_Running then return end
        if state.IsTeleporting then return end 

        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        
        local zone = GetCurrentZone()
        local zoneName = zone and zone.Name or ""
        local inRaid = zoneName:find("Raid") or zoneName:find("Tower") or zoneName:find("Easter") or zoneName:find("Trial") or zoneName:find("Infinite") or zoneName:find("Dungeon")
        
        if (state.Farm or inRaid) and root then
            if state.CurrentTarget and not IsEnemyValid(state.CurrentTarget) then
                state.CurrentTarget = nil
            end

            if not state.CurrentTarget then
                state.CurrentTarget = FindBestTarget(inRaid)
            end

            local target = state.CurrentTarget

            if target then
                local tRoot = target:FindFirstChild("HumanoidRootPart") or target.PrimaryPart or target:FindFirstChild("Hitbox")
                if tRoot then
                    if state.Noclip then
                        for _, part in ipairs(char:GetDescendants()) do
                            if part:IsA("BasePart") and part.CanCollide then
                                part.CanCollide = false
                            end
                        end
                    end
                    
                    root.AssemblyLinearVelocity = Vector3.zero
                    root.AssemblyAngularVelocity = Vector3.zero
                    
                    local currentPos = root.Position
                    local targetPos = tRoot.Position
                    local diff = currentPos - targetPos
                    
                    local direction = diff.Magnitude > 0.01 and diff.Unit or Vector3.new(0, 0, 1)
                    local standPos = targetPos + (direction * 6)
                    root.CFrame = CFrame.lookAt(standPos, targetPos)

                    if state.Farm and not state.IsTeleporting then
                        local hum = char:FindFirstChildOfClass("Humanoid")
                        local tool = char:FindFirstChildOfClass("Tool")

                        if state.Equip and not tool then
                            local backpackTool = player.Backpack:FindFirstChildOfClass("Tool")
                            if backpackTool and hum then hum:EquipTool(backpackTool) end
                        end

                        if tool then
                            if state.EasterRaid then
                                pcall(function() ReplicatedStorage.Remotes.JoinEasterRaid:FireServer() end)
                            end

                            tool:Activate()
                            pcall(function() ReplicatedStorage.Remotes.Attack:FireServer() end)
                        end
                    end
                end
            end
        end
    end))

    task.spawn(function()
        while state.Nebublox_Running do
            if state.PetSyncEnabled then
                pcall(function()
                    local data = GetPlayerData()
                    local items = data.Items or data.Pets or {}
                    
                    local pets = {}
                    for uuid, item in pairs(items) do
                        if item.Type == "Pet" or item.PetId then
                            table.insert(pets, {
                                uuid = uuid,
                                power = tonumber(item.Power or item.Damage or item.Multiplier or 0)
                            })
                        end
                    end
                    
                    table.sort(pets, function(a, b) return a.power > b.power end)
                    
                    local max = tonumber(data.MaxEquippedPets or data.MaxPets) or 5
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    local petRemote = remotes and remotes:FindFirstChild("Pets") and remotes.Pets:FindFirstChild("ReplicateEquipPet")
                    
                    if petRemote then
                        for i = 1, math.min(#pets, max) do
                            pcall(function() petRemote:FireServer(pets[i].uuid) end)
                            task.wait(0.1)
                        end
                    end
                end)
            end
            task.wait(60)
        end
    end)

    local RadiusInstance = nil
    local RadiusTween = nil
    local CurrentTargetVFX = nil
    local CurrentRangeVFX = nil

    local function SpawnBurst(targetPos)
        local screenGui = player.PlayerGui:FindFirstChild("NebubloxUI") or player.PlayerGui:FindFirstChild("Main")
        if not screenGui then return end
        
        local viewportPoint, onScreen = Workspace.CurrentCamera:WorldToViewportPoint(targetPos)
        if not onScreen then return end
        
        local center = UDim2.fromOffset(viewportPoint.X, viewportPoint.Y)
        
        for i = 1, 6 do
            local p = VFX_Pool:Get("BurstPart", "Frame", {
                Size = UDim2.fromOffset(6, 6), 
                Position = center,
                AnchorPoint = Vector2.new(0.5, 0.5), 
                BackgroundColor3 = Color3.fromRGB(0, 255, 255),
                Parent = screenGui, 
                ZIndex = 10, 
                BackgroundTransparency = 0
            })

            local angle = math.rad(math.random(0, 360))
            local dist = math.random(40, 100)
            local info = TweenInfo.new(0.6, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)
            
            local t = TweenService:Create(p, info, {
                Position = UDim2.new(center.X.Scale, center.X.Offset + math.cos(angle) * dist, center.Y.Scale, center.Y.Offset + math.sin(angle) * dist),
                BackgroundTransparency = 1,
                Size = UDim2.fromOffset(0, 0)
            })
            t:Play()
            t.Completed:Connect(function() VFX_Pool:Return("BurstPart", p) end)
        end
    end

    local function TweenRadiusVFX(targetPart, targetSize)
        if not RadiusInstance then return end
        if RadiusTween then RadiusTween:Cancel(); RadiusTween = nil end
        
        local info = TweenInfo.new(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
        RadiusTween = TweenService:Create(RadiusInstance, info, {
            Size = Vector3.new(targetSize, RadiusInstance.Size.Y, targetSize),
            Transparency = (targetSize < 1) and 1 or 0.4
        })
        RadiusTween:Play()
    end

    task.spawn(function()
        while state.Nebublox_Running do
            local success, err = pcall(function()
                local char = player.Character
                local root = char and char:FindFirstChild("HumanoidRootPart")
                
                if not root or not state.ShowRadius or not state.Farm then
                    if RadiusInstance then
                        TweenRadiusVFX(nil, 0.1)
                        task.wait(0.25)
                        if RadiusInstance then RadiusInstance:Destroy(); RadiusInstance = nil end
                    end
                    CurrentTargetVFX = nil
                    CurrentRangeVFX = nil
                    return
                end

                local data = GetPlayerData()
                local rawRange = data.AttackRange or 0
                local targetRange = 8 + rawRange * 2
                
                local target = FindBestTarget()
                if not target then
                    if RadiusInstance and CurrentTargetVFX then
                        TweenRadiusVFX(nil, 0.1)
                    end
                    CurrentTargetVFX = nil
                    return
                end

                local tRoot = target.PrimaryPart or target:FindFirstChild("HumanoidRootPart")
                if not tRoot then return end

                if not RadiusInstance then
                    local sphere = ReplicatedStorage:FindFirstChild("VFX") and ReplicatedStorage.VFX:FindFirstChild("Radius")
                    if sphere then
                        RadiusInstance = sphere:Clone()
                        RadiusInstance.Name = "NebuRadius_Client"
                        RadiusInstance.CastShadow = false
                        RadiusInstance.Massless = true
                        RadiusInstance.CanCollide = false
                        RadiusInstance.CanQuery = false
                        RadiusInstance.CanTouch = false
                        RadiusInstance.Transparency = 1
                        RadiusInstance.Parent = Workspace
                    end
                end

                if RadiusInstance then
                    local rayParams = RaycastParams.new()
                    rayParams.FilterType = Enum.RaycastFilterType.Exclude
                    rayParams.IgnoreWater = true
                    rayParams.FilterDescendantsInstances = {char, target, RadiusInstance}
                    
                    local origin = tRoot.Position + Vector3.new(0, 5, 0)
                    local rayResult = Workspace:Raycast(origin, Vector3.new(0, -100, 0), rayParams)
                    
                    local finalY = tRoot.Position.Y
                    if rayResult then finalY = rayResult.Position.Y end
                    
                    RadiusInstance.CFrame = CFrame.new(tRoot.Position.X, finalY + 0.05, tRoot.Position.Z) * (CFrame.Angles(0, os.clock() * 2, 0))
                    
                    if CurrentTargetVFX ~= target or CurrentRangeVFX ~= targetRange then
                        TweenRadiusVFX(target, targetRange)
                        CurrentTargetVFX = target
                        CurrentRangeVFX = targetRange
                        pcall(function() SpawnBurst(tRoot.Position) end)
                    end
                end
            end)
            task.wait(0.1)
        end
    end)


    -- ===========================================
    -- FULL UI INITIALIZATION 
    -- ===========================================
    if not Nebublox then return end

    Nebublox.MakeWindow = Nebublox.CreateWindow
    local Window = Nebublox:CreateWindow({
        Title = "ANIME LEVELING",
        Subtitle = "Anime Leveling",
        Size = UDim2.new(0, 530, 0, 320), 
        KeySystem = true, 
        Profile = true, 
        CyberBackground = true,
        TitleGradient = true
    }, state)
    Window:AddConsole()
    Window:AddStandardHome()

    -- [ NEBUBLOX ] Dynamic Sidebar Statistics

    task.spawn(function()
        local t = 0
        local c1_base = Color3.fromRGB(0, 255, 255)
        local c2_base = Color3.fromRGB(138, 43, 226)
        while state.Nebublox_Running do
            t = t + 0.05
            local alpha = (math.sin(t - math.pi/2) + 1) / 2
            local c1 = c1_base:Lerp(c2_base, alpha)
            local c2 = c2_base:Lerp(c1_base, alpha)
            local h1 = string.format("#%02X%02X%02X", math.floor(c1.R*255), math.floor(c1.G*255), math.floor(c1.B*255))
            local h2 = string.format("#%02X%02X%02X", math.floor(c2.R*255), math.floor(c2.G*255), math.floor(c2.B*255))
            Window.SubtitleLabel.Text = string.format("<font color='%s'>ANIME</font> <font color='%s'>LEVELING</font>", h1, h2)
            task.wait(0.05)
        end
    end)

    local CombatTab = Window:AddTab({
        Name = "Combat", 
        Icon = "rbxassetid://111866346767225",
        Color = "0 1 0.8 0 0 0.3 0.74902 0.662745 0 0 0.5 1 0.956863 0.490196 0 0.7 0.74902 0.662745 0 0 1 1 0.8 0 0"
    })
    local WorldTab = Window:AddTab({
        Name = "Worlds", 
        Icon = "rbxassetid://117234532007371",
        Color = "0 0.662745 0.470588 1 0 0.3 0.54902 0 1 0 0.5 0.921569 0.607843 1 0 0.7 0.54902 0 1 0 1 0.662745 0.470588 1 0"
    })
    local AutoTab = Window:AddTab({
        Name = "Automation", 
        Icon = "rbxassetid://81881130527730",
        Color = "0 0.984314 0.505882 1 0 0.3 1 0 0.984314 0 0.5 1 0.709804 0.933333 0 0.7 1 0 0.984314 0 1 0.984314 0.505882 1 0"
    })
    local PotTab = Window:AddTab({
        Name = "Potions", 
        Icon = "rbxassetid://72132786273899",
        Color = ColorSequence.new({
            ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 0, 242)),
            ColorSequenceKeypoint.new(0.14, Color3.fromRGB(0, 157, 255)),
            ColorSequenceKeypoint.new(0.28, Color3.fromRGB(0, 255, 255)),
            ColorSequenceKeypoint.new(0.42, Color3.fromRGB(2, 249, 0)),
            ColorSequenceKeypoint.new(0.57, Color3.fromRGB(138, 250, 0)),
            ColorSequenceKeypoint.new(0.71, Color3.fromRGB(255, 238, 0)),
            ColorSequenceKeypoint.new(0.85, Color3.fromRGB(255, 179, 0)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 119, 0))
        })
    })




    task.spawn(function()
        local t = 0
        local blue = Color3.fromRGB(0, 230, 255)
        local yellow = Color3.fromRGB(255, 220, 27)
        while state.Nebublox_Running and Window and Window.SubtitleLabel do
            t = t + 0.05
            local alpha = (math.sin(t - math.pi/2) + 1) / 2
            local c1 = blue:Lerp(yellow, alpha)
            local c2 = yellow:Lerp(blue, alpha)
            
            local h1 = string.format("#%02X%02X%02X", math.floor(c1.R*255), math.floor(c1.G*255), math.floor(c1.B*255))
            local h2 = string.format("#%02X%02X%02X", math.floor(c2.R*255), math.floor(c2.G*255), math.floor(c2.B*255))
            
            Window.SubtitleLabel.Text = string.format("<font color='%s'>ANIME</font> <font color='%s'>LEVELING</font>", h1, h2)
            task.wait(0.05)
        end
    end)
    
    local function FireGachaRemote(powerKey, targetRarity)
        pcall(function()
            local rems = ReplicatedStorage:FindFirstChild("Remotes")
            if rems then
                local base = powerKey:gsub("Power", "")
                local roll = rems:FindFirstChild("Roll" .. powerKey) or
                             rems:FindFirstChild("Roll" .. base) or
                             rems:FindFirstChild("Roll" .. powerKey .. "Power") or
                             rems:FindFirstChild("Roll" .. powerKey .. "sPower") or
                             rems:FindFirstChild("Roll" .. base .. "sPower")
                if roll then
                    roll:FireServer(targetRarity)
                end
            end
        end)
    end

    local function CreateAdvancedGacha(section, name, powerKey, assetId, rarity)
        if not section then return end
        local targetRarity = rarity or "Secret"
        
        local iconStr = ""
        if assetId then
            local strId = tostring(assetId)
            local num = strId:match("%d+")
            iconStr = num and ("rbxassetid://" .. num) or ""
        end

        local Toggle = section:AddToggle({
            Name = name, Default = false, Icon = iconStr, IconOffset = UDim2.new(0, 8, 0.5, 0),
            Callback = function(v)
                state["Roll" .. powerKey] = v
                if v then
                    task.spawn(function()
                        while state["Roll" .. powerKey] and state.Nebublox_Running do
                            local hasCurrency = true
                            pcall(function()
                                local data = GetPlayerData()
                                local coinKey1 = powerKey:gsub("Power", "") .. "Coins"
                                local coinKey2 = powerKey .. "Coins"
                                local balance = tonumber(data[coinKey1] or data[coinKey2] or data[coinKey1:gsub("Coins", "")] or 0)
                                if balance and balance < 1 then hasCurrency = false end
                            end)

                            if not hasCurrency then 
                                task.wait(1) 
                                continue 
                            end

                            FireGachaRemote(powerKey, targetRarity)
                            task.wait(state.GachaDelay or 0.1)
                        end
                    end)
                end
            end
        })

        task.spawn(function()
            while state.Nebublox_Running do
                local stopLoop = false
                pcall(function()
                    local data = GetPlayerData()
                    local currentVal = data[powerKey] or data[powerKey:gsub("Power", "")] or data[powerKey .. "Name"] or "None"
                    

                    if tostring(currentVal):find(targetRarity) then
                        state["Roll" .. powerKey] = false
                        Toggle:Set(false)
                        local completeLabel = (targetRarity == "Divine" or targetRarity == "Secret" or targetRarity == "Mythical") and getGradient(name .. " [" .. targetRarity .. "]", targetRarity) or "<font color='#00FF00'>" .. name .. " [MAXED]</font>"
                        Toggle:SetName(completeLabel)
                        stopLoop = true
                    elseif data then
                        local current = tostring(currentVal)
                        local rColors = {
                            ["Common"] = "#C8C8C8",
                            ["Uncommon"] = "#00FF00",
                            ["Rare"] = "#0091FF",
                            ["Epic"] = "#FF00FF",
                            ["Legendary"] = "#FFD700",
                            ["Mythical"] = "#FF008F",
                            ["Secret"] = "#FF0000",
                            ["Divine"] = "#00FFFF",
                            ["Omni"] = "#FFFB00"
                        }

                        local detectedColor = "#AAAAAA"
                        local isSpecial = false
                        
                        for rarity, color in pairs(rColors) do
                            if current:find(rarity) then
                                detectedColor = color
                                if rarity == "Divine" or rarity == "Secret" or rarity == "Mythical" then
                                    isSpecial = true
                                end
                                break
                            end
                        end

                        local labelText = string.format("<font color='%s'>%s</font> <font color='#888888'>[</font><font color='%s'>%s</font><font color='#888888'>]</font>", detectedColor, name, detectedColor, current)
                        
                        if isSpecial then
                            if current:find("Divine") then
                                labelText = getGradient(name .. " [" .. current .. "]", "Divine")
                            elseif current:find("Secret") then
                                labelText = getGradient(name .. " [" .. current .. "]", "Secret")
                            elseif current:find("Mythical") then
                                labelText = getGradient(name .. " [" .. current .. "]", "Mythical")
                            end
                        end

                        Toggle:SetName(labelText)
                    end
                end)
                if stopLoop then break end
                task.wait(1.5)
            end
        end)
    end
    local function CreateLevelingSys(section, name, key, assetId, maxLevel, compColor, displayName)
        if not section then return end
        
        local displayName = displayName or name
        local completionStyle = compColor or "Secret"
        local iconStr = ""
        if assetId then
            local strId = tostring(assetId)
            local num = strId:match("%d+")
            iconStr = num and ("rbxassetid://" .. num) or ""
        end

        local levelCap = maxLevel or 100
        local completionStyle = compColor or "Legendary"
        local compHex = "#FFB300" -- Default Legendary
        
        if completionStyle == "Hoarder" then
            compHex = "#0091FF"
        elseif completionStyle == "Haki" then
            compHex = "#B700FF"
        elseif completionStyle == "Mythical" then
            compHex = "#FF007F"
        end

        local displayName = name

        local Toggle = section:AddToggle({
            Name = displayName, Default = false, Icon = iconStr, IconOffset = UDim2.new(0, 8, 0.5, 0),
            Callback = function(v)
                state["Lvl" .. key] = v
                if v then
                    task.spawn(function()
                        while state["Lvl" .. key] and state.Nebublox_Running do
                            pcall(function()
                                local rs = game:GetService("ReplicatedStorage")
                                local remotes = rs:FindFirstChild("Remotes")
                                local lvl = remotes and (remotes:FindFirstChild(key .. "Leveling") or remotes:FindFirstChild("Update" .. key))
                                if not lvl and remotes then
                                    lvl = remotes:FindFirstChild(key) or remotes:FindFirstChild(key .. "Rank") or remotes:FindFirstChild(key .. "Level")
                                end
                                if lvl then lvl:FireServer() end
                            end)
                            task.wait(0.6)
                        end
                    end)
                end
            end
        })

        task.spawn(function()
            while state.Nebublox_Running do
                local stopLoop = false
                pcall(function()
                    local data = GetPlayerData()
                    local currentLevel = GetLiveLevel(data, key)

                    if currentLevel >= levelCap then
                        state["Lvl" .. key] = false
                        Toggle:Set(false)
                        Toggle:SetName(getGradient(displayName .. " [MAXED]", completionStyle))
                        stopLoop = true
                    else
                        Toggle:SetName(displayName .. " <font color='#AAAAAA'>[" .. currentLevel .. "/" .. levelCap .. "]</font>")
                    end
                end)
                if stopLoop then break end
                task.wait(5)
            end
        end)
    end

    local function CreateHatchToggle(section, starKey, name, eggName, assetId)
        if not section then return end
        local currentEgg = typeof(eggName) == "table" and eggName[1] or eggName or starKey
        state["SelectedEgg" .. starKey] = currentEgg
        
        local iconStr = ""
        if assetId then
            local strId = tostring(assetId)
            local num = strId:match("%d+")
            iconStr = num and ("rbxassetid://" .. num) or ""
        end

        section:AddToggle({
            Name = "<font color='rgb(229, 191, 0)'>" .. name .. "</font>", Default = false, Icon = iconStr, IconOffset = UDim2.new(0, 8, 0.5, 0),
            Callback = function(v)
                state["Hatch" .. starKey] = v
                if v then
                    task.spawn(function()
                        while state["Hatch" .. starKey] and state.Nebublox_Running do
                            pcall(function()
                                local data = GetPlayerData()
                                
                                local isVip = (data.Gamepasses and data.Gamepasses.VIP) or (data.GiftedGamepasses and data.GiftedGamepasses.VIP) or (data.RobuxTokenGamepasses and data.RobuxTokenGamepasses.VIP)
                                local vipBonus = isVip and 1 or 0
                                local baseOpens = data.MaxAllowedHatches or 1
                                local achBonus = data.AchievementBonuses and data.AchievementBonuses.ExtraOpens or 0
                                local labBonus = data.LaboratoryUpgrades and data.LaboratoryUpgrades.StarOpen or 0
                                
                                local extra = 0
                                for i = 1, 8 do
                                    if data["Star" .. i .. "HatchesClaimed"] then extra = extra + 1 end
                                end
                                
                                local totalOpens = math.max(1, baseOpens + achBonus + vipBonus + labBonus + extra)
                                
                                local rs = game:GetService("ReplicatedStorage")
                                local remotes = rs:FindFirstChild("Remotes")
                                local eggs = remotes and remotes:FindFirstChild("Eggs")
                                local hatch = eggs and eggs:FindFirstChild("Hatch")
                                
                                if hatch then
                                    hatch:InvokeServer(currentEgg, totalOpens)
                                end
                            end)
                            task.wait(state.HatchDelay or 0.8)
                        end
                    end)
                end
            end
        })
    end

    task.spawn(function()
        while state.Nebublox_Running do
            pcall(function()
                local data = GetPlayerData()
                local hud = player.PlayerGui:FindFirstChild("Main") and player.PlayerGui.Main:FindFirstChild("HUD") and player.PlayerGui.Main.HUD:FindFirstChild("LeftList")
                
                local energyLabel = hud and hud:FindFirstChild("EnergyHolder") and hud.EnergyHolder:FindFirstChild("Energy") and hud.EnergyHolder.Energy:FindFirstChild("Amount")
                local coinLabel = hud and hud:FindFirstChild("CoinsHolder") and hud.CoinsHolder:FindFirstChild("Coins") and hud.CoinsHolder.Coins:FindFirstChild("Amount")
                
                local energy = energyLabel and energyLabel.Text or "0"
                local coins = coinLabel and coinLabel.Text or "0"
                
                local shopFrame = player.PlayerGui:FindFirstChild("Main") and player.PlayerGui.Main:FindFirstChild("Frames") and player.PlayerGui.Main.Frames:FindFirstChild("Shop")
                local shopCurrency = shopFrame and shopFrame:FindFirstChild("Currency") and shopFrame.Currency:FindFirstChild("Currency")
                local shopValue = shopCurrency and shopCurrency.Text or "0"

                local rankVal = tostring(data.Rank or "Beginner")
                
                Window:SetSidebarStats({
                    {src = 'rbxassetid://100732705812852', Text = rankVal, Color = Color3.fromRGB(255, 0, 166), Size = 22},
                    {src = 'rbxassetid://103004839683203', Text = energy, Color = Color3.fromRGB(0, 230, 255), Size = 22},
                    {src = 'rbxassetid://73292391919105', Text = coins, Color = Color3.fromRGB(255, 215, 0), Size = 22},
                    {src = 'rbxassetid://84747910888593', Text = shopValue, Color = Color3.fromRGB(0, 255, 149), Size = 22},
                })

                local status = "Standing By..."
                if state.Farm or state.TowerRaid or state.WisteriaRaid or state.EasterRaid then
                    status = "Automating Combat..."
                elseif state.AutoHatch then
                    status = "Hatching Stars..."
                elseif CurrentAreaName ~= "" then
                    local area = CurrentAreaName:gsub("_Raid1", ""):gsub("_", " ")
                    status = "Area: " .. area
                    
                    if area:find("World9") or area:find("Double Dungeons") or area:find("World10") or area:find("Leaf Village") or area:find("World8") or area:find("Sorcerer High") or area:find("World11") or area:find("Shiganzina") or area:find("World12") or area:find("Bizzare Town") then
                        local pityKey = area:find("World9") and "HunterPityData" or area:find("World10") and "ChakraPityData" or area:find("World11") and "SerumPityData" or area:find("World12") and "StandPityData" or "TechniquePityData"
                        local pity = data[pityKey] or state[pityKey] or {}
                        local divine = tonumber(pity.Divine or 0)
                        local secret = tonumber(pity.Secret or 0)
                        local mythic = tonumber(pity.Mythical or 0)
                        status = string.format("Gacha Pity: D[%d/40k] S[%d/12.5k] M[%d/2k]", divine, secret, mythic)
                    end
                else
                    status = "VOID WALKER"
                end
                Window:SetProfileDesc(status)
            end)
            task.wait(1)
        end
    end)

    local logs = {}
    local function AddLog(msg)
        table.insert(logs, 1, "[" .. os.date("%X") .. "] " .. msg)
        if #logs > 5 then table.remove(logs, 6) end
        if state.TimeDilationLog then
            state.TimeDilationLog:Set(table.concat(logs, "\n"))
        end
    end

    local FarmSec = CombatTab:AddSection({Name = "<b><font color='#FFFFFF' size='24'>Master Farm</font></b>"})
    
    local controlRow = FarmSec:AddRow({Columns = 2})
    getgenv().MasterFarmToggle = controlRow[1]:AddToggle({
        Name = "⚔️ Farm", Default = state.Farm, Callback = function(v) 
            state.Farm = v 
            getgenv().Nebu_Persistence.Farm = v
        end
    })
    controlRow[2]:AddButton({
        Name = "🔍 Scan Targets",
        Callback = function()
            local enemies = UpdateScanner()
            local zone = GetCurrentZone()
            local zoneName = zone and zone.Name or "Unknown Area"
            Window:Notify({Title = "Scanner", Content = "Found " .. #enemies .. " targets in " .. zoneName, Type = "success"})
        end
    })

    local dropdownRow = FarmSec:AddRow({Columns = 2})
    state.PriorityDropdownReference = dropdownRow[1]:AddDropdown({
        Name = "🎯 Priority", Options = {"None"}, Default = "None", Multi = false, Callback = function(v) state.PriorityTargetName = v end
    })

    state.SecondaryDropdownReference = dropdownRow[2]:AddDropdown({
        Name = "🛡️ Secondary", Options = {"All"}, Default = {"All"}, Multi = true, Callback = function(v) state.SecondaryTargetNames = v end
    })




    local function AddGamemodeModule(config)
        local title = config.Title or "Unknown"
        local stateKey = config.StateKey
        local bannerImage = config.Icon or "rbxassetid://132736622789289"
        local hasUpgrades = config.UpgradeKey ~= nil
        
        -- Main Banner Toggle
        local banner = nil
        local function UpdateBannerTitle()
            if not banner then return end
            local status = state[stateKey] and "<font color='#00FF00'>[ENABLED]</font>" or "<font color='#FF0000'>[DISABLED]</font>"
            local name = config.CustomTitle or string.format("<b><font color='%s' size='26'>Auto %s</font></b>", config.Color or "#FFFFFF", title)
            local fullTitle = name .. " " .. status

            pcall(function()
                if banner.SetTitle then banner:SetTitle(fullTitle)
                elseif banner.SetText then banner:SetText(fullTitle)
                elseif banner.SetName then banner:SetName(fullTitle)
                elseif banner:FindFirstChild("Title") then banner.Title.Text = fullTitle
                elseif banner:FindFirstChild("Label") then banner.Label.Text = fullTitle
                end
            end)
        end

        banner = config.Section:AddBanner({
            Title = "", -- Set via update
            Image = bannerImage,
            Callback = function()
                state[stateKey] = not state[stateKey]
                UpdateBannerTitle()
                if Window then
                    Window:Notify({
                        Title = title,
                        Content = "Automation " .. (state[stateKey] and "Enabled" or "Disabled"),
                        Type = state[stateKey] and "success" or "info"
                    })
                end
            end
        })
        UpdateBannerTitle()
        
        -- Row 1: Sub-Options
        local row1 = config.Section:AddRow({Columns = 2})
        row1[1]:AddToggle({
            Name = "<font color='#FF7700'>Return to Farm</font>",
            Default = state[config.ReturnKey] or false,
            Callback = function(v) state[config.ReturnKey] = v end
        })
        
        if hasUpgrades then
            row1[2]:AddToggle({
                Name = "<font color='#FF7700'>Auto Upgrades</font>",
                Default = state[config.UpgradeKey],
                Callback = function(v) state[config.UpgradeKey] = v end
            })
        end
        
        -- Row 2: Wave Control
        local row2 = config.Section:AddRow({Columns = 2})
        row2[1]:AddLabel({Title = "📑 Leave at Wave:", Content = ""})
        row2[2]:AddInput({
            Placeholder = "Wave #", 
            Default = math.floor(state[config.LeaveKey] or 0), 
            Callback = function(v) state[config.LeaveKey] = tonumber(v) or 0 end
        })

        config.Section:AddParagraph({Title = "", Content = ""}) -- Visual Padding
        return banner
    end

    local TowerSec = CombatTab:AddSection({Name = "Tower Raids"})
    
    local towerEasyToggle, towerMedToggle, easterToggle, wisteriaToggle, wandToggle


    local tRow1 = TowerSec:AddRow({Columns = 2})
    towerEasyToggle = tRow1[1]:AddToggle({ -- Assigned to variable
        Name = "<b>Raid (Easy)</b>", 
        Default = state.TowerRaid, 
        Callback = function(v) state.TowerRaid = v end
    })
    tRow1[2]:AddInput({
        Placeholder = "Leave Wave #", 
        Default = math.floor(state.TowerLeaveWave or 0), 
        Callback = function(v) state.TowerLeaveWave = tonumber(v) or 0 end
    })

    local tRow2 = TowerSec:AddRow({Columns = 2})
    towerMedToggle = tRow2[1]:AddToggle({ -- Assigned to variable
        Name = "<b>Raid (Medium)</b>", 
        Default = state.TowerRaidMedium, 
        Callback = function(v) state.TowerRaidMedium = v end
    })
    tRow2[2]:AddInput({
        Placeholder = "Leave Wave #", 
        Default = math.floor(state.TowerMediumLeaveWave or 0), 
        Callback = function(v) state.TowerMediumLeaveWave = tonumber(v) or 0 end
    })

    local tRow3 = TowerSec:AddRow({Columns = 2})
    tRow3[1]:AddToggle({
        Name = "<b>Auto Return</b>", 
        Default = state.AutoReturnToSpot, 
        Callback = function(v) 
            state.AutoReturnToSpot = v 
            if getgenv().Nebu_Persistence then getgenv().Nebu_Persistence.AutoReturnToSpot = v end
        end
    })
    tRow3[2]:AddButton({
        Name = "Save Position",
        Callback = function() 
            SaveOriginPosition()
            Window:Notify({Title = "Raid", Content = "Return position saved!", Type = "success"})
        end
    })

    -- [ TOWER RAID AUTOMATION BACKGROUND LOOP ]
    task.spawn(function()
        local remotes = ReplicatedStorage:WaitForChild("Remotes", 5)
        if not remotes then return end
        
        local function HandleInvite(isMedium)
            if (isMedium and state.TowerRaidMedium) or (not isMedium and state.TowerRaid) then
                pcall(function()
                    local data = GetPlayerData()
                    local lastArea = tostring(data.LastArea or "")
                    local inRaid = lastArea:find("Raid") and not lastArea:find("Tower")
                    
                    if inRaid then
                        remotes.LeaveRaid:FireServer()
                        task.wait(1)
                    end
                    
                    -- [CACHE & PRIORITY FIX]: Save farm state before teleporting
                    if state.Farm then state.CachedFarmState = true end
                    state.Farm = false
                    state.IsTeleporting = true
                    state.CurrentTarget = nil
                    CurrentAreaName = ""
                    CurrentEnemyContainer = nil
                    
                    SaveOriginPosition()
                    
                    if isMedium then
                        remotes.JoinMediumTowerRaid:FireServer()
                    else
                        remotes.JoinTowerRaid:FireServer()
                    end
                end)
            end
        end

        local invite = remotes:FindFirstChild("TowerRaidInvite")
        if invite then
            trackConnection(invite.OnClientEvent:Connect(function() HandleInvite(false) end))
        end

        local mediumInvite = remotes:FindFirstChild("MediumTowerRaidInvite")
        if mediumInvite then
            trackConnection(mediumInvite.OnClientEvent:Connect(function() HandleInvite(true) end))
        end

        while state.Nebublox_Running do
            -- [ GLOBAL UNIFIED WAVE EXIT LOGIC ]
            local currentWave = GetCurrentWave()
            local zone = GetCurrentZone()
            local zoneName = zone and zone.Name or ""
            
            if currentWave > 0 then
                local leaveThreshold = 0
                
                if zoneName:lower():find("tower") or zoneName:lower():find("trial") then
                    leaveThreshold = (zoneName:lower():find("medium") or zoneName:lower():find("tower2")) and state.TowerMediumLeaveWave or state.TowerLeaveWave
                elseif zoneName:lower():find("easter") then
                    leaveThreshold = state.EasterRaidLeaveWave
                elseif zoneName:lower():find("wisteria") then
                    leaveThreshold = state.WisteriaLeaveWave
                elseif zoneName:lower():find("wandenreich") or zoneName:lower():find("leveling") then
                    leaveThreshold = state.WandenreichLeaveWave
                elseif zoneName:lower():find("gate") or zoneName:lower():find("double") then
                    leaveThreshold = state.GateRaidLeaveWave
                end
                
                if leaveThreshold > 0 and currentWave >= leaveThreshold then

                    -- 2. Suspend logic to prevent combat glitches during exit
                    state.Farm = false
                    state.IsTeleporting = true
                    state.CurrentTarget = nil
                    CurrentAreaName = ""
                    CurrentEnemyContainer = nil
                    
                    pcall(function() remotes.LeaveRaid:FireServer() end)
                    
                    -- 3. Handle Return and Resume via background thread
                    task.spawn(function()
                        task.wait(2) -- Wait for the initial LeaveRaid to process

                        if state.AutoReturnToSpot and state.SavedReturnWorld then
                            -- Map user-friendly names to internal Remote arguments
                            local worldMap = {
                                ["Planet Namek"] = "World1", ["Blackflag Kingdom"] = "World2", ["Clover Kingdom"] = "World3",
                                ["Slayer Town"] = "World4", ["Ghoul City"] = "World5", ["Wandenreich"] = "World6",
                                ["Inferno City"] = "World7", ["Sorcerer High"] = "World8", ["Double Dungeons"] = "World9",
                                ["Leaf Village"] = "World10", ["Shiganzina"] = "World11"
                            }
                            local targetWorld = worldMap[state.SavedReturnWorld] or state.SavedReturnWorld

                            -- [FIX]: Fire the Teleport remote sniffer detected to load the correct world map
                            pcall(function()
                                ReplicatedStorage.Remotes.Teleport:FireServer(targetWorld)
                            end)

                            task.wait(6) -- Buffer to allow the new world to stream in and character to spawn

                            -- Now safely apply the CFrame offset to return to the exact spot
                            if state.SavedReturnPos then
                                local char = player.Character
                                local root = char and char:FindFirstChild("HumanoidRootPart")
                                if root then
                                    SafeTeleport(state.SavedReturnPos)
                                    task.wait(1)
                                end
                            end
                        else
                            task.wait(4) -- Standard wait if not auto-returning
                        end
                        
                        UpdateScanner()
                        state.IsTeleporting = false
                        
                        -- 4. Restore Farm if it was cached
                        if state.CachedFarmState then
                            state.Farm = true
                            state.CachedFarmState = false -- Clear cache
                            if getgenv().MasterFarmToggle then getgenv().MasterFarmToggle:Set(true) end
                            if getgenv().NebubloxWindow then 
                                getgenv().NebubloxWindow:Notify({Title = "Resumed", Content = "Returned from Gamemode. Overworld Auto-Farm Resumed.", Type = "success"}) 
                            end
                        end
                    end)
                end
            end

            if state.TowerRaid or state.TowerRaidMedium then
                pcall(function()
                    local time = os.date("!*t")
                    local joinEasy = (time.min == 0 or time.min == 30) and time.sec <= 5 and state.TowerRaid
                    local joinMedium = (time.min == 15 or time.min == 45) and time.sec <= 5 and state.TowerRaidMedium
                    
                    if joinEasy or joinMedium then
                        -- Cache farm and force priority override
                        if state.Farm then state.CachedFarmState = true end
                        state.Farm = false
                        state.IsTeleporting = true
                        state.CurrentTarget = nil
                        CurrentAreaName = ""
                        CurrentEnemyContainer = nil
                        
                        SaveOriginPosition()
                        
                        if joinMedium then
                            remotes.JoinMediumTowerRaid:FireServer()
                        else
                            remotes.JoinTowerRaid:FireServer()
                        end
                        
                        task.wait(6) -- Prevent spamming during the 5-second window
                    end
                end)
            end
            task.wait(1)
        end
    end)
    


    local EasterRaidSec = CombatTab:AddSection({Name = "Easter Raid"})
    easterToggle = EasterRaidSec:AddToggle({
        Name = "Easter Raid", Default = state.EasterRaid, Icon = "rbxassetid://79614525607702",
        Callback = function(v)
            if v then
                if wisteriaToggle then wisteriaToggle:Set(false) end
                if wandToggle then wandToggle:Set(false) end
                state.WisteriaRaid = false
                state.WandenreichRaid = false
            end
            state.EasterRaid = v
            if v then
                task.spawn(function()
                    while state.EasterRaid and state.Nebublox_Running do
                        if GetCurrentWave() == 0 then
                            state.Farm = false
                            state.IsTeleporting = true
                            state.CurrentTarget = nil
                            CurrentEnemyContainer = nil
                            pcall(function()
                                local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                                if state.EasterKeys > 0 then remotes.OpenEasterRaid:FireServer() end
                                for _, lobby in ipairs(state.EasterLobbies or {}) do
                                    if lobby.PlayerCount < lobby.MaxPlayers then
                                        remotes.JoinEasterRaid:FireServer(lobby.SlotName)
                                        break
                                    end
                                end
                            end)
                        end
                        task.wait(2)
                    end
                end)
            end
        end
    })
    local eRow2 = EasterRaidSec:AddRow({Columns = 2})
    eRow2[1]:AddToggle({
        Name = "Auto Return", Default = state.AutoReturnToSpot,
        Callback = function(v) state.AutoReturnToSpot = v end
    })
    eRow2[2]:AddButton({
        Name = "Save Position",
        Callback = function() 
            SaveOriginPosition()
            Window:Notify({Title = "Location Saved", Content = "Will return here after Easter Raid.", Type = "success"})
        end
    })

    local eRow = EasterRaidSec:AddRow({Columns = 2})
    eRow[1]:AddInput({
        Placeholder = "Leave Wave #", Default = math.floor(state.EasterRaidLeaveWave or 0),
        Callback = function(v) state.EasterRaidLeaveWave = tonumber(v) or 0 end
    })
    eRow[2]:AddButton({
        Name = "Max Wave",
        Callback = function() 
            pcall(function() ReplicatedStorage.Remotes.OpenMaxWaveEasterRaid:FireServer() end) 
            Window:Notify({Title = "Raid", Content = "Entering Easter Max Wave...", Type = "success"})
        end
    })

    task.spawn(function()
        local remotes = ReplicatedStorage:FindFirstChild("Remotes")
        if not remotes then return end

        local function checkKeys(data)
            for _, item in pairs(data.Items or {}) do
                if item.Name == "WisteriaRaid_Key" then
                    state.WisteriaKeys = item.Amount or 0
                elseif item.Name == "EasterRaid_Key" then
                    state.EasterKeys = item.Amount or 0
                elseif item.Name == "GateRaid_Key" then
                    state.GateRaidKeys = item.Amount or 0
                end
            end
        end

        local data = GetPlayerData()
        checkKeys(data)
        state.WisteriaMaxWave = data.MaxWaves and data.MaxWaves.WisteriaRaid or 0
        state.EasterMaxWave = data.MaxWaves and data.MaxWaves.EasterRaid or 0
        state.GateRaidMaxWave = data.MaxWaves and data.MaxWaves.GateRaid or 0

        trackConnection(remotes.UpdateMaxWaves.OnClientEvent:Connect(function(raid, wave)
            if raid == "WisteriaRaid" then
                state.WisteriaMaxWave = wave
            elseif raid == "EasterRaid" then
                state.EasterMaxWave = wave
            elseif raid == "GateRaid" then
                state.GateRaidMaxWave = wave
            end
        end))

        trackConnection(remotes.Items.UpdateItem.OnClientEvent:Connect(function()
            local updatedData = GetPlayerData()
            pcall(function() checkKeys(updatedData) end)
        end))

        trackConnection(remotes.RaidLobbyUpdate.OnClientEvent:Connect(function(raid, lobbies)
            if raid == "WisteriaRaid" then
                state.WisteriaLobbies = lobbies
            elseif raid == "EasterRaid" then
                state.EasterLobbies = lobbies
            elseif raid == "WandenreichRaid" then
                state.WandenreichLobbies = lobbies
            elseif raid == "GateRaid" then
                state.GateRaidLobbies = lobbies
            end
        end))

    end)

    local WisteriaSec = CombatTab:AddSection({Name = "Wisteria Raid"})
    wisteriaToggle = WisteriaSec:AddToggle({
        Name = "Wisteria Raid", Default = state.WisteriaRaid, Icon = "rbxassetid://136880526394753",
        Callback = function(v)
            if v then
                if easterToggle then easterToggle:Set(false) end
                if wandToggle then wandToggle:Set(false) end
                state.EasterRaid = false
                state.WandenreichRaid = false
            end
            state.WisteriaRaid = v
            if v then
                task.spawn(function()
                    while state.WisteriaRaid and state.Nebublox_Running do
                        if GetCurrentWave() == 0 then
                            state.Farm = false
                            state.IsTeleporting = true
                            state.CurrentTarget = nil
                            CurrentEnemyContainer = nil
                            pcall(function()
                                local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                                if state.WisteriaKeys > 0 then remotes.OpenWisteriaRaid:FireServer() end
                                for _, lobby in ipairs(state.WisteriaLobbies or {}) do
                                    if lobby.PlayerCount < lobby.MaxPlayers then
                                        remotes.JoinWisteriaRaid:FireServer(lobby.SlotName)
                                        break
                                    end
                                end
                            end)
                        end
                        task.wait(2)
                    end
                end)
            end
        end
    })
    local wRow2 = WisteriaSec:AddRow({Columns = 2})
    wRow2[1]:AddToggle({
        Name = "Auto Return", Default = state.AutoReturnToSpot,
        Callback = function(v) state.AutoReturnToSpot = v end
    })
    wRow2[2]:AddButton({
        Name = "Save Position",
        Callback = function() 
            SaveOriginPosition()
            Window:Notify({Title = "Location Saved", Content = "Will return here after Wisteria Raid.", Type = "success"})
        end
    })

    local wRow = WisteriaSec:AddRow({Columns = 2})
    wRow[1]:AddInput({
        Placeholder = "Leave Wave #", Default = math.floor(state.WisteriaLeaveWave or 0),
        Callback = function(v) state.WisteriaLeaveWave = tonumber(v) or 0 end
    })
    wRow[2]:AddButton({
        Name = "Max Wave",
        Callback = function() 
            pcall(function() ReplicatedStorage.Remotes.OpenMaxWaveWisteriaRaid:FireServer() end)
            Window:Notify({Title = "Raid", Content = "Entering Wisteria Max Wave...", Type = "success"})
        end
    })

    local WandSec = CombatTab:AddSection({Name = "Wandenreich Raid"})
    wandToggle = WandSec:AddToggle({
        Name = "Wandenreich Raid", Default = state.WandenreichRaid, Icon = "rbxassetid://92495396538459",
        Callback = function(v)
            if v then
                if easterToggle then easterToggle:Set(false) end
                if wisteriaToggle then wisteriaToggle:Set(false) end
                state.EasterRaid = false
                state.WisteriaRaid = false
            end
            state.WandenreichRaid = v
            if v then
                task.spawn(function()
                    while state.WandenreichRaid and state.Nebublox_Running do
                        if GetCurrentWave() == 0 then
                            state.Farm = false
                            state.IsTeleporting = true
                            state.CurrentTarget = nil
                            CurrentEnemyContainer = nil
                            pcall(function()
                                local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                                remotes.OpenWandenreichRaid:FireServer()
                                for _, lobby in ipairs(state.WandenreichLobbies or {}) do
                                    if lobby.PlayerCount < lobby.MaxPlayers then
                                        remotes.JoinWandenreichRaid:FireServer(lobby.SlotName)
                                        break
                                    end
                                end
                            end)
                        end
                        task.wait(2)
                    end
                end)
            end
        end
    })
    local wandRow2 = WandSec:AddRow({Columns = 2})
    wandRow2[1]:AddToggle({
        Name = "Auto Return", Default = state.AutoReturnToSpot,
        Callback = function(v) state.AutoReturnToSpot = v end
    })
    wandRow2[2]:AddButton({
        Name = "Save Position",
        Callback = function() 
            SaveOriginPosition()
            Window:Notify({Title = "Location Saved", Content = "Will return here after Wandenreich Raid.", Type = "success"})
        end
    })

    local wandRow = WandSec:AddRow({Columns = 2})
    wandRow[1]:AddInput({
        Placeholder = "Leave Wave #", Default = math.floor(state.WandenreichLeaveWave or 0),
        Callback = function(v) state.WandenreichLeaveWave = tonumber(v) or 0 end
    })
    wandRow[2]:AddButton({
        Name = "Max Wave",
        Callback = function() 
            pcall(function() ReplicatedStorage.Remotes.OpenMaxWaveWandenreichRaid:FireServer() end)
            Window:Notify({Title = "Raid", Content = "Entering Wandenreich Max Wave...", Type = "success"})
        end
    })

    local GateRaidSec = CombatTab:AddSection({Name = "Gate Raid"})
    local gateRaidToggle
    gateRaidToggle = GateRaidSec:AddToggle({
        Name = "Gate Raid", Default = state.GateRaid, Icon = "rbxassetid://105619415096213",
        Callback = function(v)
            state.GateRaid = v
            if v then
                task.spawn(function()
                    while state.GateRaid and state.Nebublox_Running do
                        if GetCurrentWave() == 0 then
                            state.Farm = false
                            state.IsTeleporting = true
                            state.CurrentTarget = nil
                            CurrentEnemyContainer = nil
                            pcall(function()
                                local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                                if state.GateRaidKeys > 0 then remotes.OpenGateRaid:FireServer() end
                                for _, lobby in ipairs(state.GateRaidLobbies or {}) do
                                    if lobby.PlayerCount < lobby.MaxPlayers then
                                        remotes.JoinGateRaid:FireServer(lobby.SlotName)
                                        break
                                    end
                                end
                            end)
                        end
                        task.wait(2)
                    end
                end)
            end
        end
    })
    local grRow2 = GateRaidSec:AddRow({Columns = 2})
    grRow2[1]:AddToggle({
        Name = "Auto Return", Default = state.AutoReturnToSpot,
        Callback = function(v) state.AutoReturnToSpot = v end
    })
    grRow2[2]:AddButton({
        Name = "Save Position",
        Callback = function() 
            SaveOriginPosition()
            Window:Notify({Title = "Location Saved", Content = "Will return here after Gate Raid.", Type = "success"})
        end
    })

    local grRow = GateRaidSec:AddRow({Columns = 2})
    grRow[1]:AddInput({
        Placeholder = "Leave Wave #", Default = math.floor(state.GateRaidLeaveWave or 0),
        Callback = function(v) state.GateRaidLeaveWave = tonumber(v) or 0 end
    })
    grRow[2]:AddButton({
        Name = "Max Wave",
        Callback = function() 
            pcall(function() ReplicatedStorage.Remotes.OpenMaxWaveGateRaid:FireServer() end)
            Window:Notify({Title = "Raid", Content = "Entering Gate Max Wave...", Type = "success"})
        end
    })
    local AnimeLevelingBanners = {
        ["Planet Namek"]       = "rbxassetid://92807971625808",
        ["Blackflag Kingdom"]  = "rbxassetid://137390991563554",
        ["Clover Kingdom"]     = "rbxassetid://110010172324719",
        ["Slayer Town"]        = "rbxassetid://111712858676482",
        ["Ghoul City"]         = "rbxassetid://105465496502732",
        ["Wandenreich"]        = "rbxassetid://74866609640387",
        ["Inferno City"]       = "rbxassetid://134391516786914",
        ["Sorcerer High"]      = "rbxassetid://104880101054332",
        ["Double Dungeons"]    = "rbxassetid://129168002259433",
        ["Leaf Village"]    = "rbxassetid://99913762752245",
        ["Shiganzina"]    = "rbxassetid://111719049129662",
        ["Bizzare Town"]    = "rbxassetid://134146330419711"
    }

    local function CreateWorldBanner(name)
        WorldTab:AddBanner({
            Title = name,
            Image = AnimeLevelingBanners[name] or "",
            Callback = function() TeleportToWorld(name) end
        })
    end

    CreateWorldBanner("Planet Namek")
    local NamekSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(NamekSec, "W1E", "Star Hatch", "Star1", "rbxassetid://121506071490418")
    CreateAdvancedGacha(NamekSec, "Easter Powers", "EasterPower", "rbxassetid://112995253336454")
    CreateAdvancedGacha(NamekSec, "Saiyan Powers", "SaiyanPower", "rbxassetid://93947167224281")
    CreateAdvancedGacha(NamekSec, "Dragon Ball Powers", "DragonBallPower", "rbxassetid://73269058908160")
    CreateLevelingSys(NamekSec, "Easter Basket Leveling", "EasterBasketLeveling", "rbxassetid://86399507967539", 200)

    CreateWorldBanner("Blackflag Kingdom")
    local BlackflagSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(BlackflagSec, "W2E", "Star Hatch", "Star2", "rbxassetid://121506071490418")
    CreateAdvancedGacha(BlackflagSec, "Fruit Powers", "FruitPower", "rbxassetid://128400264010998")
    CreateAdvancedGacha(BlackflagSec, "Blessed Powers", "BlessingPower", "rbxassetid://106004776931997")
    CreateAdvancedGacha(BlackflagSec, "Easy Artifact Powers", "EasyArtifactPower", "rbxassetid://83290096032194")
    CreateLevelingSys(BlackflagSec, "Haki Leveling", "Haki", "rbxassetid://104063337770400", 100)
    CreateLevelingSys(BlackflagSec, "Bounty Ranks", "BountyRank", "rbxassetid://79434221872906", 9, "Bounty")

    CreateWorldBanner("Clover Kingdom")
    local CloverSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(CloverSec, "W3E", "Star Hatch", "Star3", "rbxassetid://121506071490418")
    CreateAdvancedGacha(CloverSec, "Grimoires Powers", "GrimoiresPower", "rbxassetid://134062378557602")
    CreateAdvancedGacha(CloverSec, "Demon Powers", "DemonPower", "rbxassetid://138411816034621")
    CreateAdvancedGacha(CloverSec, "Prosperity Powers", "ProsperityPower", "rbxassetid://125548403919823")
    CreateAdvancedGacha(CloverSec, "Mana Powers", "ManaPower", "rbxassetid://138133441437958")
    CreateLevelingSys(CloverSec, "Energy Totem", "EnergyTotem", "rbxassetid://73230360832665", 100)

    CreateWorldBanner("Slayer Town")
    local SlayerSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(SlayerSec, "W4E", "Star Hatch", "Star3", "rbxassetid://121506071490418")
    CreateAdvancedGacha(SlayerSec, "Breathing Powers", "BreathingPower", "rbxassetid://119501689465671")
    CreateAdvancedGacha(SlayerSec, "Hashira Powers", "HashiraPower", "rbxassetid://121133620080231", "Divine")
    CreateLevelingSys(SlayerSec, "Blood Art Leveling", "BloodArt", "rbxassetid://125586763398260", 200)
    CreateLevelingSys(SlayerSec, "Wisteria Leveling", "Wisteria", "rbxassetid://100632941105542", 100)
    CreateLevelingSys(SlayerSec, "Damage Totem", "DamageTotem", "rbxassetid://73230360832665", 100)

    CreateWorldBanner("Ghoul City")
    local GhoulCitySec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(GhoulCitySec, "W5E", "Star Hatch", "Star5", "rbxassetid://121506071490418")
    CreateAdvancedGacha(GhoulCitySec, "Mask Powers", "MaskPower", "rbxassetid://92355187394790")
    CreateAdvancedGacha(GhoulCitySec, "Cell Powers", "CellPower", "rbxassetid://107589189704039", "Secret")
    CreateLevelingSys(GhoulCitySec, "Kagune Leveling", "Kagune", "rbxassetid://78606737364087", 200)
    CreateLevelingSys(GhoulCitySec, "Exchange Leveling", "ExchangeLeveling", "rbxassetid://98099676901664", 100)
    CreateLevelingSys(GhoulCitySec, "CCG Ranks", "CCGRank", "rbxassetid://90456115533168", 9, "CCG")

    CreateWorldBanner("Wandenreich")
    local WandSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(WandSec, "W6E", "Star Hatch", "Star6", "rbxassetid://121506071490418")
    CreateAdvancedGacha(WandSec, "Race Powers", "RacePower", "rbxassetid://75616372903410")
    CreateAdvancedGacha(WandSec, "Bankai Powers", "BankaiPower", "rbxassetid://102708281846254")
    CreateAdvancedGacha(WandSec, "Exchange Powers", "ExchangePower", "rbxassetid://98099676901664")
    CreateLevelingSys(WandSec, "Manipulation Tiers", "ManipulationRank", "rbxassetid://84191914199118", 100, "Secret")
    CreateLevelingSys(WandSec, "Spiritual Leveling", "Spiritual", "rbxassetid://98263884778128", 200)

    CreateWorldBanner("Inferno City")
    local InfernoSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(InfernoSec, "W7E", "Star Hatch", "Star7", "rbxassetid://121506071490418")
    CreateAdvancedGacha(InfernoSec, "Divisions Powers", "DivisionsPower", "rbxassetid://133296502897681")
    CreateAdvancedGacha(InfernoSec, "Pyrokenetic Powers", "PyrokeneticPower", "rbxassetid://123504334094786", "Divine")
    CreateLevelingSys(InfernoSec, "Shiny Leveling", "ShinyLeveling", "rbxassetid://138543399915961", 200)
    CreateLevelingSys(InfernoSec, "Exchange Ranks", "ExchangeRank", "rbxassetid://98099676901664", 10, "Exchange")
    CreateLevelingSys(InfernoSec, "Ignition Ranks", "IgnitionRank", "rbxassetid://111396920522281", 9, "Ignition") 
    CreateLevelingSys(InfernoSec, "Hoarder Ranks", "HoarderRank", "rbxassetid://103743251806617", 10, "Hoarder")

    CreateWorldBanner("Sorcerer High")
    local SorcererSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(SorcererSec, "W8E", "Star Hatch", "Star8", "rbxassetid://121506071490418")
    CreateAdvancedGacha(SorcererSec, "Technique Powers", "TechniquePower", "rbxassetid://70917412780455", "Divine")
    CreateAdvancedGacha(SorcererSec, "Medium Artifact Powers", "MediumArtifactPower", "rbxassetid://96564739309706")
    CreateLevelingSys(SorcererSec, "Finger Ranks", "Finger", "rbxassetid://103398770364674", 20)
    CreateLevelingSys(SorcererSec, "Shikigami Ranks", "ShikigamiRank", "rbxassetid://118371060800334", 9, "Shikigami")
    CreateLevelingSys(SorcererSec, "Cursed Leveling", "CursedLeveling", "rbxassetid://121682527329521", 300)

    CreateWorldBanner("Double Dungeons")
    local DoubleDungeonSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(DoubleDungeonSec, "W9E", "Star Hatch", "Star9", "rbxassetid://121506071490418")
    CreateAdvancedGacha(DoubleDungeonSec, "Hunter Powers", "HunterPower", "rbxassetid://113213799158503", "Divine")
    CreateLevelingSys(DoubleDungeonSec, "Essence Ranks", "EssenceRank", "rbxassetid://72600908242528", 10)
    CreateLevelingSys(DoubleDungeonSec, "Shadow Leveling", "ShadowLeveling", "rbxassetid://124476471937382", 300)
    CreateLevelingSys(DoubleDungeonSec, "Gate Leveling", "GateLeveling", "rbxassetid://132437852551904", 300)
    
    CreateWorldBanner("Leaf Village")
    local LeafVillageSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(LeafVillageSec, "W10E", "Star Hatch", "Star10", "rbxassetid://121506071490418")
    CreateAdvancedGacha(LeafVillageSec, "Chakra Powers", "ChakraPower", "rbxassetid://136191915007825", "Divine")
    CreateLevelingSys(LeafVillageSec, "Fire Leveling", "FireLeveling", "rbxassetid://107457758073821", 300)
    CreateLevelingSys(LeafVillageSec, "Lightning Leveling", "LightningLeveling", "rbxassetid://76026113328279", 300)
    CreateLevelingSys(LeafVillageSec, "Water Leveling", "WaterLeveling", "rbxassetid://78099174538262", 300)
    CreateLevelingSys(LeafVillageSec, "Nature Leveling", "NatureLeveling", "rbxassetid://80178611504602", 300)
    CreateLevelingSys(LeafVillageSec, "Shiny Totem", "ShinyTotem", "rbxassetid://127501776807325", 100)
    
    CreateWorldBanner("Shiganzina")
    local ShiganzinaSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(ShiganzinaSec, "W11E", "Star Hatch", "Star11", "rbxassetid://121506071490418")
    CreateLevelingSys(ShiganzinaSec, "Serum Tiers", "SerumRank", "rbxassetid://109931367581044", 11, "Secret")
    CreateAdvancedGacha(ShiganzinaSec, "Scout Powers", "ScoutPower", "rbxassetid://101865080018238", "Divine")
    CreateAdvancedGacha(ShiganzinaSec, "Titan Powers", "TitanPower", "rbxassetid://93422093754764", "Divine")

    CreateWorldBanner("Bizzare Town")
    local BizzareSec = WorldTab:AddSection({Name = ""})
    CreateHatchToggle(BizzareSec, "W12E", "Star Hatch", "Star12", "rbxassetid://121506071490418")
    CreateAdvancedGacha(BizzareSec, "Stand Powers", "StandPower", "rbxassetid://119565311782464", "Divine")
    CreateLevelingSys(BizzareSec, "Ripple Leveling", "RippleLeveling", "rbxassetid://125644739238021", 400)
    
    local UpdateBanner = WorldTab:AddBanner({
        Title = "SESSION: 00:00:00 | UPDATE: 0d 0h 0m",
        Image = "rbxassetid://11419713437",
        Callback = function() end
    })

    task.spawn(function()
        local updateTime = os.time() + (44 * 3600) -- Updated to 44 hours from now
        while state.Nebublox_Running do
            pcall(function()
                local now = os.time()
                local diff = updateTime - now
                local elapsed = tick() - (state.StartTime or tick())
                
                local s_h = math.floor(elapsed / 3600)
                local s_m = math.floor((elapsed % 3600) / 60)
                local s_s = math.floor(elapsed % 60)
                
                local u_d = math.floor(diff / 86400)
                local u_h = math.floor((diff % 86400) / 3600)
                local u_m = math.floor((diff % 3600) / 60)
                
                local title = string.format("SESSION: %02d:%02d:%02d | UPDATE: %dd %dh %dm", s_h, s_m, s_s, u_d, u_h, u_m)
                if diff <= 0 then title = string.format("SESSION: %02d:%02d:%02d | UPDATE IS LIVE, UDATING SCRIPT NOW!", s_h, s_m, s_s) end
                
                if UpdateBanner.SetTitle then UpdateBanner:SetTitle(title)
                elseif UpdateBanner.SetName then UpdateBanner:SetName(title)
                end
            end)
            task.wait(1)
        end
    end)

    local AllocSec = AutoTab:AddSection({Name = "Stats Allocation", Icon = "rbxassetid://81881130527730", Color = Color3.fromRGB(255, 100, 200)})
    local function UpdateStatsToTrain(stat, active)
        local foundIndex = nil
        for i, s in ipairs(state.StatsToTrain) do if s:find(stat) then foundIndex = i break end end
        if active and not foundIndex then table.insert(state.StatsToTrain, stat)
        elseif not active and foundIndex then table.remove(state.StatsToTrain, foundIndex) end
    end
    AllocSec:AddToggle({Name = "Energy", Default = false, Icon = "rbxassetid://103004839683203", Color = Color3.fromRGB(85, 153, 255), Callback = function(v) UpdateStatsToTrain("Energy", v) end})
    AllocSec:AddToggle({Name = "Damage", Default = false, Icon = "rbxassetid://95743292179737", Color = Color3.fromRGB(255, 68, 68), Callback = function(v) UpdateStatsToTrain("Damage", v) end})
    AllocSec:AddToggle({Name = "Coins", Default = false, Icon = "rbxassetid://73292391919105", Color = Color3.fromRGB(255, 170, 0), Callback = function(v) UpdateStatsToTrain("Coins", v) end})
    AllocSec:AddToggle({Name = "Luck", Default = false, Icon = "rbxassetid://138099668525570", Color = Color3.fromRGB(119, 255, 34), Callback = function(v) UpdateStatsToTrain("Luck", v) end})
    AllocSec:AddButton({
        Name = "Reset 🔄 Stats", 
        Rainbow = true,
        Callback = function() 
            pcall(function() ReplicatedStorage.Remotes.StatReset:FireServer() end)
            AddLog("Reset Character Stats")
            Window:Notify({Title = "Status", Content = "Stats Successfully Reset!", Type = "success"})
        end
    })

    local PotionSec = PotTab:AddSection({Name = "Elixiring at ease... (⚠️ USES ALL)"})
    local function CreatePotionToggle(section, name, typeKey, assetId)
        local iconStr = ""
        if assetId then
            local strId = tostring(assetId)
            local num = strId:match("%d+")
            iconStr = num and ("rbxassetid://" .. num) or ""
        end
        section:AddToggle({
            Name = name, Default = false, Icon = iconStr,
            Callback = function(v)
                state["Auto" .. typeKey] = v
                if v then
                    task.spawn(function()
                        while state["Auto" .. typeKey] and state.Nebublox_Running do
                            pcall(function()
                                local data = GetPlayerData()
                                local items = data.Items or {}
                                local targetUUID = nil
                                for uuid, item in pairs(items) do
                                    if item.Type == "Potion" and (item.Name:lower():find(name:lower()) or item.Name:lower():find(typeKey:lower())) then
                                        targetUUID = uuid
                                        break
                                    end
                                end
                                if targetUUID then ReplicatedStorage.Remotes.Items.UseItem:FireServer(targetUUID, 1) end
                            end)
                            task.wait(10)
                        end
                    end)
                end
            end
        })
    end
    CreatePotionToggle(PotionSec, "Damage", "Damage", "rbxassetid://114449781765728")
    CreatePotionToggle(PotionSec, "Drop", "Drop", "rbxassetid://108040804037940")
    CreatePotionToggle(PotionSec, "Energy", "Energy", "rbxassetid://126120677124626")
    CreatePotionToggle(PotionSec, "Luck", "Luck", "rbxassetid://117730628347852")
    CreatePotionToggle(PotionSec, "XP", "XP", "rbxassetid://101659962844786")
    CreatePotionToggle(PotionSec, "Coins", "Coins", "rbxassetid://130833949379239")



    Window:Notify({Title = "System", Content = "Anime Leveling Fully Loaded!", Type = "info"})
    state.Initialized = true
    if Window and Window.Notify then
        Window:Notify({Title = "System", Content = "Anime Leveling v6.1 Initialized", Type = "success"})
    end

    task.spawn(function()
        local lastCodeCheck = 0
        while state.Nebublox_Running do
            pcall(function()
                if state.RollEasyArtifactPower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("RollEasyArtifactPower") then
                        remotes.RollEasyArtifactPower:FireServer()
                    end
                end

                if state.RollMediumArtifactPower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("RollMediumArtifactPower") then
                        remotes.RollMediumArtifactPower:FireServer()
                    end
                end

                if state.LvlCursedLeveling then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("CursedLeveling") then
                        remotes.CursedLeveling:FireServer()
                    end
                end

                if state.RollHunterPower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("RollHunterPower") then
                        remotes.RollHunterPower:FireServer("Divine")
                    end
                end

                if state.LvlShadowLeveling then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("ShadowLeveling") then
                        remotes.ShadowLeveling:FireServer()
                    end
                end

                if state.LvlCCGRank then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("CCGRank") then
                        remotes.CCGRank:FireServer()
                    end
                end

                if state.RollGrimoiresPower or state.RollGrimoires then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    local roll = remotes and (remotes:FindFirstChild("RollGrimoiresPower") or remotes:FindFirstChild("RollGrimoirePower"))
                    if roll then roll:FireServer("Mythical") end
                end

                if state.RollHashiraPower or state.RollHashira then
                    FireGachaRemote("Hashira", "Divine")
                end

                if state.RollDivisionsPower or state.RollDivisionPower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    local roll = remotes and (remotes:FindFirstChild("RollDivisionsPower") or remotes:FindFirstChild("RollDivisionPower"))
                    if roll then roll:FireServer("Mythical") end
                end

                if state.RollDemonPower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("RollDemonPower") then
                        remotes.RollDemonPower:FireServer("Mythical")
                    end
                end

                if state.RollProsperityPower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("RollProsperityPower") then
                        remotes.RollProsperityPower:FireServer("Mythical")
                    end
                end

                if state.RollBreathingPower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("RollBreathingPower") then
                        remotes.RollBreathingPower:FireServer("Mythical")
                    end
                end

                if state.LvlBloodArt then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("BloodArt") then
                        remotes.BloodArt:FireServer()
                    end
                end

                -- [ MASS INJECTION ] Silent World Powers
                local rems = ReplicatedStorage:FindFirstChild("Remotes")
                if rems then
                    if state.RollEasterPower and rems:FindFirstChild("RollEasterPower") then rems.RollEasterPower:FireServer("Mythical") end
                    if state.RollSaiyanPower and rems:FindFirstChild("RollSaiyanPower") then rems.RollSaiyanPower:FireServer("Mythical") end
                    if state.RollDragonBallPower and rems:FindFirstChild("RollDragonBallPower") then rems.RollDragonBallPower:FireServer("Mythical") end
                    if state.RollFruitPower and rems:FindFirstChild("RollFruitPower") then rems.RollFruitPower:FireServer("Mythical") end
                    if state.RollBlessingPower and rems:FindFirstChild("RollBlessingPower") then rems.RollBlessingPower:FireServer("Mythical") end
                    if state.LvlHaki and rems:FindFirstChild("Haki") then rems.Haki:FireServer() end
                    if state.LvlWisteria and rems:FindFirstChild("Wisteria") then rems.Wisteria:FireServer() end
                    if state.RollMaskPower and rems:FindFirstChild("RollMaskPower") then rems.RollMaskPower:FireServer("Mythical") end
                    if state.LvlKagune and rems:FindFirstChild("Kagune") then rems.Kagune:FireServer() end
                    if state.RollRacePower and rems:FindFirstChild("RollRacePower") then rems.RollRacePower:FireServer("Mythical") end
                    if state.RollBankaiPower and rems:FindFirstChild("RollBankaiPower") then rems.RollBankaiPower:FireServer("Mythical") end
                    if state.LvlSpiritual and rems:FindFirstChild("Spiritual") then rems.Spiritual:FireServer() end
                    if state.RollDivisionsPower and rems:FindFirstChild("RollDivisionsPower") then rems.RollDivisionsPower:FireServer("Mythical") end
                    if state.RollHashiraPower and rems:FindFirstChild("RollHashiraPower") then rems.RollHashiraPower:FireServer("Divine") end
                    if state.RollManaPower and rems:FindFirstChild("RollManaPower") then rems.RollManaPower:FireServer("Mythical") end
                    
                    -- World 8 & 9 Background Sync
                    if state.LvlShikigamiRank and rems:FindFirstChild("ShikigamiRank") then rems.ShikigamiRank:FireServer() end
                    if state.LvlEssenceRank and rems:FindFirstChild("EssenceRank") then rems.EssenceRank:FireServer() end
                    if state.LvlFinger and rems:FindFirstChild("Finger") then rems.Finger:FireServer() end
                    
                    -- World 10 Sync
                    if state.LvlFireLeveling and rems:FindFirstChild("FireLeveling") then rems.FireLeveling:FireServer() end
                    if state.LvlLightningLeveling and rems:FindFirstChild("LightningLeveling") then rems.LightningLeveling:FireServer() end
                    if state.LvlWaterLeveling and rems:FindFirstChild("WaterLeveling") then rems.WaterLeveling:FireServer() end
                    if state.LvlNatureLeveling and rems:FindFirstChild("NatureLeveling") then rems.NatureLeveling:FireServer() end
                    if state.LvlShinyTotem and rems:FindFirstChild("ShinyTotem") then rems.ShinyTotem:FireServer() end
                    if state.RollChakraPower and rems:FindFirstChild("RollChakraPower") then rems.RollChakraPower:FireServer("Divine") end

                    -- World 11 Sync
                    if state.RollSerumPower then
                        local roll = rems:FindFirstChild("SerumRank") or rems:FindFirstChild("RollSerumPower") or rems:FindFirstChild("RollSerum")
                        if roll then roll:FireServer("Secret") end
                    end
                    if state.RollScoutPower then
                        local roll = rems:FindFirstChild("RollScoutPower") or rems:FindFirstChild("RollScout")
                        if roll then roll:FireServer("Divine") end
                    end
                    if state.RollTitanPower then
                        local roll = rems:FindFirstChild("RollTitanPower") or rems:FindFirstChild("RollTitan")
                        if roll then roll:FireServer("Divine") end
                    end
                    if state.RollPyrokeneticPower then
                        local roll = rems:FindFirstChild("RollPyrokeneticPower") or rems:FindFirstChild("RollPyrokenetic")
                        if roll then roll:FireServer("Divine") end
                    end
                    if state.RollCellPower then
                        local roll = rems:FindFirstChild("RollCellPower") or rems:FindFirstChild("RollCell")
                        if roll then roll:FireServer("Secret") end
                    end

                    -- World 12 Sync
                    if state.RollStandPower then
                        local roll = rems:FindFirstChild("RollStandPower") or rems:FindFirstChild("RollStand")
                        if roll then roll:FireServer("Divine") end
                    end
                    if state.LvlRippleLeveling then
                        local roll = rems:FindFirstChild("RippleLeveling")
                        if roll then roll:FireServer() end
                    end
                end

                if state.LvlExchangeLeveling then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("ExchangeLeveling") then
                        remotes.ExchangeLeveling:FireServer()
                    end
                end

                if state.RollExchangePower then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("RollExchangePower") then
                        remotes.RollExchangePower:FireServer()
                    end
                end

                if state.LvlShinyLeveling then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("ShinyLeveling") then
                        remotes.ShinyLeveling:FireServer()
                    end
                end

                if state.LvlIgnitionRank then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("IgnitionRank") then
                        remotes.IgnitionRank:FireServer()
                    end
                end

                if state.LvlBountyRank then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("BountyRank") then
                        remotes.BountyRank:FireServer()
                    end
                end

                if state.LvlEnergyTotem then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("EnergyTotem") then
                        remotes.EnergyTotem:FireServer()
                    end
                end

                if state.LvlDamageTotem then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("DamageTotem") then
                        remotes.DamageTotem:FireServer()
                    end
                end

                if state.LvlExchangeRank then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("ExchangeRank") then
                        remotes.ExchangeRank:FireServer()
                    end
                end

                if state.LvlHoarderRank then
                    local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                    if remotes and remotes:FindFirstChild("HoarderRank") then
                        remotes.HoarderRank:FireServer()
                    end
                end




                local currentZone = GetCurrentZone()
                local zoneName = currentZone and currentZone.Name or ""
                local inRaid = zoneName:find("Raid") or zoneName:find("Tower") or zoneName:find("Easter")
                

                if state.AutoReturnToSpot and not inRaid and state.SavedReturnPos and not state.IsTeleporting then
                    local char = player.Character
                    local root = char and char:FindFirstChild("HumanoidRootPart")
                    if root then
                        local worldMap = {
                            ["Inferno City"] = "World7", ["Sorcerer High"] = "World8", ["Double Dungeons"] = "World9", ["Leaf Village"] = "World10", ["Shiganzina"] = "World11", ["Bizzare Town"] = "World12"
                        }
                        local targetWorld = worldMap[state.SavedReturnWorld] or state.SavedReturnWorld
                        local currentWorld = worldMap[zoneName] or zoneName

                        if currentWorld ~= targetWorld and targetWorld ~= "" then
                            state.IsTeleporting = true
                            AddLog("Cross-world return: " .. currentWorld .. " -> " .. targetWorld)
                            TeleportToWorld(targetWorld)
                            
                            -- Wait for transition (max 10s)
                            local startTime = tick()
                            while tick() - startTime < 10 do
                                local newZone = GetCurrentZone()
                                local newZoneName = newZone and newZone.Name or ""
                                local newWorld = worldMap[newZoneName] or newZoneName
                                if newWorld == targetWorld then break end
                                task.wait(1)
                            end
                            task.wait(1) -- Settle
                            state.IsTeleporting = false
                        end

                        -- Physical Position Return
                        local currentWorld = worldMap[zoneName] or zoneName
                        if currentWorld == targetWorld then
                            local dist = (root.Position - state.SavedReturnPos.Position).Magnitude
                            if dist > 60 then
                                state.IsTeleporting = true
                                AddLog("Returning to spot: " .. math.floor(dist) .. " studs away")
                                task.wait(2) -- Extra buffer for character physics
                                NativeTeleport(state.SavedReturnPos)
                                task.wait(2)
                                state.IsTeleporting = false
                                AddLog("Position Recovered!")
                            end
                        end
                    end
                end

                if #state.StatsToTrain > 0 then
                    local data = GetPlayerData()
                    local points = data.StatPoint or 0
                    if points > 0 then
                        local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                        local statFunc = remotes and remotes:FindFirstChild("StatPoints")
                        if statFunc then
                            for _, stat in ipairs(state.StatsToTrain) do statFunc:FireServer(stat, points) end
                        end
                    end
                end

                local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                if not remotes then return end

                if state.AutoRewards then
                    remotes.ClaimDaily:FireServer()
                    for i = 1, 16 do remotes.ClaimPlaytime:FireServer(i) end
                    
                    pcall(function()
                        local data = GetPlayerData()
                        local ds = data.DailyStreak
                        if ds and not ds.ClaimedToday then
                            remotes.ClaimDailyStreak:FireServer()
                            AddLog("Claimed Daily Streak Reward!")
                        end
                    end)
                end

                if state.AutoChests then
                    local chests = Workspace:FindFirstChild("Chests")
                    if chests then
                        for _, c in ipairs(chests:GetChildren()) do
                            if c:IsA("BasePart") then
                                pcall(function()
                                    firetouchinterest(player.Character.HumanoidRootPart, c, 0)
                                    task.wait(0.05)
                                    firetouchinterest(player.Character.HumanoidRootPart, c, 1)
                                end)
                            end
                        end
                    end
                    
                    local r = remotes:FindFirstChild("UpdateChest")
                    if r then
                        local currentTimestamp = os.time() 
                        local cList = {"PremiumChest", "GroupRewardsChest", "DailyRewardsChest", "HourlyChest", "VIPChest"}
                        for _, chestName in ipairs(cList) do
                            pcall(function() r:FireServer(chestName, currentTimestamp) end)
                            task.wait(0.1)
                        end
                    end
                end

                local zone = GetCurrentZone()
                local zoneName = zone and zone.Name or ""
                if state.LastFrameZone and state.LastFrameZone ~= zoneName then
                    UpdateScanner()
                end
                state.LastFrameZone = zoneName

                if state.Farm and (not state.CurrentTarget or #GetEnemies() == 0) and (tick() % 10 < 1) then
                    UpdateScanner()
                end

                local redeem = remotes:FindFirstChild("RedeemCode") or remotes:FindFirstChild("ClaimCode")
                if redeem then
                    for _, code in ipairs(promoCodes) do
                        pcall(function() 
                            if redeem:IsA("RemoteFunction") then redeem:InvokeServer(code)
                            else redeem:FireServer(code) end
                        end)
                        task.wait(0.2)
                    end
                    lastCodeCheck = os.clock()
                end
            end)
            task.wait(1)
        end
    end)

    task.spawn(function()
        while state.Nebublox_Running do
            pcall(function()
                local remotes = ReplicatedStorage:FindFirstChild("Remotes")
                if not remotes then return end
                
                local rTable = {
                    remotes:FindFirstChild("MorphPets") and remotes.MorphPets:FindFirstChild("EquipBestMorphPets"),
                    remotes:FindFirstChild("Weapons") and remotes.Weapons:FindFirstChild("EquipBestWeapons"),
                    remotes:FindFirstChild("Accessories") and remotes.Accessories:FindFirstChild("EquipBestAccessories")
                }
                for _, r in ipairs(rTable) do
                    if r then 
                        if r:IsA("RemoteFunction") then r:InvokeServer() else r:FireServer() end
                    end
                end
            end)
            task.wait(10)
        end
    end)

    task.spawn(function()
        local lastZone = ""
        while state.Nebublox_Running do
            local zone = GetCurrentZone()
            local zoneName = zone and zone.Name or ""
            
            if lastZone ~= zoneName and zoneName ~= "" then
                local firstRun = (lastZone == "")
                local wasInTrial = lastZone:find("Trial") or lastZone:find("Tower") or lastZone:find("Infinite") or lastZone:find("Raid")
                local enteringTrial = zoneName:find("Trial") or zoneName:find("Tower") or zoneName:find("Infinite") or zoneName:find("Raid")
                
                lastZone = zoneName
                
                if not firstRun then
                    -- Safety: Turn off Master Farm when entering a gamemode, restore when leaving
                    if enteringTrial and not wasInTrial then
                        state._OverworldFarmState = state.Farm
                        state.Farm = false
                        if getgenv().MasterFarmToggle then getgenv().MasterFarmToggle:Set(false) end
                    elseif wasInTrial and not enteringTrial then
                        if state._OverworldFarmState ~= nil then
                            state.Farm = state._OverworldFarmState
                            if getgenv().MasterFarmToggle then getgenv().MasterFarmToggle:Set(state.Farm) end
                        end
                        
                        -- [ NEW ]: Automatic Return after finishing gamemode or leaving wave
                        if state.AutoReturnToSpot and state.SavedReturnWorld then
                            task.delay(3, function() -- Buffer for character to settle in lobby
                                AddLog("Gamemode finished. Returning to " .. state.SavedReturnWorld .. "...")
                                TeleportToWorld(state.SavedReturnWorld)
                            end)
                        end
                    end

                    state.IsTeleporting = true
                    task.wait(enteringTrial and 5 or 3)
                    UpdateScanner()
                    state.IsTeleporting = false
                else
                    UpdateScanner()
                end
            end
            task.wait(1) 
        end
    end)


    trackConnection(player.CharacterAdded:Connect(function()
        local wasFarming = state.Farm
        state.Farm = false
        state.IsTeleporting = true
        
        task.wait(2) -- Allow map to fully stream in
        
        state.CurrentTarget = nil
        CurrentAreaName = ""
        CurrentEnemyContainer = nil
        
        UpdateScanner()
        
        -- [ NEW ]: Character Respawn Return
        if state.AutoReturnToSpot and state.SavedReturnWorld then
            local currentZone = GetCurrentZone()
            local currentZoneName = currentZone and currentZone.Name or ""
            if currentZoneName ~= state.SavedReturnWorld then
                TeleportToWorld(state.SavedReturnWorld)
                task.wait(2)
            end
        end

        state.IsTeleporting = false
        if wasFarming then state.Farm = true end
        
        if getgenv().NebubloxWindow then 
            getgenv().NebubloxWindow:Notify({Title = "Automation", Content = "Character Respawned. Farming resumed.", Type = "success"}) 
        end
    end))

    -- Force Homepage (Tab 1) to open first upon initialization
    Window:SelectTab(1)
    
    -- Global Anti-AFK is now handled by NebubloxUI.lua
end

InitializeApp()
