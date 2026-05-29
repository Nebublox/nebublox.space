-- [ NEBUBLOX WORLD FIGHTERS v1.0.8 ]
-- [ UPDATED: HOLLOW VERSE & HOLLOW DEFENSE SUPPORT ]
local scriptArgs = {getgenv().Nebublox_Key}

local loadst = getgenv().loadstring or loadstring
getgenv().firetouchinterest = getgenv().firetouchinterest or function() end
getgenv().getconnections = getgenv().getconnections or function() return {} end
getgenv().get_signal_cons = getgenv().get_signal_cons or function() return {} end
getgenv().setfpscap = getgenv().setfpscap or function() end
getgenv().cloneref = getgenv().cloneref or function(v) return v end
getgenv().firesignal = getgenv().firesignal or function() end
getgenv().getnilinstances = getgenv().getnilinstances or function() return {} end

if not loadst then
    warn("[NEBUBLOX] CRITICAL ERROR: Your executor does not support 'loadstring'.")
    return
end

-- [ SAFETY UTILITIES ]
local Maid = {}
Maid.__index = Maid
function Maid.new() return setmetatable({Tasks = {}}, Maid) end
function Maid:Add(task) table.insert(self.Tasks, task); return task end
function Maid:DoCleaning()
    for _, task in ipairs(self.Tasks) do
        if typeof(task) == "RBXScriptConnection" then task:Disconnect()
        elseif type(task) == "function" then pcall(task)
        elseif type(task) == "table" then
            if task.Cleanup then pcall(function() task:Cleanup() end)
            elseif task.Destroy then pcall(function() task:Destroy() end)
            elseif task.DoCleaning then pcall(function() task:DoCleaning() end) end
        end
    end
    self.Tasks = {}
end
function Maid:Cleanup() self:DoCleaning() end

local function SafeGet(parent, ...)
    local current = parent
    for _, name in ipairs({...}) do
        if not current then return nil end
        current = current:FindFirstChild(name)
    end
    return current
end

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local VirtualUser = game:GetService("VirtualUser")

local function DeepSearch(parent, name)
    local found = parent:FindFirstChild(name)
    if found then return found end
    
    local whitelist = {
        ["Shared"] = true, ["Packages"] = true, ["ReplicaShared"] = true, 
        ["Knit"] = true, ["Libs"] = true, ["TopBarPlus"] = true,
        ["Util"] = true, ["Utils"] = true, ["Modules"] = true, ["Networking"] = true,
        ["BridgeNet"] = true, ["BridgeNet2"] = true, ["Framework"] = true
    }

    for _, v in ipairs(parent:GetChildren()) do
        if whitelist[v.Name] then
            found = DeepSearch(v, name)
            if found then return found end
        end
    end
    return parent:FindFirstChild(name, true)
end

local RemoteModule = DeepSearch(ReplicatedStorage, "Remote") or DeepSearch(ReplicatedStorage, "Remotes")
local SignalModule = DeepSearch(ReplicatedStorage, "Signal") or DeepSearch(ReplicatedStorage, "GoodSignal")
local OmniModule = DeepSearch(ReplicatedStorage, "Omni")

if RemoteModule then print("[NEBUBLOX] Found Remote Module at:", RemoteModule:GetFullName()) end
if SignalModule then print("[NEBUBLOX] Found Signal Module at:", SignalModule:GetFullName()) end
if OmniModule then print("[NEBUBLOX] Found Omni Module at:", OmniModule:GetFullName()) end

local RemoteUtil = RemoteModule and require(RemoteModule)
local Signal = SignalModule and require(SignalModule)
local Omni = OmniModule and require(OmniModule)

if not RemoteUtil or not Signal then
    if Omni and Omni.Signal then
        Signal = Omni.Signal
        RemoteUtil = Omni.Remote or RemoteUtil
    end
end

if not RemoteUtil or not Signal then
    warn("[NEBUBLOX] CRITICAL: Could not find all native modules (Remote/Signal).")
end

local player = Players.LocalPlayer

local function CleanupPreviousInstance()
    local stateKeys = {"NebuState_WorldFighters", "Nebublox_State"}
    for _, key in ipairs(stateKeys) do
        if getgenv()[key] then
            pcall(function() getgenv()[key].Nebublox_Running = false end)
            getgenv()[key] = nil
        end
    end

    if getgenv().NebuMaid then
        pcall(function() getgenv().NebuMaid:Cleanup() end)
    end
    
    getgenv().NebuMaid = Maid.new()

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
        if Workspace:FindFirstChild("Nebufloat") then Workspace.Nebufloat:Destroy() end
    end)
    getgenv().Nebublox = nil
    getgenv().NebubloxWindow = nil
end
getgenv().CleanupPreviousInstance = CleanupPreviousInstance
CleanupPreviousInstance()

local function InitializeApp()
    
    if not getgenv().Nebublox_Verified then 
        warn("[NEBUBLOX] ACCESS DENIED: Please use the official loader to execute this script.")
        return 
    end
    
    getgenv().NebuState_WorldFighters = {
        Nebublox_Running = true,
        Farm = false, Noclip = true,
        CurrentTarget = nil, IsTeleporting = false, ShowRadius = true,
        TargetDropdownOptions = {"None"}, 
        PriorityTargetName = "None", 
        SecondaryTargetNames = {"All"},
        PriorityDropdownReference = nil,
        SecondaryDropdownReference = nil,
        AutoRewards = true, AutoChests = false, AutoCodes = false, AutoHatch = false,
        AutoEquipUnits = false, AutoEquipSwords = false, AutoEquipAccs = false,
        AutoEquipAvatars = false, AutoEquipVault = false, FarmDistance = 7.5,
        ScannerRadius = 250,
        NebuFloat = true,
        AutoHaki = false, AutoFruit = false, AutoRace = false, AutoRollSwords = false,
        AutoRerollPassives = false, AutoEnchant = false,
        TargetPassives = {}, TargetEnchant = "None",
        SelectedPassiveUnit = "None", SelectedEnchantSword = "None",
        AutoDragonPower = false, AutoDragonWish = false, AutoSlimePower = false,
        AutoTrial = false, TrialDifficulties = {"Easy"}, AutoTrialUpgrades = false,
        AutoTrialMedium = false,
        AutoAwaken = true,
        AutoTimeRewards = true,
        AutoDailyClaim = true,
        AutoGlobalBoss = false,
        GlobalBossList = {"Sakana", "Satoro", "Yuje", "Hanna"},
        ReturnToFarm_Trial = false, ReturnToFarm_TrialMedium = false, ReturnToFarm_Dragon = false, ReturnToFarm_Tempest = false, ReturnToFarm_Tower = false, ReturnToFarm_Hollow = false,
        LeaveWave_TrialEasy = 999, LeaveWave_TrialMedium = 999, LeaveWave_DragonDefense = 999, LeaveWave_TempestInvasion = 999, LeaveWave_Tower = 999, LeaveWave_Hollow = 999,
        AutoTower = false, AutoHollowDefense = false,
        GamemodeTransition = 0,
        State_Haki = false, State_Fruit = false, State_Race = false, State_Swords = false,
        State_DragonPower = false, State_DragonWish = false, State_SlimePower = false,
        State_PrimordialDemons = false, State_CursedTechnique = false, State_FightersBanner = false,
        State_HunterRank = false, State_EspadaRank = false, State_CursedSpirit = false,
        State_PirateEvolution = false, State_MonarchEvolution = false,
        State_HamonPower = false, State_BloodAbsorption = false, State_MonarchAwakening = false,
        State_CCGRank = false, State_InvestigadorProg = false, AutoSpawnCarsBoss = false,
        State_OrePriority = false,
        State_GlobalBossPriority = false,
        State_SystemProg = false,
        State_NinjaClan = false,
        State_Dojutsu = false,
        State_NinjaElements = false,
        State_GoteiHierarchy = false,
        State_HogyokuProgression = false,
        AutoHatch = false,
        ActiveHatchWorld = "None",
        StarHatchAmount = 5,
        State_AutoCodes = false,
        State_AutoBattlepass = false,
        _SessionCodesRedeemed = false,
        LastStatSync = 0, LastSidebarSync = 0, LastRewardSync = 0, LastEquipSync = 0, LastGachaRoll = 0, LastMiscSync = 0
    }
    
    local BuffLabel, VisualLabel, TitleLabel, PowerLabel, CrystalsLabel, WinsLabel, LivePowerLabel, LiveCrystalsLabel, LiveScannerLabel, LiveAwakeningLabel, SidebarTitleLabel, SidebarScannerLabel, SidebarAwakeningLabel
    local UNIVERSE_GRADIENT = "0 0.607843 1 0.0196078 0 0.195423 0.607843 1 0.0196078 0 0.198944 0.0666667 0.831373 0 0 0.411 0.0666667 0.831373 0 0 0.413732 0.607843 1 0.0196078 0 0.598592 0.607843 1 0.0196078 0 0.605634 0.0666667 0.831373 0 0 0.820423 0.0666667 0.831373 0 0 0.822183 0.607843 1 0.0196078 0 1 0.607843 1 0.0196078 0"
    local state = getgenv().NebuState_WorldFighters
    local g = getgenv()
    
    local TrialRooms = ReplicatedStorage:FindFirstChild("Assets") 
        and ReplicatedStorage.Assets:FindFirstChild("Models") 
        and ReplicatedStorage.Assets.Models:FindFirstChild("TimeTrialRooms")

    local CachedCharParts = {}
    local function UpdateCharCache(char)
        CachedCharParts = {}
        if not char then return end
        for _, p in ipairs(char:GetDescendants()) do
            if p:IsA("BasePart") then table.insert(CachedCharParts, p) end
        end
    end
    UpdateCharCache(player.Character)
    getgenv().NebuMaid:Add(player.CharacterAdded:Connect(UpdateCharCache))

    local AutoCodesList = {
        "RELEASE", "SRRY4SHUTDOWN", "SRRY4SHUTDOWN2", "SRRY4SHUTDOWN3", "SORRY4SHUTDOWN3", 
        "TIOGADIHIT!", "THX1KCCU", "2KCCU!", "THANKYOU3KCCU", "4KONCHAMBER!", "ALREADY5K?", 
        "6KTHXSOMUCH", "7KISALOT!", "THANKS1KLIKES", "100KVISITSONCHAMBER!", "RELEASEPATCH", 
        "TY2KLIKES!!", "THXFOR200KVISITS!", "300KVISITSTHANKYOU!", "400KVISITSINCREDIBLE", 
        "WOW500KVISITS!", "1KFAVORITESTHX!", "EVENT2.5K!", "RELEASEPT2", "THX3KLIKES!", 
        "600KVISITSYAY!", "700KVISITSINGAME", "2KFAVORITESTHANKYOU!", "SPLENDID800KVISITS!", 
        "900KVISITSTHANKYOU!", "ALREADY1MVISITS!?", "THXFOR4KLIKES", "THXFOR3KFAVORITES!", 
        "RELEASEQOL", "COOL1.2MVISITS!", "YAY5KLIKES!", "8KCCUISAWESOME!", "UPDATE1", "UPDATE2", 
        "SRRY4DELAY", "9KPLAYERS", "WOW10KCCU", "6KLIKESLOVU!", "GOOD7KLIKES!", 
        "AWESOME1.4MVISITS!", "1.6MILLIONVISITS!", "1.8MILLIONVISITSALREADY?!", "2MILLIONSSSVISITS", 
        "AWESOME11KCCU", "UPDATE1PT2", "LOVE8KLIKES!", "THXSOMUCHFOR9KLIKES!", "2.2MVISITS!!", 
        "2.4MVISITSTYSM!!", "2.6MILLIONVISITSTY!", "2.8MILLIONVISITSTHX!", "3MILLIONVISITSWOAH!", 
        "OHYEAH3.5MILLIONVISITS!", "4KFAVORITESYOUAREREAL!", "LOVEUALL5KFAVORITES", "6KFAVORITESWOAH!", 
        "7KFAVORITESSS!", "8KFAVORITESINWF!", "YAY9KFAVORITES!", "CANTBELIEVE12KCCU!", 
        "WOW10KLIKES!", "11KLIKESLETSGO!", "12KLIKESINSANE!", "13KLIKESMILESTONE!", 
        "TYFOR14KLIKES!", "ALREADY15KLIKESAWESOME?!", "OMG4MILLIONVISITS!", "4.5MILLIONVISITSYOOO!", 
        "5MILLIONVISITSINSANE!", "10KFAVORITESTYSM!", "11KFAVORITESNOWAY!", "12KFAVORITESBABY!", 
        "15KFAVORITES!!!", "20KFAVORITESYAY!!", "DAMN25KFAVORITES!!", "ALLGAMEPASSES",
        "13KPLAYERSISALOT!", "17.5KLIKES?!", "6MILLIONVISITSYO!!!", "7MILLIONVISITSYAY!?!", "YEAAA30KFAVORITES!!",
        "UPDATE3", "!!8MILLIONVISITS!!", "40KFAVORITES!TY!", "20KLIKESYOUAREINSANE?!", "UPDATE3PT2",
        "!9MILLIONVISITSTYSM!", "UPDATE3QOL", "10MILLIONVISITSINSANE!!", "UPDATE4", "WEARESOSORRY", "UPDATE5",
        "SRRY4DELAY", "!50KFAVORITESYOO!", "WEREALLYREACHED12MILLIONVISITS!!"
    }

    local GachaActions = {
        {StateToggle = "State_Haki",             Args = {"General", "Gacha", "Roll", "Haki", {["Inferno Haki"] = true}, 5}},
        {StateToggle = "State_Fruit",            Args = {"General", "Gacha", "Roll", "Fruit", {}, 5}},
        {StateToggle = "State_Race",             Args = {"General", "Gacha", "Roll", "Race", {}, 5}},
        {StateToggle = "State_Swords",           Args = {"General", "Banner", "Roll", "Swords Banner", 4}},
        {StateToggle = "State_DragonPower",      Args = {"General", "Gacha", "Roll", "Dragon Power", {}, 5}},
        {StateToggle = "State_DragonWish",       Args = {"General", "Roulette", "Roll", "Dragon Wish"}},
        {StateToggle = "State_SlimePower",       Args = {"General", "Gacha", "Roll", "Slime Power", {}, 5}},
        {StateToggle = "State_PrimordialDemons", Args = {"General", "Gacha", "Roll", "Primordial Demon", {}, 5}},
        {StateToggle = "State_CursedTechnique",  Args = {"General", "Gacha", "Roll", "Cursed Technique", {}, 5}},
        {StateToggle = "State_FightersBanner",   Args = {"General", "Banner", "Roll", "Fighters Banner", 4}},
        {StateToggle = "State_HunterRank",       Args = {"General", "Gacha", "Roll", "Hunter Rank", {}, 5}},
        {StateToggle = "State_MonarchAwakening", Args = {"General", "Gacha", "Roll", "Monarch Awakening", {}, 5}},
        {StateToggle = "State_Dojutsu",          Args = {"General", "Gacha", "Roll", "Dojutsu", {}, 5}},
        {StateToggle = "State_NinjaClan",        Args = {"General", "Gacha", "Roll", "Ninja Clan", {}, 5}},
        {StateToggle = "State_GoteiHierarchy",   Args = {"General", "Gacha", "Roll", "Gotei Hierarchy", {}, 5}},
        {StateToggle = "State_CursedSpirit",     Args = {"General", "Gacha", "Roll", "Cursed Spirit", {}, 5}},
        {StateToggle = "State_EspadaRank",       Args = {"General", "Gacha", "Roll", "Espada Rank", {}, 5}},
        {StateToggle = "State_HamonPower",       Args = {"General", "Gacha", "Roll", "Hamon Power", {}, 5}},
        {StateToggle = "State_CCGRank",          Args = {"General", "Gacha", "Roll", "CCG Rank", {}, 5}}
    }
    state.GachaIndex = 1
    
    local function SafeGet(parent, ...)
        local current = parent
        for _, name in ipairs({...}) do
            if not current or not current:FindFirstChild(name) then return nil end
            current = current[name]
        end
        return current
    end
    
    local _bridgeIdentifierCache = {}
    local _bridgeIdentifierStorage = nil

    local function GetBridgeIdentifier(bridgeName)
        if _bridgeIdentifierCache[bridgeName] then return _bridgeIdentifierCache[bridgeName] end
        if not _bridgeIdentifierStorage then
            local bn2 = ReplicatedStorage:FindFirstChild("BridgeNet2")
            if bn2 then _bridgeIdentifierStorage = bn2:FindFirstChild("identifierStorage") end
        end
        if _bridgeIdentifierStorage then
            local id = _bridgeIdentifierStorage:GetAttribute(bridgeName)
            if id then _bridgeIdentifierCache[bridgeName] = id; return id end
        end
        return nil
    end

    local function GetOmniData()
        if getgenv().NebuOmni then return getgenv().NebuOmni end
        
        local success, result = pcall(function()
            return require(game:GetService("ReplicatedStorage"):WaitForChild("Omni", 5))
        end)
        
        if success and result then
            getgenv().NebuOmni = result
            return result
        end
        
        -- GC Fallback for protected modules
        if getgc then
            for _, v in pairs(getgc(true)) do
                if type(v) == "table" and rawget(v, "Data") and rawget(v, "Signal") and rawget(v, "Shared") then
                    getgenv().NebuOmni = v
                    return v
                end
            end
        end
        
        return nil
    end

    local function FireOmniSignal(...)
        local args = {...}
        pcall(function()
            local Omni = getgenv().NebuOmni
            if Omni and Omni.Signal then
                Omni.Signal:Fire(unpack(args))
            else
                local bn1 = ReplicatedStorage:FindFirstChild("BridgeNet")
                if bn1 then
                    local Event = bn1:FindFirstChild("dataRemoteEvent")
                    if Event then Event:FireServer({ args, "\002" }) end
                else
                    local bn2 = ReplicatedStorage:FindFirstChild("BridgeNet2")
                    if bn2 then
                        local Event = bn2:FindFirstChild("dataRemoteEvent")
                        local identifier = GetBridgeIdentifier("Signal") or GetBridgeIdentifier("Omni")
                        if Event and identifier then Event:FireServer({{false, unpack(args)}, identifier}) end
                    end
                end
            end
        end)
    end

    local function SafeTeleport(path)
        pcall(function()
            local targetPos = nil
            if typeof(path) == "Instance" then targetPos = path.CFrame
            elseif typeof(path) == "Vector3" then targetPos = CFrame.new(path)
            elseif typeof(path) == "CFrame" then targetPos = path end

            if targetPos then
                local char = player.Character
                local root = char and char:FindFirstChild("HumanoidRootPart")
                if root then
                    root.AssemblyLinearVelocity = Vector3.zero
                    root.AssemblyAngularVelocity = Vector3.zero
                    root.CFrame = targetPos + Vector3.new(0, 3, 0)
                end
            end
        end)
    end

    local function InvokeNebubloxButton(button)
        if not button then return end
        pcall(function()
            local trigger = button:FindFirstChild("Value", true) or button:FindFirstChild("Invoke", true)
            if trigger and trigger:IsA("RemoteEvent") then trigger:FireServer()
            elseif trigger and trigger:IsA("RemoteFunction") then trigger:InvokeServer()
            elseif button:IsA("GuiButton") then
                if firesignal then firesignal(button.MouseButton1Click) 
                else
                    button.MouseButton1Click:Connect(function() end)
                    for _, connection in pairs(getconnections(button.MouseButton1Click)) do connection:Fire() end
                end
            end
        end)
    end

    local function NativeUniverseJump(verseName, worldIndex)
        FireOmniSignal("Player", "Teleport", "Jump", verseName or "Fruits Verse", worldIndex or 1)
    end
    getgenv().BridgeNet = getgenv().BridgeNet or { Fire = function() end }
    getgenv().LiveUpgradeToggles = {}
    local Omni = getgenv().NebuOmni or Omni
    if Omni and Omni.WaitInitialization then 
        task.spawn(function()
            pcall(function() Omni:WaitInitialization() end)
        end)
        task.wait(0.5) 
    end

    local TeleportLocations = {
        ["Dressrosa"]          = {"Fruits Verse", 1},
        ["Marine Fortress"]    = {"Fruits Verse", 2},
        ["Capsule Corp"]       = {"Dragon Verse", 1},
        ["Dragon Arena"]       = {"Dragon Verse", 2},
        ["Jura Forest"]        = {"Slime Verse", 1},
        ["Tempest Federation"] = {"Slime Verse", 2},
        ["Sorcerers Academy"]  = {"Cursed Verse", 1},
        ["Cursed Bridge"]      = {"Cursed Verse", 2},
        ["Leveling City"]      = {"Leveling Verse", 1},
        ["Double Dungeon"]     = {"Leveling Verse", 2},
        ["Soul Society"]       = {"Hollow Verse", 1},
        ["Bizzare City"]       = {"Bizzare Verse", 1},
        ["Ghoul Verse"]        = {"Ghoul Verse", 1}
    }


    local _bridgeIdentifierCache = {}
    local _bridgeIdentifierStorage = nil

    local function GetBridgeIdentifier(bridgeName)
        if _bridgeIdentifierCache[bridgeName] then return _bridgeIdentifierCache[bridgeName] end
        if not _bridgeIdentifierStorage then
            local bn2 = ReplicatedStorage:FindFirstChild("BridgeNet2")
            if bn2 then _bridgeIdentifierStorage = bn2:FindFirstChild("identifierStorage") end
        end
        if _bridgeIdentifierStorage then
            local id = _bridgeIdentifierStorage:GetAttribute(bridgeName)
            if id then _bridgeIdentifierCache[bridgeName] = id; return id end
        end
        return nil
    end

    local function Color3ToHex(color)
        return string.format("#%02X%02X%02X", color.R * 255, color.G * 255, color.B * 255)
    end

    local function getGradient(text, type)
        local res = ""
        local cols = {"#FFFFFF"}
        if type == "Mythical" then
            cols = {"#FF00F2", "#009DFF", "#00FFFF", "#02F900", "#8AFA00", "#FFEE00", "#FFB300", "#FF7700"}
        elseif type == "Secret" then
            cols = {"#FF0004", "#E20004", "#C50003", "#A80003", "#8B0002", "#6F0001", "#520000"}
        elseif type == "Legendary" then
            cols = {"#FFB300", "#FFCC00", "#FFD700", "#FFE600", "#FFFF00", "#FFE600", "#FFD700", "#FFCC00"}
        elseif type == "Haki" then
            cols = {"#B700FF", "#8A00FF", "#B700FF", "#8A00FF", "#B700FF"}
        elseif type == "Hoarder" then
            cols = {"#0091FF", "#00BFFF", "#0091FF", "#00BFFF", "#0091FF"}
        elseif type == "TrialColor" then
            cols = {"#00FFFF", "#00FFFF", "#A020F0", "#A020F0"}
        elseif type == "DragonColor" then
            cols = {"#FFA500", "#FFA500", "#00008B", "#00008B"}
        elseif type == "TempestColor" then
            cols = {"#FF0000", "#FF0000", "#006400", "#006400"}
        elseif type == "Holographic" then
            cols = {"#00FFFF", "#FFFFFF", "#FF00FF", "#00FFFF", "#FFFFFF", "#FF00FF"}
        end
        for i = 1, #text do
            local char = text:sub(i, i)
            if char == " " then res = res .. " "
            else
                local col = cols[((i - 1) % #cols) + 1]
                res = res .. "<font color='" .. col .. "'>" .. char .. "</font>"
            end
        end
        return res
    end

    local function GetRarityColor(rarity)
        if rarity == "Secret" then return Color3.fromRGB(255, 0, 0)
        elseif rarity == "Divine" then return Color3.fromRGB(0, 255, 255)
        elseif rarity == "Mythical" then return Color3.fromRGB(255, 0, 143)
        elseif rarity == "Legendary" then return Color3.fromRGB(255, 215, 0)
        elseif rarity == "Epic" then return Color3.fromRGB(190, 0, 255)
        elseif rarity == "Rare" then return Color3.fromRGB(0, 160, 255)
        elseif rarity == "Uncommon" then return Color3.fromRGB(0, 255, 120)
        end
        return Color3.fromRGB(180, 180, 180)
    end

    local function InvokeNebubloxButton(button)
        if not button then return end
        pcall(function()
            local trigger = button:FindFirstChild("Value", true) or button:FindFirstChild("Invoke", true)
            if trigger and trigger:IsA("RemoteEvent") then trigger:FireServer()
            elseif trigger and trigger:IsA("RemoteFunction") then trigger:InvokeServer()
            elseif button:IsA("GuiButton") then
                if firesignal then firesignal(button.MouseButton1Click) 
                else
                    button.MouseButton1Click:Connect(function() end)
                    for _, connection in pairs(getconnections(button.MouseButton1Click)) do connection:Fire() end
                end
            end
        end)
    end



    
    local function GetNativeToggleState(buttonPath)
        if not buttonPath then return false end
        local success, result = pcall(function()
            local textLabel = buttonPath:FindFirstChildOfClass("TextLabel") or buttonPath
            if textLabel and textLabel:IsA("TextLabel") then
                local text = string.upper(textLabel.Text)
                if text:match("ON") or text:match("ENABLED") or text:match("STOP AUTO") then return true end
                if text:match("OFF") or text:match("DISABLED") or text:match("AUTO") then return false end
            end
            if buttonPath:IsA("GuiObject") then
                local bgColor = buttonPath.BackgroundColor3
                if bgColor.G > 0.5 and bgColor.R < 0.5 then return true end
            end
            if buttonPath:GetAttribute("IsOn") == true then return true end
            return false
        end)
        return success and result or false
    end



    local PassiveSheet = {
        ["Captain Banner"] = {Index = 1, Rarity = "Common", Icon = "rbxassetid://83428905091336", Items = {{Name = "Pirate Flag", Amount = 2}}, Perk = "+0.1 Crystals"},
        ["Sea Navigator"] = {Index = 2, Rarity = "Common", Icon = "rbxassetid://140522434191540", Items = {{Name = "Boat Rudder", Amount = 2}}, Perk = "+0.1 Luck"},
        ["Warrior Guard"] = {Index = 3, Rarity = "Common", Icon = "rbxassetid://86262033768369", Items = {{Name = "Wood Shield", Amount = 2}}, Perk = "+0.1 Damage"},
        ["Legendary Bounty"] = {Index = 4, Rarity = "Uncommon", Icon = "rbxassetid://103466634623000", Items = {{Name = "Wanted Leaflet", Amount = 2}}, Perk = "+0.15 Crystals"},
        ["Pirate Curse"] = {Index = 5, Rarity = "Uncommon", Icon = "rbxassetid://109225947262742", Items = {{Name = "Pirate Skull", Amount = 2}}, Perk = "+0.15 Damage"},
        ["Energy Burst"] = {Index = 6, Rarity = "Uncommon", Icon = "rbxassetid://82347914586916", Items = {{Name = "Wood Katana", Amount = 2}}, Perk = "1.1x Power"},
        ["Adventurer Spirit"] = {Index = 7, Rarity = "Rare", Icon = "rbxassetid://79046539319931", Items = {{Name = "Traveler Backpack", Amount = 2}}, Perk = "+0.15 Luck"},
        ["Black King Blade"] = {Index = 8, Rarity = "Rare", Icon = "rbxassetid://136985235065448", Items = {{Name = "Dark Blade", Amount = 2}}, Perk = "+0.2 Damage"},
        ["Divine Vitality"] = {Index = 9, Rarity = "Rare", Icon = "rbxassetid://105248001280354", Items = {{Name = "Diamond", Amount = 2}}, Perk = "1.15x Power"},
        ["Wanted Swordsman"] = {Index = 10, Rarity = "Epic", Icon = "rbxassetid://95837747181340", Items = {{Name = "Dark Blade", Amount = 10}, {Name = "Wanted Leaflet", Amount = 6}}, Perk = "+0.4 Damage & +0.25 Crystals"},
        ["Cursed Guardian"] = {Index = 11, Rarity = "Epic", Icon = "rbxassetid://139861781139256", Items = {{Name = "Pirate Skull", Amount = 10}, {Name = "Wood Shield", Amount = 6}}, Perk = "+0.55 Damage"},
        ["Underworld Legend"] = {Index = 12, Rarity = "Epic", Icon = "rbxassetid://124302962291349", Items = {{Name = "Pirate Skull", Amount = 6}, {Name = "Wanted Leaflet", Amount = 10}}, Perk = "+0.25 Damage & +0.35 Crystals"},
        ["Sea Captain Will"] = {Index = 13, Rarity = "Legendary", Icon = "rbxassetid://72907762997122", Items = {{Name = "Pirate Flag", Amount = 8}, {Name = "Boat Rudder", Amount = 10}}, Perk = "+0.25 Crystals & +0.3 Luck"},
        ["Warrior Journey"] = {Index = 14, Rarity = "Legendary", Icon = "rbxassetid://113147118631833", Items = {{Name = "Diamond", Amount = 10}, {Name = "Traveler Backpack", Amount = 6}}, Perk = "1.35x Power & +0.25 Luck"},
        ["Divine Energy Surge"] = {Index = 15, Rarity = "Mythical", Icon = "rbxassetid://103807190068339", Items = {{Name = "Diamond", Amount = 6}, {Name = "Wood Katana", Amount = 10}}, Perk = "1.55x Power"},
        ["Ugly Curse"] = {Index = 16, Rarity = "Mythical", Icon = "rbxassetid://81675408169299", Items = {{Name = "Worker Glasses", Amount = 10}, {Name = "Blindfold", Amount = 10}}, Perk = "+40% Luck & +5% Gacha Luck "},
        ["Anti Sorcerer"] = {Index = 17, Rarity = "Mythical", Icon = "rbxassetid://93887163075402", Items = {{Name = "Angel Eye", Amount = 10}, {Name = "Love Hammer", Amount = 8}}, Perk = "+0.75 Damage & +0.5 Crystals"},
        ["Divine General"] = {Index = 18, Rarity = "Mythical", Icon = "rbxassetid://131027224677330", Items = {{Name = "Cursed Finger", Amount = 6}, {Name = "Dharmachakre", Amount = 10}}, Perk = "+3% Drops & 1.75x Power"}

    }

    local MaterialIcons = {
        ["Dark Blade"] = "rbxassetid://136985235065448",
        ["Wanted Leaflet"] = "rbxassetid://103466634623000",
        ["Pirate Skull"] = "rbxassetid://109225947262742",
        ["Wood Shield"] = "rbxassetid://86262033768369",
        ["Pirate Flag"] = "rbxassetid://83428905091336",
        ["Boat Rudder"] = "rbxassetid://140522434191540",
        ["Traveler Backpack"] = "rbxassetid://79046539319931",
        ["Wood Katana"] = "rbxassetid://82347914586916",
        ["Diamond"] = "rbxassetid://105248001280354",
        
        ["Iron Ore"] = "rbxassetid://119411027895365",
        ["Bronze Ore"] = "rbxassetid://94068273598058",
        ["Gold Ingot"] = "rbxassetid://75007242349308",
        ["Silver Coin"] = "rbxassetid://131908758385389",
        ["Crystal Ore"] = "rbxassetid://126847682788666",
        ["Dark Essence"] = "rbxassetid://116582620321133",
        ["Volcanic Stone"] = "rbxassetid://80303428764345",
        ["Leaf"] = "rbxassetid://87045326629037",
        ["Mana Core"] = "rbxassetid://91704856828837",
        ["Eternal Ice"] = "rbxassetid://101854622209525",
        ["Beastly Core"] = "rbxassetid://89053515318491",
        ["Ancient Relic"] = "rbxassetid://138840618983434",
        ["Bronze Root"] = "rbxassetid://73172560711906",
        ["Worker Glasses"] = "rbxassetid://116694059982251",
        ["Blindfold"] = "rbxassetid://99364245067501",
        ["Angel Eye"] = "rbxassetid://126870348968807",
        ["Love Hammer"] = "rbxassetid://102428988552524",
        ["Dharmachakre"] = "rbxassetid://126543470899151",
        ["Cursed Finger"] = "rbxassetid://112615528628147"
    }

    local EnchantSheet = {
        ["Unbreakable Body"] = {Index = 1, Rarity = "Epic", Icon = "rbxassetid://120068891376330", Items = {{Name = "Iron Ore", Amount = 10}, {Name = "Bronze Ore", Amount = 6}}, Perk = "+0.5 Damage"},
        ["Prismatic Light"] = {Index = 2, Rarity = "Epic", Icon = "rbxassetid://118784706349154", Items = {{Name = "Gold Ingot", Amount = 10}, {Name = "Crystal Ore", Amount = 6}}, Perk = "+0.5 Crystals"},
        ["Cursed Touch"] = {Index = 3, Rarity = "Epic", Icon = "rbxassetid://120401809616533", Items = {{Name = "Silver Coin", Amount = 10}, {Name = "Dark Essence", Amount = 6}}, Perk = "1.25x Power"},
        ["Magma Armor"] = {Index = 4, Rarity = "Epic", Icon = "rbxassetid://130440648414384", Items = {{Name = "Iron Ore", Amount = 10}, {Name = "Volcanic Stone", Amount = 6}}, Perk = "+1 Damage"},
        ["Gale Step"] = {Index = 5, Rarity = "Epic", Icon = "rbxassetid://82379491841414", Items = {{Name = "Leaf", Amount = 10}, {Name = "Bronze Ore", Amount = 6}}, Perk = "+1 Crystals"},
        ["Arcane Sovereignty"] = {Index = 6, Rarity = "Epic", Icon = "rbxassetid://75979573914664", Items = {{Name = "Gold Ingot", Amount = 10}, {Name = "Mana Core", Amount = 6}}, Perk = "1.35x Power"},
        ["Frozen Heart"] = {Index = 7, Rarity = "Epic", Icon = "rbxassetid://117207726429006", Items = {{Name = "Silver Coin", Amount = 10}, {Name = "Eternal Ice", Amount = 6}}, Perk = "+1.25 Damage & +0.75 Crystals"},
        ["Savage Fury"] = {Index = 8, Rarity = "Epic", Icon = "rbxassetid://76182563648514", Items = {{Name = "Iron Ore", Amount = 10}, {Name = "Beastly Core", Amount = 6}}, Perk = "+0.75 Damage & +1.25 Crystals"},
        ["Nature Blessing"] = {Index = 9, Rarity = "Epic", Icon = "rbxassetid://116955949938732", Items = {{Name = "Bronze Root", Amount = 10}, {Name = "Bronze Ore", Amount = 6}}, Perk = "1.5x Power & +0.75 Crystals"},
        ["Ancestral Domain"] = {Index = 100, Rarity = "Epic", Icon = "rbxassetid://139723147243216", Items = {{Name = "Gold Ingot", Amount = 10}, {Name = "Ancient Relic", Amount = 6}}, Perk = "1.75x Power & +1 Crystals & +1 Damage"}
    }

    local function GetNilRemote(name)
        if not getgenv().getnilinstances then return nil end
        for _, v in ipairs(getnilinstances()) do
            if v.Name == name and (v:IsA("RemoteEvent") or v:IsA("RemoteFunction")) then return v end
        end
        return nil
    end

    local function StringToColorSequence(str)
        if not str or type(str) ~= "string" then return nil end
        local values = {}
        for val in str:gmatch("[%d%.%-%+eE]+") do table.insert(values, tonumber(val)) end
        if #values < 4 then return nil end
        local keypoints = {}
        local step = (#values % 5 == 0) and 5 or 4
        for i = 1, #values, step do
            if values[i] and values[i+1] and values[i+2] and values[i+3] then
                pcall(function()
                    table.insert(keypoints, ColorSequenceKeypoint.new(
                        math.clamp(values[i], 0, 1), 
                        Color3.new(math.clamp(values[i+1], 0, 1), math.clamp(values[i+2], 0, 1), math.clamp(values[i+3], 0, 1))
                    ))
                end)
            end
        end
        if #keypoints < 2 then return nil end
        return ColorSequence.new(keypoints)
    end

    
    local EnemyNameCache = {}
    setmetatable(EnemyNameCache, { __mode = "k" })
    local CachedEnemies = {}
    local LastCacheUpdate = 0
    local KillBlacklist = {}
    setmetatable(KillBlacklist, { __mode = "k" })

    local function FormatNumber(val)
        if not val then return "0" end
        if val >= 1e33 then return string.format("%.2fDc", val / 1e33)
        elseif val >= 1e30 then return string.format("%.2fNo", val / 1e30)
        elseif val >= 1e27 then return string.format("%.2fOc", val / 1e27)
        elseif val >= 1e24 then return string.format("%.2fSp", val / 1e24)
        elseif val >= 1e21 then return string.format("%.2fSx", val / 1e21)
        elseif val >= 1e18 then return string.format("%.2fQi", val / 1e18)
        elseif val >= 1e15 then return string.format("%.2fQa", val / 1e15)
        elseif val >= 1e12 then return string.format("%.2fT", val / 1e12)
        elseif val >= 1e9 then return string.format("%.2fB", val / 1e9)
        elseif val >= 1e6 then return string.format("%.2fM", val / 1e6)
        elseif val >= 1e3 then return string.format("%.2fK", val / 1e3)
        end
        return tostring(math.floor(val))
    end

    local function HardResetScanner()
        state.CurrentTarget = nil
        LastCacheUpdate = 0
        CachedEnemies = {}
        EnemyNameCache = {}
        KillBlacklist = {}
        setmetatable(KillBlacklist, { __mode = "k" })
        setmetatable(EnemyNameCache, { __mode = "k" })
    end
    
    -- Periodic Cache Cleanup to prevent stale references
    task.spawn(function()
        while state.Nebublox_Running do
            task.wait(60)
            if not state.IsTeleporting and not state.CurrentTarget then
                HardResetScanner()
            end
        end
    end)

    local function SafeTeleport(path)
        pcall(function()
            local targetPos = nil
            if typeof(path) == "Instance" then targetPos = path.CFrame
            elseif typeof(path) == "Vector3" then targetPos = CFrame.new(path)
            elseif typeof(path) == "CFrame" then targetPos = path end

            if targetPos then
                local char = player.Character
                local root = char and char:FindFirstChild("HumanoidRootPart")
                if root then
                    root.AssemblyLinearVelocity = Vector3.zero
                    root.AssemblyAngularVelocity = Vector3.zero
                    root.CFrame = targetPos + Vector3.new(0, 3, 0)
                end
            end
        end)
    end

    local function NativeTeleport(cf)
        pcall(function()
            local ugc = GetNilRemote("Ugc")
            if ugc and firesignal then
                firesignal(ugc.OnClientEvent, {
                    ["\x02"] = {
                        { "Player", "Character", "Teleport", cf, CFrame.new(0,0,0, cf:ToEulerAnglesXYZ()) }
                    }
                })
            else
                SafeTeleport(cf)
            end
        end)
    end

    local mapData = {
        ["World 1"] = {"World 1", 1},
        ["World 2"] = {"World 2", 2},
        ["World 3"] = {"World 3", 3},
        ["World 4"] = {"World 4", 4},
        ["World 5"] = {"World 5", 5},
        ["World 6"] = {"World 6", 6},
        ["World 7"] = {"World 7", 7},
        ["World 8"] = {"World 8", 8},
        ["Hollow Verse"] = {"Hollow Verse", 9},
        ["Hollow Verse 1"] = {"Hollow Verse", 9},
        ["Hollow Verse 2"] = {"Hollow Verse", 10},
        ["Bizzare City"]   = {"Bizzare Verse", 11},
        ["Ghoul Verse"]    = {"Ghoul Verse", 12},
    }

    function TeleportToZone(zoneStr)
        if not zoneStr or zoneStr == "None" then return end
        local info = mapData[zoneStr]
        if not info then return end
        
        local universeName, index = info[1], info[2]
        
        pcall(function()
            local success = false
            pcall(function()
                local teleportFrame = player.PlayerGui.UI.Frames.Teleport.Background.Main.List:FindFirstChild(zoneStr)
                local btn = teleportFrame and teleportFrame:FindFirstChild("Teleport", true)
                if btn then
                    InvokeNebubloxButton(btn)
                    success = true
                end
            end)
            
            if success then return end

            local Omni = GetOmniData()
            HardResetScanner()
            print("[NEBUBLOX] Attempting Remote Teleport to: " .. tostring(zoneStr))

            -- [ OPTIMIZED ] Using Fast-Teleport Remote from Sniffer
            FireOmniSignal("Player", "Teleport", "Teleport", universeName, index)
            
            -- Fallback logic for legacy travel
            Omni.Signal:Fire("General", "Travel", universeName, index)
            task.wait(0.1)
            Omni.Signal:Fire("General", "Travel", {universeName, index})
        end)
    end

    local function SmartAutoSkillTree(treeName)
        pcall(function()
            local treeData = Omni.Shared.SkillTree.List[treeName]
            if not treeData then return end
            
            local playerData = Omni.Data
            local playerTreeUnlocks = playerData.SkillTree[treeName] or {}
            local cheapestNode = nil
            local lowestPrice = math.huge

            for nodeName, nodeData in pairs(treeData.Upgrades) do
                if not playerTreeUnlocks[nodeName] then
                    local parentOwned = true
                    if nodeData.Parent then
                        parentOwned = playerTreeUnlocks[nodeData.Parent] == true
                    end

                    if parentOwned then
                        local priceType = nodeData.Price.Type
                        local priceName = nodeData.Price.Name
                        local priceAmount = nodeData.Price.Amount
                        local currentWealth = Omni.Utils.Info:GetPriceAmount(priceType, priceName, playerData)
                        
                        if currentWealth >= priceAmount then
                            if priceAmount < lowestPrice then
                                lowestPrice = priceAmount
                                cheapestNode = nodeName
                            end
                        end
                    end
                end
            end

            if cheapestNode then
                Omni.Signal:Fire("General", "SkillTree", "Unlock", treeName, cheapestNode)
            end
        end)
    end

    local function SmartAutoUpgrade(categoryName)
        pcall(function()
            local upgradeData = Omni.Shared.Upgrade.List[categoryName]
            if not upgradeData then return end
            local playerData = Omni.Data
            local playerUpgrades = playerData.Upgrade[categoryName] or {}
            local cheapestUpgrade = nil
            local lowestPrice = math.huge

            for perkName, perkData in pairs(upgradeData.Upgrades) do
                local currentLevel = playerUpgrades[perkName] or 0
                if currentLevel < perkData.MaxLevel then
                    local nextLevel = currentLevel + 1
                    local levelInfo = Omni.Shared.Upgrade.GetLevelInformation(categoryName, perkName, nextLevel)
                    if levelInfo and levelInfo.Price then
                        local priceType = levelInfo.Price.Type
                        local priceName = levelInfo.Price.Name
                        local priceAmount = levelInfo.Price.Amount
                        local currentWealth = Omni.Utils.Info:GetPriceAmount(priceType, priceName, playerData)
                        if currentWealth >= priceAmount then
                            if priceAmount < lowestPrice then
                                lowestPrice = priceAmount
                                cheapestUpgrade = perkName
                            end
                        end
                    end
                end
            end

            if cheapestUpgrade then
                Omni.Signal:Fire("General", "Upgrade", "Upgrade", categoryName, cheapestUpgrade)
            end
        end)
    end

    local function SmartAutoProgression(progName)
        pcall(function()
            FireOmniSignal("General", "Progression", "Upgrade", progName)
        end)
    end

    local function JoinGamemodeSafely(gamemodeName, autoJoinStateKey)
        if not state.SavedFarmPos then 
            state.SavedFarmPos = state.ManualReturnPos or (player.Character and player.Character:GetPivot())
        end
        
        -- Cache the overworld farm state so we can restore it upon return
        if state._OverworldFarmState_WF == nil then
            state._OverworldFarmState_WF = state.Farm
        end
        
        -- Explicitly turn off the Master Overworld Farm
        state.Farm = false 
        if getgenv().MasterFarmToggle_WF then getgenv().MasterFarmToggle_WF:Set(false) end

        -- We no longer turn off the specific auto-join toggle so it can loop over and over
        -- if autoJoinStateKey and state[autoJoinStateKey] then
        --     state[autoJoinStateKey] = false
        -- end

        state.IsTeleporting = true
        state.GamemodeTransition = tick() + 20
        
        HardResetScanner()
        
        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        if root then
            root.AssemblyLinearVelocity = Vector3.zero
            root.AssemblyAngularVelocity = Vector3.zero
        end
        
        local OmniRef = GetOmniData()
        local function FireSignal(...)
            local args = {...}
            pcall(function()
                if OmniRef and OmniRef.Signal then
                    OmniRef.Signal:Fire(unpack(args))
                end
            end)
            -- Support for Visco-style remotes if identified
            pcall(function()
                local visco = game:GetService("ReplicatedStorage"):FindFirstChild("Omni"):FindFirstChild("Libs"):FindFirstChild("Visco"):FindFirstChild("Assets"):FindFirstChild("Events")
                if visco then
                    local req = visco:FindFirstChild("Request")
                    if req and req:IsA("RemoteEvent") then
                        req:FireServer(unpack(args))
                    end
                end
            end)
        end

        FireSignal("General", "Gamemodes", "Join", gamemodeName)
        FireSignal("General", "Gamemodes", "Join", gamemodeName:gsub(" ", ""))
        
        task.spawn(function()
            local timeout = 20
            while timeout > 0 do
                local currentGamemode = OmniRef and OmniRef.Data and OmniRef.Data.Gamemode
                if currentGamemode and currentGamemode ~= "None" then
                    print("[NEBUBLOX] Successfully joined " .. tostring(currentGamemode))
                    break 
                end
                timeout = timeout - 1
                task.wait(1)
            end
            
            task.wait(3) -- Increased settle time for assets
            UpdateScanner()
            
            if getgenv().NebubloxWindow then
                getgenv().NebubloxWindow:Notify({
                    Title = "Gamemode Join", 
                    Content = "Transition complete. Gamemode auto-farm taking over.", 
                    Type = "success"
                })
            end
            
            state.IsTeleporting = false
            
            -- Auto-enable farm for Trials
            if gamemodeName:find("Trial") then
                state.Farm = true
                if getgenv().MasterFarmToggle_WF then getgenv().MasterFarmToggle_WF:Set(true) end
            end
        end)
    end

    local function GetRealEnemyName(model)
        if EnemyNameCache[model] then return EnemyNameCache[model] end

        local function clean(str)
            if not str then return "" end
            return str:gsub("%s*%[.-%]", ""):gsub("%s*%(.-%)", ""):gsub("%s*Lvl%s*%d+", ""):gsub("%d+$", ""):gsub("%s+$", "")
        end

        local name = clean(model.Name)
        EnemyNameCache[model] = name
        return name
    end

    local function IsEnemyValid(mob)
        if not mob or not mob.Parent or (not mob.PrimaryPart and not mob:FindFirstChild("HumanoidRootPart")) then return false end
        if mob.Name == "Zoru" or mob.Name == "Zoro" or mob.Name == "Sanji" or mob.Name == "Test Dummy" then return false end
        if KillBlacklist[mob] and tick() < KillBlacklist[mob] then return false end
        if mob:GetAttribute("Dead") or mob:GetAttribute("Shield") or mob:GetAttribute("Attackable") == false then return false end
        if Players:GetPlayerFromCharacter(mob) then return false end

        local hum = mob:FindFirstChildOfClass("Humanoid")
        if hum then
            if hum.Health <= 0 then
                KillBlacklist[mob] = tick() + 2 
                return false
            end
            return true
        end

        
        for _, desc in ipairs(mob:GetDescendants()) do
            if desc:IsA("TextLabel") and (desc.Name == "Amount" or desc.Name == "Health") then
                if desc.Text == "0" or desc.Text:match("^0/") then return false end
                return true
            end
        end

        
        local hasHUD = mob:FindFirstChild("EnemyBillboard", true) or mob:FindFirstChild("EnemyHUD", true) or mob:FindFirstChildOfClass("BillboardGui", true)
        return hasHUD ~= nil
    end

    local function GetEnemies(ignoreRadius)
        if not ignoreRadius and tick() - LastCacheUpdate < 0.5 then return CachedEnemies end 

        local validEnemies = {}
        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        if not root then return validEnemies end
        
        
        local isGamemode = (Omni.Data and Omni.Data.Gamemode and Omni.Data.Gamemode ~= "None") or Workspace:FindFirstChild("TimeTrialRoom") or Workspace:FindFirstChild("DragonDefense") or Workspace:FindFirstChild("TempestInvasion") or Workspace:FindFirstChild("Raid") or Workspace:FindFirstChild("SpecialRaid")
        local radius = (isGamemode or ignoreRadius) and 9999 or (state.ScannerRadius or 250)
        local radiusSq = radius * radius

        
        local searchContainers = {
            Workspace:FindFirstChild("Client") and Workspace.Client:FindFirstChild("Enemies"),
            Workspace:FindFirstChild("Fighters"),
            Workspace:FindFirstChild("Map"),
            Workspace:FindFirstChild("Enemies"),
            Workspace:FindFirstChild("Mobs"),
            Workspace:FindFirstChild("World"),
            Workspace:FindFirstChild("Stage"),
            Workspace:FindFirstChild("TimeTrialRoom") and Workspace.TimeTrialRoom:FindFirstChild("Enemies"),
            Workspace:FindFirstChild("DragonDefense") and Workspace.DragonDefense:FindFirstChild("Enemies"),
            Workspace:FindFirstChild("TempestInvasion") and Workspace.TempestInvasion:FindFirstChild("Enemies"),
            Workspace:FindFirstChild("Raid") and (Workspace.Raid:FindFirstChild("Enemies") or Workspace.Raid),
            Workspace:FindFirstChild("SpecialRaid") and (Workspace.SpecialRaid:FindFirstChild("Enemies") or Workspace.SpecialRaid),
            Workspace
        }

        for _, container in ipairs(searchContainers) do
            if container then
                for _, mob in ipairs(container:GetChildren()) do
                    if mob:IsA("Model") and mob ~= player.Character and IsEnemyValid(mob) then
                        local mRoot = mob:FindFirstChild("HumanoidRootPart") or mob.PrimaryPart
                        if mRoot then
                            local distSq = (mRoot.Position - root.Position).Magnitude ^ 2
                            if distSq <= radiusSq then
                                table.insert(validEnemies, mob)
                            end
                        end
                    elseif mob:IsA("Folder") then
                        for _, sub in ipairs(mob:GetChildren()) do
                            if sub:IsA("Model") and IsEnemyValid(sub) then
                                local sRoot = sub:FindFirstChild("HumanoidRootPart") or sub.PrimaryPart
                                if sRoot then
                                    local distSq = (sRoot.Position - root.Position).Magnitude ^ 2
                                    if distSq <= radiusSq then
                                        table.insert(validEnemies, sub)
                                    end
                                end
                            end
                        end
                    end
                end
            end
        end

        if not ignoreRadius then
            CachedEnemies = validEnemies
            LastCacheUpdate = tick()
        end
        return validEnemies
    end

    local function UpdateScanner()
        local enemies = GetEnemies()
        local seen, priorityList, secondaryList = {}, {"None"}, {"All"}

        for _, e in ipairs(enemies) do
            local clean = GetRealEnemyName(e)
            if clean and clean ~= "" and not seen[clean] then
                seen[clean] = true
                table.insert(priorityList, clean)
                table.insert(secondaryList, clean)
            end
        end

        table.sort(priorityList)
        table.sort(secondaryList)

        if state.PriorityDropdownReference then state.PriorityDropdownReference:Refresh(priorityList) end
        if state.SecondaryDropdownReference then state.SecondaryDropdownReference:Refresh(secondaryList) end

        return enemies
    end

    
    local LastKnownMap = nil
    local LastGamemodeState = "None"
    task.spawn(function()
        while state.Nebublox_Running do
            pcall(function()
                local char = player.Character
                local root = char and char:FindFirstChild("HumanoidRootPart")
                if root then
                    local currentMap = Workspace:FindFirstChild("World") or Workspace:FindFirstChild("Map") or Workspace:FindFirstChild("Stage")
                    
                    if currentMap and currentMap ~= LastKnownMap then
                        LastKnownMap = currentMap
                        state.IsTeleporting = true
                        HardResetScanner()
                        
                        task.wait(3) -- Settle time for map assets
                        UpdateScanner()
                        state.IsTeleporting = false
                    end

                    -- Gamemode Persistence Logic
                    local currentGamemode = (Omni.Data and Omni.Data.Gamemode) or "None"
                    if currentGamemode ~= LastGamemodeState then
                        local entering = currentGamemode ~= "None"
                        local leaving = currentGamemode == "None"

                        if entering and LastGamemodeState == "None" then
                            -- Entering Gamemode
                            state._OverworldFarmState_WF = state.Farm
                            state.Farm = false
                            if getgenv().MasterFarmToggle_WF then getgenv().MasterFarmToggle_WF:Set(false) end
                            
                            -- [ DYNAMIC NOTIFICATION ]
                            pcall(function()
                                if getgenv().NebubloxWindow then
                                    getgenv().NebubloxWindow:Notify({
                                        Title = "Farm Paused",
                                        Content = "Manual gamemode join detected. Smart combat will resume upon teleporting.",
                                        Type = "info",
                                        Duration = 8
                                    })
                                else
                                    game:GetService("StarterGui"):SetCore("SendNotification", {
                                        Title = "Nebublox: Farm Paused",
                                        Text = "Manual gamemode join detected. Resuming upon return.",
                                        Duration = 8
                                    })
                                end
                            end)
                        elseif leaving and LastGamemodeState ~= "None" then
                            -- Leaving Gamemode
                            if state._OverworldFarmState_WF ~= nil then
                                state.Farm = state._OverworldFarmState_WF
                                if getgenv().MasterFarmToggle_WF then getgenv().MasterFarmToggle_WF:Set(state.Farm) end
                            end
                        end
                        LastGamemodeState = currentGamemode
                    end
                end
            end)
            task.wait(1)
        end
    end)

    local function FindBestTarget()
        -- [ STICKY TARGET ] Prioritize staying on the current target until it dies
        if state.CurrentTarget and IsEnemyValid(state.CurrentTarget) then
            return state.CurrentTarget
        end

        local best = nil
        local char = player.Character
        local root = char and char:FindFirstChild("HumanoidRootPart")
        if not root then return nil end

        -- 1. Priority Override logic (Gamemodes, Bosses & Ores)
        local isGamemode = (Omni.Data and Omni.Data.Gamemode and Omni.Data.Gamemode ~= "None") or Workspace:FindFirstChild("TimeTrialRoom") or Workspace:FindFirstChild("DragonDefense") or Workspace:FindFirstChild("TempestInvasion") or Workspace:FindFirstChild("Raid") or Workspace:FindFirstChild("SpecialRaid")
        
        if state.State_GlobalBossPriority or state.State_OrePriority or isGamemode then
            local allEnemies = GetEnemies(true) -- Full map scan
            local bestTarget = nil
            local bestDist = math.huge
            local bestTier = 0 -- 4: Gamemode, 3: Colored Ore, 2: Regular Ore, 1: Boss
            
            local colors = {"red", "green", "blue", "yellow", "purple", "pink", "orange", "white", "black", "cyan", "lime", "teal", "magenta", "gold", "diamond", "emerald", "ruby", "sapphire"}

            for _, mob in ipairs(allEnemies) do
                if IsEnemyValid(mob) then
                    local mRoot = mob:FindFirstChild("HumanoidRootPart") or mob.PrimaryPart
                    if mRoot then
                        local dist = (mRoot.Position - root.Position).Magnitude
                        local name = mob.Name:lower()
                        local tier = 0

                        -- Tier 4: Gamemode (Absolute Top)
                        if isGamemode then
                            tier = 4
                        end

                        -- Tier 3/2: Ores
                        if tier < 3 and state.State_OrePriority then
                            if name:find("ore") or name:find("ingot") or name:find("crystal") then
                                tier = 2 -- Default ore tier
                                for _, color in ipairs(colors) do
                                    if name:find(color) then
                                        tier = 3 -- Colored ore tier (#1 priority in ores)
                                        break
                                    end
                                end
                            end
                        end

                        -- Tier 1: Bosses
                        if tier < 1 and state.State_GlobalBossPriority then
                            if name:find("sakana") or name:find("satoro") or name:find("yuje") or name:find("hanna") then
                                tier = 1 -- Boss tier
                            end
                        end

                        -- Selection logic
                        if tier > bestTier then
                            bestTier = tier
                            bestTarget = mob
                            bestDist = dist
                        elseif tier > 0 and tier == bestTier then
                            if dist < bestDist then
                                bestTarget = mob
                                bestDist = dist
                            end
                        end
                    end
                end
            end
            
            if bestTarget then
                state.CurrentTarget = bestTarget
                return bestTarget
            end
        end


        local enemies = GetEnemies()
        if #enemies == 0 then return nil end
        local isGamemode = Omni.Data and Omni.Data.Gamemode and Omni.Data.Gamemode ~= "None"

        local bestPri, bestSec = nil, nil
        local bestPriDistSq, bestSecDistSq = math.huge, math.huge
        local useAll = table.find(state.SecondaryTargetNames, "All") ~= nil or isGamemode

        for _, mob in ipairs(enemies) do
            if IsEnemyValid(mob) then
                local name = GetRealEnemyName(mob)
                local mRoot = mob:FindFirstChild("HumanoidRootPart") or mob.PrimaryPart
                
                if mRoot and mRoot.Parent then
                    local diff = mRoot.Position - root.Position
                    local distSq = (diff.X * diff.X) + (diff.Y * diff.Y) + (diff.Z * diff.Z)

                    if state.PriorityTargetName ~= "None" and (name == state.PriorityTargetName or mob.Name == state.PriorityTargetName) then
                        if distSq < bestPriDistSq then
                            bestPriDistSq = distSq
                            bestPri = mob
                        end
                    elseif useAll or table.find(state.SecondaryTargetNames, name) or table.find(state.SecondaryTargetNames, mob.Name) then
                        if distSq < bestSecDistSq then
                            bestSecDistSq = distSq
                            bestSec = mob
                        end
                    end
                end
            end
        end

        local finalTarget = bestPri or bestSec



        state.CurrentTarget = finalTarget
        return finalTarget
    end

    local function GetNearbyEnemies(radius)
        local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
        if not root then return {} end

        local nearby = {}
        local radiusSq = radius * radius

        for _, mob in ipairs(CachedEnemies) do 
            if IsEnemyValid(mob) then
                local mRoot = mob:FindFirstChild("HumanoidRootPart") or (mob:IsA("Model") and mob.PrimaryPart) or (mob:IsA("BasePart") and mob)
                if mRoot then
                    local diff = mRoot.Position - root.Position
                    local distSq = (diff.X * diff.X) + (diff.Y * diff.Y) + (diff.Z * diff.Z)
                    
                    if distSq <= radiusSq then
                        table.insert(nearby, mob)
                        if #nearby >= 50 then break end 
                    end
                end
            end
        end
        return nearby
    end

    local VFX_Pool = { Cache = {} }
    function VFX_Pool:Get(name, class, props)
        self.Cache[name] = self.Cache[name] or {}
        local inst = nil
        if #self.Cache[name] > 0 then inst = table.remove(self.Cache[name]) 
        else
            inst = Instance.new(class)
            if class == "Frame" then
                local corner = Instance.new("UICorner")
                corner.CornerRadius = UDim.new(1, 0)
                corner.Parent = inst
            end
        end
        for k, v in pairs(props or {}) do inst[k] = v end
        return inst
    end

    function VFX_Pool:Return(name, inst)
        if not inst then return end
        inst.Parent = nil
        table.insert(self.Cache[name], inst)
    end

    local function SpawnBurst(targetPos)
        local screenGui = player.PlayerGui:FindFirstChild("NebubloxUI") or player.PlayerGui:FindFirstChild("Main")
        if not screenGui then return end
        
        local viewportPoint, onScreen = Workspace.CurrentCamera:WorldToViewportPoint(targetPos)
        if not onScreen then return end
        
        local center = UDim2.fromOffset(viewportPoint.X, viewportPoint.Y)
        for i = 1, 6 do
            local p = VFX_Pool:Get("BurstPart", "Frame", {
                Size = UDim2.fromOffset(12, 12), Position = center,
                AnchorPoint = Vector2.new(0.5, 0.5), BackgroundColor3 = Color3.fromRGB(255, 215, 0),
                Parent = screenGui, ZIndex = 11, BackgroundTransparency = 0
            })

            local angle = math.rad(math.random(0, 360))
            local dist = math.random(40, 100)
            local t = TweenService:Create(p, TweenInfo.new(0.6, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {
                Position = UDim2.new(center.X.Scale, center.X.Offset + math.cos(angle) * dist, center.Y.Scale, center.Y.Offset + math.sin(angle) * dist),
                BackgroundTransparency = 1, Size = UDim2.fromOffset(0, 0)
            })
            t:Play()
            t.Completed:Connect(function() VFX_Pool:Return("BurstPart", p) end)
        end
    end

    local RadiusInstance, RadiusTween, CurrentTargetVFX = nil, nil, nil
    local function TweenRadiusVFX(targetSize)
        if not RadiusInstance then return end
        if RadiusTween then RadiusTween:Cancel(); RadiusTween = nil end
        RadiusTween = TweenService:Create(RadiusInstance, TweenInfo.new(0.25), {
            Size = Vector3.new(targetSize, RadiusInstance.Size.Y, targetSize),
            Transparency = (targetSize < 1) and 1 or 0.4
        })
        RadiusTween:Play()
    end

    getgenv().NebuMaid:Add(RunService.Heartbeat:Connect(function()
        if not state.Nebublox_Running then return end
        
        local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
        if not root or not state.ShowRadius or not state.Farm then
            if RadiusInstance then 
                TweenRadiusVFX(0.1)
                task.wait(0.25)
                if RadiusInstance then RadiusInstance:Destroy(); RadiusInstance = nil end 
            end
            return
        end

        local target = state.CurrentTarget
        if not target then 
            if RadiusInstance then TweenRadiusVFX(0.1) end 
            return 
        end

        local tRoot = (target:IsA("Model") and target.PrimaryPart) or target:FindFirstChild("HumanoidRootPart") or (target:IsA("BasePart") and target)
        if not tRoot then return end

        if not RadiusInstance then
            RadiusInstance = Instance.new("Part")
            RadiusInstance.Name = "NebuRadius_Client"
            RadiusInstance.Shape = Enum.PartType.Cylinder
            RadiusInstance.Rotation = Vector3.new(0, 0, 90)
            RadiusInstance.Material = Enum.Material.ForceField
            RadiusInstance.Color = Color3.fromRGB(255, 215, 0)
            RadiusInstance.CastShadow = false
            RadiusInstance.CanCollide = false
            RadiusInstance.Transparency = 1
            RadiusInstance.Size = Vector3.new(0.1, 14, 14)
            RadiusInstance.Parent = Workspace
        end

        RadiusInstance.CFrame = CFrame.new(tRoot.Position.X, tRoot.Position.Y - 2.9, tRoot.Position.Z) * CFrame.Angles(0, 0, math.rad(90))
        
        if CurrentTargetVFX ~= target then
            TweenRadiusVFX(14)
            CurrentTargetVFX = target
            SpawnBurst(tRoot.Position)
        end
    end))

    local CachedCharParts = {}
    local function UpdateCharCache(char)
        CachedCharParts = {}
        if not char then return end
        for _, p in ipairs(char:GetDescendants()) do
            if p:IsA("BasePart") then table.insert(CachedCharParts, p) end
        end
    end
    UpdateCharCache(player.Character)


    getgenv().NebuMaid:Add(player.CharacterAdded:Connect(function(newChar)
        UpdateCharCache(newChar)
        
        if state.Farm then
            state.Farm = false 
            task.spawn(function()
                local root = newChar:WaitForChild("HumanoidRootPart", 5)
                if not root then return end
                
                task.wait(1) 
                
                -- Wipe caches to prevent targeting glitches on respawn
                state.CurrentTarget = nil
                LastCacheUpdate = 0
                CachedEnemies = {}
                EnemyNameCache = {}
                KillBlacklist = {}
                
                UpdateScanner()
                state.Farm = true
                
                if getgenv().NebubloxWindow then 
                    getgenv().NebubloxWindow:Notify({Title = "Automation", Content = "Character Respawned. Farming resumed.", Type = "success"}) 
                end
            end)
        end
    end))

    getgenv().NebuMaid:Add(player.Idled:Connect(function()
        if state.AntiAfkEnabled then
            pcall(function()
                VirtualUser:CaptureController()
                VirtualUser:ClickButton2(Vector2.new())
            end)
        end
    end))

    local Nebublox = getgenv().Nebublox
    if not Nebublox or not Nebublox.Version then
        Nebublox = (function()
            local function GetLocal(path)
                if isfile and readfile then
                    local ok, content = pcall(readfile, path)
                    if ok and content and (content:find("NEBUBLOX UI") or content:find("SUPERNOVA")) then return content end
                end
                return nil
            end
            
            local paths = {
                "NebubloxUI.lua", 
                "scripts/NebubloxUI.lua", 
                "DarkMatterV1-main/scripts/NebubloxUI.lua",
                "NebubloxUI-main/NebubloxUI.lua", 
                "./NebubloxUI.lua"
            }
            
            local rawCode = nil
            for _, p in ipairs(paths) do
                rawCode = GetLocal(p)
                if rawCode then break end
            end
            
            if not rawCode then
                local s, res = pcall(game.HttpGet, game, "https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxUI.lua")
                if s and (res:find("NEBUBLOX UI") or res:find("SUPERNOVA")) then 
                    rawCode = res
                else
                    local s2, res2 = pcall(game.HttpGet, game, "https://raw.githubusercontent.com/Nebublox/DarkMatterV1/main/scripts/NebubloxUI.lua")
                    if s2 and (res2:find("NEBUBLOX UI") or res2:find("SUPERNOVA")) then 
                        rawCode = res2 
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
                        error("[NEBUBLOX] Execution Error: " .. tostring(result or "Unknown error"))
                    end
                else
                    error("[NEBUBLOX] Compilation Error: " .. tostring(compileErr or "Syntax error in source"))
                end
            end
            error("[NEBUBLOX] CRITICAL: Library source not found. Check your internet or local files.")
        end)()
    end
    if not Nebublox then return end

    local Window = Nebublox:CreateWindow({
        Title = "WORLD FIGHTERS", Subtitle = "World Fighters", Size = UDim2.new(0, 530, 0, 320),
        KeySystem = true, Profile = true, Color = Color3.fromRGB(255, 215, 0), SecondaryColor = Color3.fromRGB(255, 120, 0),
        TitleGradient = true, CyberBackground = true, AntiDetect = true 
    }, state)
    getgenv().NebubloxWindow = Window



    
    Window:AddStandardHome()
    Window:AddConsole()
    
    local function SyncStats()
        pcall(function()
            local lStats = player:FindFirstChild("leaderstats") or player:FindFirstChild("Leaderstats")
            local awakening = (lStats and lStats:FindFirstChild("Awakening")) and lStats.Awakening.Value or 0
            local crystals = (lStats and lStats:FindFirstChild("Crystals")) and lStats.Crystals.Value or 0
            local power = (lStats and lStats:FindFirstChild("Power")) and lStats.Power.Value or 0
            local data = player:FindFirstChild("Data")
            local equippedTitle = data and (data:GetAttribute("Title") or (data:FindFirstChild("Title") and data.Title.Value)) or "None"
            local targetName = state.CurrentTarget and GetRealEnemyName(state.CurrentTarget) or "Scanning..."

            pcall(function()
                local char = workspace:FindFirstChild(player.Name)
                local hud = char and char:FindFirstChild("Head") and char.Head:FindFirstChild("PlayerHUD")
                local titleObj = hud and hud.Main.TitleSystem:FindFirstChild("UID")
                
                if titleObj then
                    Window:SetProfileSubtitle(titleObj.Text, titleObj.TextColor3)
                end
                
                Window:SetSidebarStats({
                    {Icon = "rbxassetid://98509406097152", Text = "<b>Crystals:</b> " .. tostring(crystals), Color = "0 0.517647 0.784314 0.988235 0 1 0.517647 0.784314 0.988235 0"},
                    {Icon = "rbxassetid://90705933935891", Text = "<b>Power:</b> " .. tostring(power), Color = "0 1 0.0196078 0.141176 0 1 1 0.0196078 0.141176 0"},
                    {Icon = "rbxassetid://78845030498961", Text = "<b>Awakening:</b> " .. tostring(awakening), Color = "0 0.607843 1 0.0196078 0 1 0.607843 1 0.0196078 0"},
                    {Icon = "rbxassetid://79416636625038", Text = "<b>Target:</b> <font color='#FFD700'>" .. tostring(targetName) .. "</font>", Color = "0 1 0.843137 0 0 1 1 0.843137 0 0"},
                })
            end)
        end)
    end

    task.spawn(function()
        local Omni = GetOmniData()
        if Omni and Omni.OnDataChanged then
            Omni:OnDataChanged({"Location"}, function()
                state.IsTeleporting = true
                task.wait(2)
                HardResetScanner()
                UpdateScanner()
                state.IsTeleporting = false
                print("[NEBUBLOX] Reactive Sync: World Transition Complete.")
            end)
            
            -- Re-sync stats on change
            SyncStats()
        end
        
        while state.Nebublox_Running do
            SyncStats()
            task.wait(5) -- Fallback slow sync
        end
    end)


    task.spawn(function()
        local t = 0
        local c1_base = Color3.fromRGB(240, 240, 240) 
        local c2_base = Color3.fromRGB(0, 255, 150) 
        if Window and Window.SubtitleLabel then Window.SubtitleLabel.Text = "WORLD FIGHTERS" end

        local connection
        connection = RunService.RenderStepped:Connect(function(deltaTime)
            if not state.Nebublox_Running or not Window or not Window.SubtitleLabel then
                if connection then connection:Disconnect() end
                return
            end
            t = t + (deltaTime * 2)
            local alpha = (math.sin(t) + 1) / 2
            Window.SubtitleLabel.TextColor3 = c1_base:Lerp(c2_base, alpha)
        end)
    end)

    local CombatTab = Window:AddTab({
        Name = "Combat", 
        Icon = "rbxassetid://126278616654469",
        Color = "0 1 0.294118 0.894118 0 0.190141 1 0.294118 0.894118 0 0.191901 0.972549 0.0196078 0.607843 0 0.40669 0.972549 0.0196078 0.607843 0 0.411 1 0.294118 0.894118 0 0.612676 1 0.294118 0.894118 0 0.614437 0.972549 0.0196078 0.607843 0 0.795775 0.972549 0.0196078 0.607843 0 0.8 1 0.294118 0.894118 0 1 1 0.294118 0.894118 0"
    })
    CombatTab:AddLabel({
        Text = "<b><font color='#00E6FF'>[INFO]:</font></b> Gamemodes joined in-game will automatically pause farming and resume upon return.",
        Size = 16
    })
    CombatTab:AddLabel({
        Text = "<b><font color='#FFA500'>[BOSS]:</font></b> Global Boss Priority requires being in Cursed Bridge (World 8).",
        Size = 14
    })
    CombatTab:AddLabel({
        Text = "<b><font color='#00FF00'>[ORES]:</font></b> Ores Priority requires being in Leveling City (World 9).",
        Size = 14
    })
    local WorldTab = Window:AddTab({
        Name = "Worlds", 
        Icon = "rbxassetid://84868754191236",
        Color = "0 0.607843 1 0.0196078 0 0.195423 0.607843 1 0.0196078 0 0.198944 0.0666667 0.831373 0 0 0.411 0.0666667 0.831373 0 0 0.413732 0.607843 1 0.0196078 0 0.598592 0.607843 1 0.0196078 0 0.605634 0.0666667 0.831373 0 0 0.820423 0.0666667 0.831373 0 0 0.822183 0.607843 1 0.0196078 0 1 0.607843 1 0.0196078 0"
    })
    
    local PassTab = Window:AddTab({
        Name = "Passives", 
        Icon = "rbxassetid://110223681385226",
        Color = "0 0.74902 0 1 0 0.478873 0.466667 0 1 0 1 0.74902 0 1 0"
    })
    local EnchantTab = Window:AddTab({
        Name = "Enchants", 
        Icon = "rbxassetid://75007242349308",
        Color = "0 0.74902 0 1 0 0.478873 0.466667 0 1 0 1 0.74902 0 1 0"
    })
    local MiscTab = Window:AddTab({
        Name = "Miscellaneous", 
        Icon = "rbxassetid://136730208706001",
        Color = "0 0.952941 1 0 0 0.2 0.952941 1 0 0 0.2 0.961924 1 0.19088 0 0.201 0.972549 0.768627 0.0196078 0 0.410211 0.972549 0.768627 0.0196078 0 0.411 0.952941 1 0 0 0.63 0.952941 1 0 0 0.631 0.972549 0.768627 0.0196078 0 0.799 0.972549 0.768627 0.0196078 0 0.8 0.952941 1 0 0 1 0.952941 1 0 0"
    })


    local MiscSec = MiscTab:AddSection({Name = "<b><font color='#FFFF00' size='30'>Utilities & Rewards</font></b>", Icon = "rbxassetid://129656121402264", IconSize = 28})
    

    MiscSec:AddButton({
        Name = "<b><font color='#ffffff' size='24'>Redeem All Codes</font></b>",
        Gradient = UNIVERSE_GRADIENT,
        InteractionIcon = "rbxassetid://74318287976238",
        Callback = function()
            task.spawn(function()
                for _, code in ipairs(AutoCodesList) do
                    FireOmniSignal("General", "Codes", "Redeem", code)
                    task.wait(0.5)
                end
                if getgenv().NebubloxWindow then
                    getgenv().NebubloxWindow:Notify({Title = "Codes", Content = "Finished Redeeming All Codes!", Type = "success"})
                end
            end)
        end
    })

    MiscSec:AddToggle({
        Name = "<b><font color='#ffffff' size='22'>Auto-Claim Battlepass</font></b>",
        Content = "Automatically claims all available Battlepass rewards",
        Default = state.State_AutoBattlepass,
        Callback = function(v) state.State_AutoBattlepass = v end
    })




    
    local UnitSec = PassTab:AddSection({Name = "<b><font color='#00E6FF'>UNIT SELECTION</font></b>", Icon = "rbxassetid://135121999531322", IconSize = 24})
    local ForgeSec = PassTab:AddSection({Name = "<b><font color='#00E6FF'>PASSIVE FORGE</font></b>", Icon = "rbxassetid://70903685664143", IconSize = 24})

    local unitRow = UnitSec:AddRow({Columns = 2})
    unitDropdown = unitRow[1]:AddDropdown({
        Name = "Target Unit",
        Options = {"None"},
        Default = "None",
        Callback = function(v)
            selectedUnitUID = unitMapping[v] or "None"
        end
    })
unitRow[2]:AddButton({ Name = "Refresh List", Icon = "RefreshCw", Callback = function() RefreshUnits() end })

local function GetOmniData()
    local Omni = nil
    
    -- Try direct require with timeout
    pcall(function() 
        local mod = game:GetService("ReplicatedStorage"):WaitForChild("Omni", 3)
        if mod then Omni = require(mod) end
    end)
    
    -- Validate required structure
    if Omni and type(Omni) == "table" and Omni.Data and Omni.Signal then
        return Omni
    end
    
    -- Fallback: GC Search (more reliable if module is a proxy/loader)
    if getgc then
        for _, v in pairs(getgc(true)) do
            if type(v) == "table" and rawget(v, "Data") and rawget(v, "Signal") and rawget(v, "Shared") then
                local d = rawget(v, "Data")
                if type(d) == "table" and (rawget(d, "Inventory") or rawget(d, "Location")) then
                    return v
                end
            end
        end
    end
    
    return Omni
end

local function RefreshUnits()
    local options = {"None"}
    unitMapping = {} 
    pcall(function()
        local Omni = GetOmniData()
        local inventory = Omni.Data and Omni.Data.Inventory and Omni.Data.Inventory.Units
        
        if inventory then
            for uid, unitData in pairs(inventory) do
                local name = tostring(unitData.CustomName or unitData.Name or "Unknown Unit")
                local passive = (unitData.Passive and unitData.Passive ~= "None") and (" [" .. tostring(unitData.Passive) .. "]") or ""
                local shortID = tostring(uid):sub(1, 8)
                local displayText = string.format("%s%s | ID: %s...", name, passive, shortID)
                table.insert(options, displayText)
                unitMapping[displayText] = uid
            end
        end
    end)
    table.sort(options, function(a, b) return a < b end)
    if unitDropdown then
        if unitDropdown.Refresh then unitDropdown:Refresh(options)
        elseif unitDropdown.UpdateOptions then unitDropdown:UpdateOptions(options) end
    end
end

local swordDropdown = nil 
local function RefreshSwords()
    local options = {"None"}
    swordMapping = {}
    pcall(function()
        local Omni = GetOmniData()
        local inventory = Omni.Data and Omni.Data.Inventory and Omni.Data.Inventory.Swords
        
        if inventory then
            for uid, swordData in pairs(inventory) do
                local name = tostring(swordData.CustomName or swordData.Name or "Unknown Sword")
                local enchant = (swordData.Enchant and swordData.Enchant ~= "None") and (" [" .. tostring(swordData.Enchant) .. "]") or ""
                local shortID = tostring(uid):sub(1, 8)
                local displayText = string.format("%s%s | ID: %s...", name, enchant, shortID)
                table.insert(options, displayText)
                swordMapping[displayText] = uid
            end
        end
    end)
    table.sort(options, function(a, b) return a < b end)
    if swordDropdown then
        if swordDropdown.Refresh then swordDropdown:Refresh(options)
        elseif swordDropdown.UpdateOptions then swordDropdown:UpdateOptions(options) end
    end
end




local RarityData = {
    ["Common"] = {Color = Color3.new(1, 1, 1), Grad = "0 1 1 1 0 1 0.533333 0.533333 0.533333 0"},
    ["Uncommon"] = {Color = Color3.new(0, 1, 0), Grad = "0 0 1 0 0 1 0.439216 1 0.4 0"},
    ["Rare"] = {Color = Color3.new(0, 0.615686, 1), Grad = "0 0 0.615686 1 0 1 0.4 0.811765 1 0"},
    ["Epic"] = {Color = Color3.new(0.8, 0, 1), Grad = "0 0.8 0 1 0 1 0.882353 0.454902 1 0"},
    ["Legendary"] = {Color = Color3.new(1, 0.5, 0), Grad = "0 1 0.5 0 0 1 1 1 0 0"},
    ["Mythical"] = {Color = Color3.new(1, 0, 0.5), Grad = "0 1 0 0.5 0 0.2 0.8 0 1 0 0.4 0.3 0.9 0.1 0 0.6 0.1 0.7 0.7 0 0.8 1 0.2 0.2 0 1 1 0 0.5 0"}
}

local function ColorPerk(text)
    local result = text
    result = result:gsub("Gacha Luck", "<font color='#CF9FFF'>Gacha Luck</font>")
    result = result:gsub("Luck", "<font color='#00FF00'>Luck</font>")
    result = result:gsub("Crystals", "<font color='#A020F0'>Crystals</font>")
    result = result:gsub("Damage", "<font color='#FF4545'>Damage</font>")
    result = result:gsub("Power", "<font color='#FF4545'>Power</font>")
    result = result:gsub("Drops", "<font color='#00FFFF'>Drops</font>")
    result = result:gsub("Cursed Finger", "<font color='#FF0000'>Cursed Finger</font>")
    return result
end

    for _, rarity in ipairs({"Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythical"}) do
        local hasItems = false
        for _, data in pairs(PassiveSheet) do
            if data.Rarity == rarity then hasItems = true; break end
        end
        
        if hasItems then
            local rInfo = RarityData[rarity]
            local sub = ForgeSec:AddSubSection({Name = rarity, Color = rInfo.Color, Gradient = rInfo.Grad})
            
            local sortedPassives = {}
            for name, data in pairs(PassiveSheet) do
                local d = {}
                for k, v in pairs(data) do d[k] = v end
                d.Name = name
                table.insert(sortedPassives, d)
            end
            table.sort(sortedPassives, function(a, b) return (a.Index or 0) < (b.Index or 0) end)

            for _, pData in ipairs(sortedPassives) do
                local pName = pData.Name
                if pData.Rarity == rarity then
                    local row = sub:AddRow({Columns = {0.8, 0.2}})
                    row[1]:AddLabel({
                        Title = "<b>" .. pName .. "</b>", 
                        Content = ColorPerk(pData.Perk),
                        Gradient = rInfo.Grad
                    })
                    
                    local assetList = {}
                    for _, item in ipairs(pData.Items) do
                        table.insert(assetList, {Icon = MaterialIcons[item.Name] or "", Amount = item.Amount})
                    end
                    row[1]:AddAssets({Assets = assetList, IconSize = 44})
                    
                    row[2]:AddButton({
                        Name = "",
                        Icon = pData.Icon,
                        IconSize = UDim2.new(0, 44, 0, 44),
                        Callback = function()
                            FireOmniSignal("Forge", "Passives", "Craft", pName)
                        end
                    })
                end
            end
        end
    end

    local SwordSec = EnchantTab:AddSection({Name = "<b><font color='#00E6FF'>SWORD SELECTION</font></b>", Icon = "rbxassetid://140104617332310", IconSize = 24})
    local EnchSec = EnchantTab:AddSection({Name = "<b><font color='#00E6FF'>ENCHANT FORGE</font></b>", Icon = "rbxassetid://70903685664143", IconSize = 24})
    local AutoEnchSec = EnchantTab:AddSection({Name = "<b><font color='#00FF00'>AUTO ENCHANT CONTROLLER</font></b>", Icon = "rbxassetid://132736622789289"})

    local swordRow = SwordSec:AddRow({Columns = 2})
    swordDropdown = swordRow[1]:AddDropdown({
        Name = "Target Sword",
        Options = {"None"},
        Default = "None",
        Callback = function(v)
            state.SelectedEnchantSword = swordMapping[v] or "None"
        end
    })
    swordRow[2]:AddButton({ Name = "Refresh List", Icon = "RefreshCw", Callback = function() RefreshSwords() end })

    for _, rarity in ipairs({"Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythical"}) do
        local hasItems = false
        for _, data in pairs(EnchantSheet) do
            if data.Rarity == rarity then hasItems = true; break end
        end

        if hasItems then
            local rInfo = RarityData[rarity]
            local sub = EnchSec:AddSubSection({Name = rarity, Color = rInfo.Color, Gradient = rInfo.Grad})
            
            local sortedEnchants = {}
            for name, data in pairs(EnchantSheet) do
                local d = {}
                for k, v in pairs(data) do d[k] = v end
                d.Name = name
                table.insert(sortedEnchants, d)
            end
            table.sort(sortedEnchants, function(a, b) return (a.Index or 0) < (b.Index or 0) end)

            for _, eData in ipairs(sortedEnchants) do
                local eName = eData.Name
                if eData.Rarity == rarity then
                    local row = sub:AddRow({Columns = {0.8, 0.2}})
                    row[1]:AddLabel({
                        Title = "<b>" .. eName .. "</b>", 
                        Content = ColorPerk(eData.Perk),
                        Gradient = rInfo.Grad
                    })
                    
                    local assetList = {}
                    for _, item in ipairs(eData.Items) do
                        table.insert(assetList, {Icon = MaterialIcons[item.Name] or "", Amount = item.Amount})
                    end
                    row[1]:AddAssets({Assets = assetList, IconSize = 44})
                    
                    row[2]:AddButton({
                        Name = "",
                        Icon = eData.Icon,
                        IconSize = UDim2.new(0, 44, 0, 44),
                        Callback = function()
                            FireOmniSignal("Forge", "Enchants", "Craft", eName)
                        end
                    })
                end
            end
        end
    end

    AutoEnchSec:AddToggle({
        Name = "<b><font color='#00FF00' size='24'>Enable Auto Enchant</font></b>",
        Default = state.AutoEnchant,
        Callback = function(v) state.AutoEnchant = v end
    })

    local targetDropdown = AutoEnchSec:AddDropdown({
        Name = "Set Target Enchant",
        Options = {"None"},
        Default = state.TargetEnchant or "None",
        Callback = function(v)
            state.TargetEnchant = v
        end
    })

    -- Populate target enchants
    task.spawn(function()
        local options = {"None"}
        for name, _ in pairs(EnchantSheet) do table.insert(options, name) end
        table.sort(options)
        if targetDropdown.Refresh then targetDropdown:Refresh(options)
        elseif targetDropdown.UpdateOptions then targetDropdown:UpdateOptions(options) end
    end)


task.spawn(RefreshUnits)
task.spawn(RefreshSwords)
task.spawn(function()
    local Omni = require(game:GetService("ReplicatedStorage"):WaitForChild("Omni"))
    if Omni.WaitInitialization then Omni:WaitInitialization() end
    Omni:OnDataChanged({"Inventory", "Units"}, RefreshUnits)
    Omni:OnDataChanged({"Inventory", "Swords"}, RefreshSwords)
end)
    
    local FarmSec = CombatTab:AddSection({Name = "", Icon = "rbxassetid://126278616654469", IconSize = 28})

local accentColor = "#00E6FF"
local secondaryColor = "#BBBBBB"



    local farmRows = FarmSec:AddRow({Columns = 1})
    getgenv().MasterFarmToggle_WF = farmRows[1]:AddToggle({ 
        Name = "<b><font color='#FFFFFF' size='22'>Master Combat</font></b>", 
        Scale = 1.1, 
        Default = state.Farm, 
        Callback = function(v) 
            state.Farm = v 
        end 
    })



    local radiusRows = FarmSec:AddRow({Columns = 1})
    radiusRows[1]:AddSlider({
        Name = "Scanner Radius", 
        Min = 50, Max = 1000, Default = 250, 
        Callback = function(v) state.ScannerRadius = v end 
    })

local farmGrid = FarmSec:AddRow({Columns = 2})

state.PriorityDropdownReference = farmGrid[1]:AddDropdown({ 
    Name = "Priority Target", 
    Options = {"None"}, 
    Default = "None", 
    Callback = function(v) state.PriorityTargetName = v end 
})

farmGrid[2]:AddButton({
    Name = "Scan Targets", 
    Gradient = UNIVERSE_GRADIENT, 
    InteractionIcon = "rbxassetid://84868754191236",
    Callback = function()
        local enemies = UpdateScanner()
        if #enemies > 0 then
            Window:Notify({Title = "Scanner", Content = "Found " .. #enemies .. " valid targets in range.", Type = "success"})
        else
            Window:Notify({Title = "Scanner", Content = "No targets found in radius.", Type = "warning"})
        end
    end
})

state.SecondaryDropdownReference = FarmSec:AddRow({Columns = 1})[1]:AddMultiDropdown({ 
    Name = "Secondary Targets", 
    Options = {"All"}, 
    Default = {"All"}, 
    Callback = function(v) state.SecondaryTargetNames = v end 
})

local priorityRow = FarmSec:AddRow({Columns = 2})
priorityRow[1]:AddToggle({Name = "<b>Global Boss Priority</b>", Icon = "rbxassetid://134391516786914", Default = state.State_GlobalBossPriority, Callback = function(v) state.State_GlobalBossPriority = v end})
priorityRow[2]:AddToggle({Name = "<b>Ore Priority Autofarm</b>", Icon = "rbxassetid://94813260715675", Default = state.State_OrePriority, Callback = function(v) state.State_OrePriority = v end})

local priorityRow = FarmSec:AddRow({Columns = 1})
priorityRow[1]:AddLabel({
    Title = "<b><font color='#FF4500'>Priority Targeting Info</font></b>",
    Content = "Boss Priority: World 8 (Cursed Bridge)\nOre Priority: World 9 (Leveling City)"
})
    
    local PIECE_ICON = "rbxassetid://84868754191236" 
    local BALL_ICON = "rbxassetid://84868754191236"
    local SLIME_ICON = "rbxassetid://84868754191236"

    local WorldBanners = {
        ["Dressrosa"]          = "rbxassetid://92807971625808",
        ["Marine Fortress"]    = "rbxassetid://137390991563554",
        ["Capsule Corp"]       = "rbxassetid://110010172324719",
        ["Dragon Arena"]       = "rbxassetid://111712858676482",
        ["Jura Forest"]        = "rbxassetid://105465496502732",
        ["Tempest Federation"] = "rbxassetid://74866609640387",
        ["Sorcerers Academy"]  = "rbxassetid://134391516786914",
        ["Cursed Bridge"]      = "rbxassetid://95573093421792",
        ["Leveling City"]      = "rbxassetid://75907419780452",
        ["Double Dungeon"]     = "rbxassetid://110414935875126",
        ["Soul Society"]       = "rbxassetid://78780716919821",
        ["Hueco Mundo"]        = "rbxassetid://113487643731425",
        ["Bizzare City"]       = "rbxassetid://78780716919821",
        ["Ghoul Verse"]        = "rbxassetid://76582729805716"
    }

    getgenv().LiveStarToggles = {}
    local function AddWorldEntry(section, name, customTitle)
        local bannerImg = WorldBanners[name] or "rbxassetid://84868754191236"
        
        section:AddBanner({
            Title = customTitle or name,
            Image = bannerImg,
            Callback = function()
                local data = TeleportLocations[name]
                if data then
                    NativeUniverseJump(data[1], data[2]) 
                    Window:Notify({Title = "Teleport", Content = "Traveling to " .. name .. "...", Type = "info"})
                else
                    Window:Notify({Title = "Error", Content = "Location data not found!", Type = "error"})
                end
            end
        })

        getgenv().LiveStarToggles[name] = section:AddToggle({
            Name = "<b><font color='rgb(251, 255, 0)'>Hatch Stars</font></b>",
            Icon = "rbxassetid://121576052286314",
            Scale = 1.2,
            Default = (state.AutoHatch and state.ActiveHatchWorld == name),
            Callback = function(v)
                if v then
                    state.ActiveHatchWorld = name
                    state.AutoHatch = true
                    for wName, tObj in pairs(getgenv().LiveStarToggles) do
                        if wName ~= name then tObj:Set(false) end
                    end
                else
                    if state.ActiveHatchWorld == name then state.AutoHatch = false end
                end
            end
        })
    end

    
    getgenv().LiveGachaToggles = {}
    getgenv().LiveProgressionToggles = {}
    getgenv().LiveUpgradeToggles = {}
    local PieceSec = WorldTab:AddSection({Name = ""})
    AddWorldEntry(PieceSec, "Dressrosa")

    getgenv().LiveGachaToggles["Haki"] = PieceSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Haki</font></b>", Icon = "rbxassetid://113977775253617", Scale = 1.2, Default = state.State_Haki, Callback = function(v) state.State_Haki = v end})

    AddWorldEntry(PieceSec, "Marine Fortress")
    getgenv().LiveProgressionToggles["Pirate Evolution"] = PieceSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Pirate Evolution</font></b>", Icon = "rbxassetid://101964740082644", Scale = 1.2, Default = state.State_PirateEvolution, Callback = function(v) state.State_PirateEvolution = v end})

    getgenv().LiveGachaToggles["Fruit"] = PieceSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Fruit</font></b>", Icon = "rbxassetid://91646636717059", Scale = 1.2, Default = state.State_Fruit, Callback = function(v) state.State_Fruit = v end})
    
    getgenv().LiveProgressionToggles["Fighting Style"] = PieceSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Fighting Style</font></b>", Icon = "rbxassetid://135121999531322", Scale = 1.2, Default = state.State_FightingStyle, Callback = function(v) 
        state.State_FightingStyle = v 
        if v then FireOmniSignal("General", "Progression", "Auto", "Fighting Style") end
    end})
    
    getgenv().LiveGachaToggles["Swords Banner"] = PieceSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Swords Banner</font></b>", Icon = "rbxassetid://81917577910216", Scale = 1.2, Default = state.State_Swords, Callback = function(v) state.State_Swords = v end})

    local BallSec = WorldTab:AddSection({Name = ""})
    AddWorldEntry(BallSec, "Capsule Corp")

    
    getgenv().LiveProgressionToggles["Ki Progression"] = BallSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Ki Progression</font></b>", Icon = "rbxassetid://87275771276137", Scale = 1.2, Default = state.State_KiProgress, Callback = function(v) 
        state.State_KiProgress = v 
        if v then FireOmniSignal("General", "Progression", "Auto", "Ki Progression") end
    end})
    
    getgenv().LiveGachaToggles["Race"] = BallSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Race</font></b>", Icon = "rbxassetid://96800168523602", Scale = 1.2, Default = state.State_Race, Callback = function(v) state.State_Race = v end})
    
    AddWorldEntry(BallSec, "Dragon Arena")

    getgenv().LiveGachaToggles["Dragon Power"] = BallSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Dragon Powers</font></b>", Icon = "rbxassetid://129368975488195", Scale = 1.2, Default = state.State_DragonPower, Callback = function(v) state.State_DragonPower = v end})
    getgenv().LiveGachaToggles["Dragon Wish"] = BallSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Dragon Wish</font></b>", Icon = "rbxassetid://137748653402824", Scale = 1.2, Default = state.State_DragonWish, Callback = function(v) state.State_DragonWish = v end})

    local SlimeSec = WorldTab:AddSection({Name = ""})
    AddWorldEntry(SlimeSec, "Jura Forest")

    getgenv().LiveGachaToggles["Slime Power"] = SlimeSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Slime Powers</font></b>", Icon = "rbxassetid://104999865771471", Scale = 1.2, Default = state.State_SlimePower, Callback = function(v) state.State_SlimePower = v end})
    
    getgenv().LiveProgressionToggles["Demon Lord Progression"] = SlimeSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Demon Lord Progression</font></b>", Icon = "rbxassetid://104999865771471", Scale = 1.2, Default = state.State_DemonLord, Callback = function(v) 
        state.State_DemonLord = v 
        if v then FireOmniSignal("General", "Progression", "Auto", "Demon Lord Progression") end
    end})

    AddWorldEntry(SlimeSec, "Tempest Federation")

    getgenv().LiveGachaToggles["Primordial Demon"] = SlimeSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Primordial Demons</font></b>", Icon = "rbxassetid://88434197646609", Scale = 1.2, Default = state.State_PrimordialDemons, Callback = function(v) state.State_PrimordialDemons = v end})

    local ExpansionSec = WorldTab:AddSection({Name = ""})
    AddWorldEntry(ExpansionSec, "Sorcerers Academy")

    
    getgenv().LiveGachaToggles["Cursed Technique"] = ExpansionSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Cursed Technique</font></b>", Icon = "rbxassetid://118751489500577", Scale = 1.2, Default = state.State_CursedTechnique, Callback = function(v) state.State_CursedTechnique = v end})
    getgenv().LiveGachaToggles["Fighters Banner"] = ExpansionSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Fighters Banner</font></b>", Icon = "rbxassetid://105774108148457", Scale = 1.2, Default = state.State_FightersBanner, Callback = function(v) state.State_FightersBanner = v end})
    
    getgenv().LiveProgressionToggles["Domain Progression"] = ExpansionSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Domain Progression</font></b>", Icon = "rbxassetid://107649831679729", Scale = 1.2, Default = state.State_DomainProg, Callback = function(v) 
        state.State_DomainProg = v 
        if v then FireOmniSignal("General", "Progression", "Auto", "Domain Progression") end
    end})
   
    AddWorldEntry(ExpansionSec, "Cursed Bridge")
    getgenv().LiveGachaToggles["Cursed Spirit"] = ExpansionSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Cursed Spirit</font></b>", Icon = "rbxassetid://91741168240997", Scale = 1.2, Default = state.State_CursedSpirit, Callback = function(v) state.State_CursedSpirit = v end})

    local LevelingSec = WorldTab:AddSection({Name = "<b><font color='#00E6FF'>LEVELING VERSE</font></b>"})
    LevelingSec:AddLabel({
        Title = "<b><font color='#FF4500'>Priority Targeting</font></b>",
        Content = "<font color='#FF6347'>Global Bosses and Ores are priority targets here, no matter what.</font>"
    })
    AddWorldEntry(LevelingSec, "Leveling City")
    getgenv().LiveGachaToggles["Hunter Rank"] = LevelingSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Hunter Rank</font></b>", Icon = "rbxassetid://122734423948981", Scale = 1.2, Default = state.State_HunterRank, Callback = function(v) state.State_HunterRank = v end})
    getgenv().LiveProgressionToggles["Monarch Evolution"] = LevelingSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Monarch Evolution</font></b>", Icon = "rbxassetid://138866770945851", Scale = 1.2, Default = state.State_MonarchEvolution, Callback = function(v) state.State_MonarchEvolution = v end})
    getgenv().LiveProgressionToggles["System Progression"] = LevelingSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>System Progression</font></b>", Icon = "rbxassetid://81061727248918", Scale = 1.2, Default = state.State_SystemProg, Callback = function(v) 
        state.State_SystemProg = v 
    end})
    AddWorldEntry(LevelingSec, "Double Dungeon")
    getgenv().LiveGachaToggles["Monarch Awakening"] = LevelingSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Monarch Awakening</font></b>", Icon = "rbxassetid://76624253376900", Scale = 1.2, Default = state.State_MonarchAwakening, Callback = function(v) state.State_MonarchAwakening = v end})

    local ShinobiSec = WorldTab:AddSection({Name = "<b><font color='#00E6FF'>SHINOBI VERSE</font></b>"})

    getgenv().LiveGachaToggles["Dojutsu"] = ShinobiSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Dojutsu</font></b>", Icon = "rbxassetid://113977775253617", Scale = 1.2, Default = state.State_Dojutsu, Callback = function(v) state.State_Dojutsu = v end})
    getgenv().LiveGachaToggles["Ninja Clan"] = ShinobiSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Ninja Clan</font></b>", Icon = "rbxassetid://135121999531322", Scale = 1.2, Default = state.State_NinjaClan, Callback = function(v) state.State_NinjaClan = v end})
    getgenv().LiveUpgradeToggles["Ninja Elements"] = ShinobiSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Ninja Elements</font></b>", Icon = "rbxassetid://84868754191236", Scale = 1.2, Default = state.State_NinjaElements, Callback = function(v) state.State_NinjaElements = v end})

    local HollowSec = WorldTab:AddSection({Name = "<b><font color='#00E6FF'>HOLLOW VERSE</font></b>"})

    AddWorldEntry(HollowSec, "Soul Society")
    getgenv().LiveGachaToggles["Gotei Hierarchy"] = HollowSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Gotei Hierarchy</font></b>", Icon = "rbxassetid://78204221381750", Scale = 1.2, Default = state.State_GoteiHierarchy, Callback = function(v) state.State_GoteiHierarchy = v end})
    getgenv().LiveProgressionToggles["Hogyoku Progression"] = HollowSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Hogyoku Progression</font></b>", Icon = "rbxassetid://104909514801776", Scale = 1.2, Default = state.State_HogyokuProgression, Callback = function(v) state.State_HogyokuProgression = v end})

    AddWorldEntry(HollowSec, "Hueco Mundo")
    getgenv().LiveGachaToggles["Espada Rank"] = HollowSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Espada Rank</font></b>", Icon = "rbxassetid://113487643731425", Scale = 1.2, Default = state.State_EspadaRank, Callback = function(v) state.State_EspadaRank = v end})

    local BizzareSec = WorldTab:AddSection({Name = "<b><font color='#00E6FF'>BIZZARE VERSE</font></b>"})

    AddWorldEntry(BizzareSec, "Bizzare City")
    getgenv().LiveGachaToggles["Hamon Power"] = BizzareSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Hamon Power</font></b>", Icon = "rbxassetid://75119621475827", Scale = 1.2, Default = state.State_HamonPower, Callback = function(v) state.State_HamonPower = v end})
    getgenv().LiveProgressionToggles["Blood Absorption"] = BizzareSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Blood Absorption</font></b>", Icon = "rbxassetid://127089975783121", Scale = 1.2, Default = state.State_BloodAbsorption, Callback = function(v) 
        state.State_BloodAbsorption = v 
        if v then FireOmniSignal("General", "Progression", "Auto", "Blood Absorption") end
    end})
    BizzareSec:AddToggle({
        Name = "<b><font color='#ff0000' size='20'>Auto Spawn Boss (Cars)</font></b>",
        Icon = "rbxassetid://134391516786914",
        Scale = 1.2,
        Default = state.AutoSpawnCarsBoss,
        Callback = function(v) state.AutoSpawnCarsBoss = v end
    })

    local GhoulSec = WorldTab:AddSection({Name = "<b><font color='#00E6FF'>GHOUL VERSE</font></b>"})

    AddWorldEntry(GhoulSec, "Ghoul Verse")
    getgenv().LiveGachaToggles["CCG Rank"] = GhoulSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>CCG Rank</font></b>", Icon = "rbxassetid://83975284793870", Scale = 1.2, Default = state.State_CCGRank, Callback = function(v) state.State_CCGRank = v end})
    getgenv().LiveProgressionToggles["Investigador Progression"] = GhoulSec:AddToggle({Name = "<b><font color='#ffffff' size='20'>Investigador Progression</font></b>", Icon = "rbxassetid://135545807037278", Scale = 1.2, Default = state.State_InvestigadorProg, Callback = function(v) 
        state.State_InvestigadorProg = v 
        if v then FireOmniSignal("General", "Progression", "Auto", "Investigador Progression") end
    end})

    
    
    -- Link Refresh to the dropdown
    local oldRefresh = RefreshUnits
    RefreshUnits = function()
        oldRefresh()
        local options = {"None"}
        pcall(function()
            local Omni = GetOmniData()
            local inventory = Omni.Data and Omni.Data.Inventory and Omni.Data.Inventory.Units
            if inventory then
                for uid, unitData in pairs(inventory) do
                    local name = tostring(unitData.CustomName or unitData.Name or "Unknown Unit")
                    local shortID = tostring(uid):sub(1, 8)
                    local displayText = string.format("%s | ID: %s...", name, shortID)
                    table.insert(options, displayText)
                end
            end
        end)
    end

    -- Reward functions already integrated into consolidated loop

    task.spawn(function()
    end)

    

    getgenv().OnTargetChanged = getgenv().OnTargetChanged or (Signal and (Signal.new or Signal.New) and (Signal.new or Signal.New)()) or {Connect = function() end, Fire = function() end}
    getgenv().NebuMaid:Add(getgenv().OnTargetChanged:Connect(function(newTarget)
        local targetName = newTarget and GetRealEnemyName(newTarget) or "Scanning..."
        if LiveScannerLabel then LiveScannerLabel:SetText(targetName) end
    end))
    
    local lastTarget, targetStartTime = nil, 0
    task.spawn(function()
        while state.Nebublox_Running do
            local isGamemode = (Omni.Data and Omni.Data.Gamemode and Omni.Data.Gamemode ~= "None") or Workspace:FindFirstChild("TimeTrialRoom") or Workspace:FindFirstChild("DragonDefense") or Workspace:FindFirstChild("TempestInvasion") or Workspace:FindFirstChild("Raid") or Workspace:FindFirstChild("SpecialRaid")
            if (state.Farm or isGamemode) and not state.IsTeleporting then
                local char = player.Character
                local root = char and char:FindFirstChild("HumanoidRootPart")
                
                -- Physics Stability Check
                if root and root.AssemblyLinearVelocity.Magnitude > 100 then
                    task.wait(0.5)
                    continue
                end

                local best = FindBestTarget()
                state.CurrentTarget = best
                if best and best == lastTarget then
                    local elapsed = tick() - targetStartTime
                    local maxTime = 0.5
                    
                    if elapsed > maxTime then 
                        KillBlacklist[best] = tick() + 3
                        state.CurrentTarget = nil
                        targetStartTime = tick() 
                    end
                else 
                    lastTarget = best
                    targetStartTime = tick() 
                end
            end
            task.wait()
        end
    end)

    task.spawn(function()
        while state.Nebublox_Running do
            local isGamemode = (Omni.Data and Omni.Data.Gamemode and Omni.Data.Gamemode ~= "None") or Workspace:FindFirstChild("TimeTrialRoom") or Workspace:FindFirstChild("DragonDefense") or Workspace:FindFirstChild("TempestInvasion") or Workspace:FindFirstChild("Raid") or Workspace:FindFirstChild("SpecialRaid")
            if state.Farm or isGamemode then
                local flashTargets = GetNearbyEnemies(60)
                local hitCount = 0
                for _, mob in ipairs(flashTargets) do
                    if mob and mob.Parent then
                        pcall(function() 
                            FireOmniSignal("General", "Combat", "Attack", mob)
                            FireOmniSignal("General", "Combat", "Click")
                        end)
                        hitCount = hitCount + 1
                        if hitCount >= 30 then break end
                    end
                end
            end
            task.wait(0.04) 
        end
    end)

    task.spawn(function()
        while state.Nebublox_Running do
            local isGamemode = (Omni.Data and Omni.Data.Gamemode and Omni.Data.Gamemode ~= "None") or Workspace:FindFirstChild("TimeTrialRoom") or Workspace:FindFirstChild("DragonDefense") or Workspace:FindFirstChild("TempestInvasion") or Workspace:FindFirstChild("Raid") or Workspace:FindFirstChild("SpecialRaid")
            pcall(UpdateScanner)
            task.wait((state.Farm or isGamemode) and 1 or 5)
        end
    end)

    getgenv().NebuMaid:Add(RunService.Stepped:Connect(function(_, dt)
        if not state.Nebublox_Running or state.IsTeleporting then return end 
        local char = player.Character; local root = char and char:FindFirstChild("HumanoidRootPart")
        local isGamemode = (Omni.Data and Omni.Data.Gamemode and Omni.Data.Gamemode ~= "None") or Workspace:FindFirstChild("TimeTrialRoom") or Workspace:FindFirstChild("DragonDefense") or Workspace:FindFirstChild("TempestInvasion") or Workspace:FindFirstChild("Raid") or Workspace:FindFirstChild("SpecialRaid")
        
        if (state.Farm or isGamemode) and root then
            if state.Noclip then
                for _, p in ipairs(CachedCharParts) do
                    if p.Parent then p.CanCollide = false end
                end
            end

            local target = state.CurrentTarget
            if target then
                local tRoot = target:FindFirstChild("HumanoidRootPart") or (target:IsA("Model") and target.PrimaryPart) or (target:IsA("BasePart") and target)
                if tRoot then
                    root.AssemblyLinearVelocity = Vector3.zero
                    root.AssemblyAngularVelocity = Vector3.zero
                    
                    local currentPos = root.Position
                    local targetPos = tRoot.Position
                    local diff = currentPos - targetPos
                    
                    local direction = diff.Magnitude > 0.01 and diff.Unit or Vector3.new(0, 0, 1)
                    local standPos = targetPos + (direction * (state.FarmDistance or 7.5))
                    root.CFrame = CFrame.lookAt(standPos, targetPos)

                    
                    local float = Workspace:FindFirstChild("Nebufloat")
                    if state.NebuFloat then
                        if not float then
                            float = Instance.new("Part")
                            float.Name = "Nebufloat"
                            float.Size = Vector3.new(25, 1, 25)
                            float.Transparency = 1
                            float.Anchored = true
                            float.CanCollide = true
                            float.Parent = Workspace
                        end
                        float.CFrame = root.CFrame * CFrame.new(0, -3.6, 0)
                    elseif float then
                        float:Destroy()
                    end
                end
            end
        end
    end))

    local function DailyClaim()
        pcall(function()
            local rewardCont = SafeGet(player, "PlayerGui", "UI", "Frames", "DailyRewards", "Background", "Main", "Rewards")
            if not rewardCont then return end
            for i = 1, 30 do
                local reward = rewardCont:FindFirstChild(tostring(i))
                if reward and reward:FindFirstChild("Collectable") and reward.Collectable.Visible then
                    FireOmniSignal("General", "DailyRewards", "Claim", i)
                end
            end
        end)
    end

    local function TimeRewardsClaim()
        pcall(function()
            local mainFrame = SafeGet(player, "PlayerGui", "UI", "Frames", "TimeRewards", "Background", "Main")
            if not mainFrame then return end
            for i = 1, 12 do
                local reward = mainFrame:FindFirstChild(tostring(i))
                if reward and reward:FindFirstChild("Collectable") and reward.Collectable.Visible then
                    FireOmniSignal("General", "TimeRewards", "Claim", i)
                end
            end
        end)
    end

task.spawn(function()
        while task.wait(1) do
            if not state.Nebublox_Running then break end
            
            local loopSuccess, loopError = pcall(function()
                local Omni = GetOmniData()
                if not Omni then 
                    if tick() % 10 < 1 then warn("[NEBUBLOX] Waiting for Omni Data...") end
                    return 
                end
                
                local currentGamemode = (Omni and Omni.Data and Omni.Data.Gamemode) or "None"
                getgenv()._lastNebuGamemode = getgenv()._lastNebuGamemode or "None"

                -- [ AUTO CACHE ON JOIN ]
                if getgenv()._lastNebuGamemode == "None" and currentGamemode ~= "None" then
                    if not state.SavedFarmPos then
                        state.SavedFarmPos = player.Character and player.Character:GetPivot()
                        state.SavedFarmWorld = (Omni.Data and Omni.Data.Location and Omni.Data.Location[1])
                        print("[NEBUBLOX] Automatic Gamemode Entry Detected. Overworld position cached.")
                    end
                    if state._OverworldFarmState_WF == nil then
                        state._OverworldFarmState_WF = state.Farm
                    end
                    state.Farm = false -- Suspend farm during gamemode
                    HardResetScanner()
                end
                
                if tick() % 15 < 1 then
                    print(string.format("[NEBUBLOX] Heartbeat - Gamemode: %s, World: %s", tostring(currentGamemode), (Omni.Data and Omni.Data.Location and Omni.Data.Location[1]) or "Unknown"))
                end

                if getgenv()._lastNebuGamemode ~= "None" and currentGamemode == "None" then
                    print("[NEBUBLOX] Gamemode Ended. Returning to original position...")
                    if state.SavedFarmPos or state.ManualReturnPos then
                        -- Suspend everything during the transition
                        state.IsTeleporting = true
                        
                        task.delay(4, function()
                            -- Wipe gamemode caches completely
                            HardResetScanner()
                            
                            local returnCF = state.ManualReturnPos or state.SavedFarmPos
                            if returnCF then
                                -- [ WORLD SYNC ]: Ensure we are in the correct universe before teleporting
                                local targetWorld = state.ManualReturnWorld
                                local targetIndex = state.ManualReturnWorldIndex
                                if targetWorld then
                                    local currentWorld = (Omni and Omni.Data and Omni.Data.Location and Omni.Data.Location[1]) or "Unknown"
                                    if currentWorld ~= targetWorld then
                                        print("[NEBUBLOX] World Mismatch during return. Jumping to: " .. tostring(targetWorld))
                                        TeleportToZone("Zone - " .. tostring(targetWorld) .. " - " .. tostring(targetIndex or 1))
                                        task.wait(5)
                                    end
                                end
                                
                                local char = player.Character
                                if char and char:FindFirstChild("HumanoidRootPart") then
                                    char.HumanoidRootPart.CFrame = returnCF
                                    print("[NEBUBLOX] Successfully returned to farm spot.")
                                end
                            end
                            state.IsTeleporting = false
                            
                            -- Restore overworld farm if it was active
                            if state._OverworldFarmState_WF then
                                state.Farm = true
                                if getgenv().MasterFarmToggle_WF then getgenv().MasterFarmToggle_WF:Set(true) end
                                state._OverworldFarmState_WF = nil
                            end
                        end)
                    end
                end
                
                getgenv()._lastNebuGamemode = currentGamemode
            end) -- END OF PCALL
            if not loopSuccess and loopError then
                warn("[NEBUBLOX] Background Loop Error: " .. tostring(loopError))
            end

            -- MISC SYNC (Must be outside the pcall above)
            if tick() - (state.LastMiscSync or 0) > 2 then
                if tick() - (state.LastUpgradeCheck or 0) > 3 then
                    if state.State_TrialUpgrades then SmartAutoUpgrade("Trial Upgrades") end
                    if state.State_TempestUpgrades then SmartAutoUpgrade("Tempest Upgrades") end
                    state.LastUpgradeCheck = tick()
                end

                if state.AutoDivision then pcall(function() RemoteUtil.New("Division"):FireServer() end) end
                if state.AutoIgnition then pcall(function() RemoteUtil.New("Ignition"):FireServer() end) end

                if tick() - (state.LastSkillTreeCheck or 0) > 5 then
                    if state.State_PirateEvolution then SmartAutoSkillTree("Pirate Evolution") end
                    if state.State_MonarchEvolution then SmartAutoSkillTree("Monarch Evolution") end
                    if state.State_KiProgress then SmartAutoSkillTree("Ki Progress") end
                    if state.State_DemonLord then SmartAutoSkillTree("Demon Lord Progression") end
                    if state.State_SystemProg then SmartAutoProgression("System Progression") end
                    if state.State_BloodAbsorption then SmartAutoProgression("Blood Absorption") end
                    if state.State_NinjaElements then SmartAutoUpgrade("Ninja Elements") end
                    state.LastSkillTreeCheck = tick()
                end

                state.LastMiscSync = tick()
            end
        end
    end)


    -- [ GACHA / HATCH SERVICE ]
    task.spawn(function()
        while task.wait() do
            if not state.Nebublox_Running then break end
            pcall(function()
                if tick() - (state.LastGachaRoll or 0) >= 0.1 then
                    if state.AutoHatch then
                        local gData = GachaActions[state.GachaIndex]
                        if gData and state[gData.StateToggle] then
                            FireOmniSignal(unpack(gData.Args))
                        end
                        state.GachaIndex = (state.GachaIndex % #GachaActions) + 1
                        state.LastGachaRoll = tick()
                    end
                end
            end)
        end
    end)


    local function UpdateGachaToggles()
        pcall(function()
            local Omni = GetOmniData()
            if not Omni.Data or not Omni.Data.Gacha then return end
            local activeToggles = getgenv().LiveGachaToggles
            if not activeToggles then return end

            for categoryName, toggle in pairs(activeToggles) do
                local gachaData = Omni.Data.Gacha[categoryName]
                local currentItem = gachaData and gachaData.Current or "None"
                local shared = Omni.Shared.Gacha.List[categoryName]
                local rarity = "Common"
                
                if shared and shared.SourceInfo and shared.SourceInfo[currentItem] then
                    rarity = shared.SourceInfo[currentItem].Rarity or "Common"
                end

                local color = typeof(GetRarityColor) == "function" and GetRarityColor(rarity) or Color3.fromRGB(255, 255, 255)
                local hex = Color3ToHex(color)
                
                local labelName = categoryName:gsub("s$", "") 
                local newText = string.format("<b><font color='%s' size='20'>%s</font> <font color='%s'>[%s]</font></b>", hex, labelName, hex, currentItem)
                
                if toggle.SetTitle then toggle:SetTitle(newText)
                elseif toggle.Title then toggle.Title.Text = newText end
            end
        end)
    end

    local function SetupInventoryWatcher()
        local inv = player:FindFirstChild("Data") and player.Data:FindFirstChild("Inventory")
        if not inv then return end

        local function GetItemIcon(itemName)
            local icon = nil
            pcall(function()
                local Omni = require(game:GetService("ReplicatedStorage"):WaitForChild("Omni"))
                if Omni.Shared and Omni.Shared.Gacha and Omni.Shared.Gacha.Sources then
                    for _, categoryData in pairs(Omni.Shared.Gacha.Sources) do
                        if categoryData[itemName] and categoryData[itemName].Icon then
                            icon = categoryData[itemName].Icon
                            break
                        end
                    end
                end
            end)
            return icon
        end

        local function NotifyAcquisition(item, categoryLabel, toggleName)
            task.delay(0.5, function() 
                local rarity = item:GetAttribute("Rarity") or "Common"
                local name = item.Name
                local liveIcon = GetItemIcon(name)
                local activeToggle = getgenv().LiveGachaToggles and getgenv().LiveGachaToggles[toggleName]
                
                if activeToggle then
                    local newText = toggleName .. " [" .. getGradient(name, rarity) .. "]"
                    pcall(function()
                        if activeToggle.SetTitle then activeToggle:SetTitle(newText)
                        elseif activeToggle.Title then activeToggle.Title.Text = newText end
                        if liveIcon then
                            if activeToggle.SetIcon then activeToggle:SetIcon(liveIcon)
                            elseif activeToggle.Icon then activeToggle.Icon.Image = liveIcon end
                        end
                    end)
                end

                local color = typeof(GetRarityColor) == "function" and GetRarityColor(rarity) or Color3.fromRGB(255, 255, 255)
                local hex = Color3ToHex(color)
                
                if Window then
                    Window:Notify({
                        Title = "<b>" .. categoryLabel .. " ACQUIRED</b>",
                        Content = "Rolled: <b><font color='" .. hex .. "'>" .. name .. "</font></b> (" .. rarity .. ")",
                        Type = "Info", Color = color
                    })
                end
            end)
        end

        local categories = { 
            ["Haki"] = {Label = "HAKI", ToggleKey = "Haki"}, 
            ["Fruits"] = {Label = "FRUIT", ToggleKey = "Fruit"}, 
            ["Dragon Powers"] = {Label = "DRAGON POWER", ToggleKey = "Dragon Power"},
            ["Slime Powers"] = {Label = "SLIME POWER", ToggleKey = "Slime Power"},
            ["Race"] = {Label = "RACE", ToggleKey = "Race"},
            ["Primordial Demons"] = {Label = "DEMON", ToggleKey = "Primordial Demon"},
            ["Cursed Techniques"] = {Label = "CURSED TECHNIQUE", ToggleKey = "Cursed Technique"},
            ["Fighters Banners"] = {Label = "BANNER", ToggleKey = "Fighters Banner"},
            ["Hunter Ranks"] = {Label = "HUNTER RANK", ToggleKey = "Hunter Rank"},
            ["Monarch Awakenings"] = {Label = "AWAKENING", ToggleKey = "Monarch Awakening"},
            ["Dojutsus"] = {Label = "DOJUTSU", ToggleKey = "Dojutsu"},
            ["Ninja Clans"] = {Label = "NINJA CLAN", ToggleKey = "Ninja Clan"},
            ["Gotei Hierarchys"] = {Label = "GOTEI", ToggleKey = "Gotei Hierarchy"},
            ["Cursed Spirits"] = {Label = "CURSED SPIRIT", ToggleKey = "Cursed Spirit"},
            ["Espada Ranks"] = {Label = "ESPADA", ToggleKey = "Espada Rank"},
            ["Hamon Powers"] = {Label = "HAMON", ToggleKey = "Hamon Power"},
            ["CCG Ranks"] = {Label = "CCG RANK", ToggleKey = "CCG Rank"}
        }
        
        for folderName, data in pairs(categories) do
            local folder = inv:FindFirstChild(folderName)
            if folder then
                getgenv().NebuMaid:Add(folder.ChildAdded:Connect(function(child)
                    if state.Nebublox_Running then 
                        NotifyAcquisition(child, data.Label, data.ToggleKey)
                        
                        -- [ AUTO-LOCK SECURITY ]
                        local rarity = child:GetAttribute("Rarity") or "Common"
                        if rarity == "Secret" or rarity == "Mythical" then
                            task.delay(1, function()
                                FireOmniSignal("General", "Inventory", "Lock", folderName, child.Name)
                                print("[NEBUBLOX] Security: Auto-locked " .. rarity .. " acquisition - " .. child.Name)
                            end)
                        end
                    end
                end))
            end
        end
    end

    SetupInventoryWatcher()

    local function UpdateProgressionToggles()
        pcall(function()
            local Omni = require(game:GetService("ReplicatedStorage"):WaitForChild("Omni"))
            if not Omni.Data or not Omni.Data.Progression then return end
            if not Omni.Shared or not Omni.Shared.Progression then return end
            local activeToggles = getgenv().LiveProgressionToggles
            if not activeToggles then return end

            local progToState = {
                ["Fighting Style"] = "State_FightingStyle",
                ["Ki Progression"] = "State_KiProgress",
                ["Demon Lord Progression"] = "State_DemonLord",
                ["Domain Progression"] = "State_DomainProg",
                ["System Progression"] = "State_SystemProg",
                ["Blood Absorption"] = "State_BloodAbsorption",
                ["Investigador Progression"] = "State_InvestigadorProg"
            }

            for progName, toggle in pairs(activeToggles) do
                local currentLvl = Omni.Data.Progression[progName] or 0
                local progData = Omni.Shared.Progression.List[progName]
                local maxLvl = progData and progData.MaxLevel or 100
                
                -- Bi-directional Sync
                local gameAuto = Omni.Data.ProgressionAuto and Omni.Data.ProgressionAuto[progName]
                local stateKey = progToState[progName]
                if gameAuto ~= nil and stateKey and state[stateKey] ~= gameAuto then
                    state[stateKey] = gameAuto
                    if toggle.Set then toggle:Set(gameAuto) end
                end

                local rarity = "Common"
                if progData and progData.Levels and progData.Levels[currentLvl] then
                    rarity = progData.Levels[currentLvl].Rarity or "Common"
                end
                local color = typeof(GetRarityColor) == "function" and GetRarityColor(rarity) or Color3.fromRGB(255, 255, 255)
                local hex = Color3ToHex(color)

                local newText = progName
                if currentLvl >= maxLvl then 
                    local secretHex = Color3ToHex(GetRarityColor("Secret"))
                    newText = string.format("<b><font color='%s'>%s [Completed]</font></b>", secretHex, progName)
                else 
                    newText = string.format("<b><font color='%s'>%s</font> <font color='#ffffff'>[%d/%d]</font></b>", hex, progName, currentLvl, maxLvl)
                end
                
                if toggle.SetTitle then toggle:SetTitle(newText)
                elseif toggle.Title then toggle.Title.Text = newText end
            end
        end)
    end

    task.spawn(UpdateProgressionToggles)
    task.spawn(UpdateGachaToggles)
    task.spawn(function()
        pcall(function()
            local Omni = require(game:GetService("ReplicatedStorage"):WaitForChild("Omni"))
            if Omni.WaitInitialization then Omni:WaitInitialization() end
            Omni:OnDataChanged({"Progression"}, function() UpdateProgressionToggles() end)
            Omni:OnDataChanged({"ProgressionAuto"}, function() UpdateProgressionToggles() end)
            Omni:OnDataChanged({"Gacha"}, function() UpdateGachaToggles() end)
        end)
    end)

    local function UpdateUpgradeToggles()
        pcall(function()
            local Omni = require(game:GetService("ReplicatedStorage"):WaitForChild("Omni"))
            if not Omni.Data or not Omni.Data.Upgrade then return end
            if not Omni.Shared or not Omni.Shared.Upgrade then return end
            local activeToggles = getgenv().LiveUpgradeToggles
            if not activeToggles then return end

            for categoryName, toggle in pairs(activeToggles) do
                local categoryData = Omni.Shared.Upgrade.List[categoryName]
                local playerUpgrades = Omni.Data.Upgrade[categoryName] or {}
                if categoryData then
                    local currentTotalLevel = 0
                    local absoluteMaxLevel = 0
                    for perkName, perkData in pairs(categoryData.Upgrades) do
                        absoluteMaxLevel = absoluteMaxLevel + perkData.MaxLevel
                        currentTotalLevel = currentTotalLevel + (playerUpgrades[perkName] or 0)
                    end
                    local newText = categoryName
                    if currentTotalLevel >= absoluteMaxLevel then 
                        local secretHex = Color3ToHex(GetRarityColor("Secret"))
                        newText = string.format("<b><font color='%s'>%s [Completed]</font></b>", secretHex, categoryName)
                    else 
                        newText = string.format("<b>%s [%d/%d]</b>", categoryName, currentTotalLevel, absoluteMaxLevel)
                    end
                    if toggle.SetTitle then toggle:SetTitle(newText)
                    elseif toggle.Title then toggle.Title.Text = newText end
                end
            end
        end)
    end

    task.spawn(UpdateUpgradeToggles)
    task.spawn(function()
        pcall(function()
            local Omni = require(game:GetService("ReplicatedStorage"):WaitForChild("Omni"))
            if Omni.WaitInitialization then Omni:WaitInitialization() end
            Omni:OnDataChanged({"Upgrade"}, function() UpdateUpgradeToggles() end)
        end)
    end)


    task.spawn(function()
        local OmniR = GetOmniData()
        
        while state.Nebublox_Running do
            if state.AutoTimeRewards then
                pcall(function()
                    
                    if not OmniR.Data or not OmniR.Data.TimeRewards then return end
                    
                    local timePlayed = OmniR.Data.TimeRewards.Time or 0
                    local claimedRewards = OmniR.Data.TimeRewards.Claimed or {}
                    local timeRewardsList = OmniR.Shared.TimeRewards
                    
                    local allClaimed = true
                    
                    
                    for rewardId = 1, #timeRewardsList do
                        local rewardInfo = timeRewardsList[rewardId]
                        local strId = tostring(rewardId)
                        
                        
                        if not claimedRewards[strId] then
                            allClaimed = false 
                            
                            
                            if timePlayed >= rewardInfo.Time then
                                OmniR.Signal:Fire("General", "TimeRewards", "Claim", rewardId)
                                task.wait(0.5) 
                            end
                        end
                    end
                    
                    
                    if allClaimed then
                        task.wait(1)
                        OmniR.Signal:Fire("General", "TimeRewards", "Reset")
                        
                        if getgenv().NebubloxWindow then
                            getgenv().NebubloxWindow:Notify({
                                Title = "Time Rewards", 
                                Content = "5-Hour cycle complete. Claimed all rewards and reset timer!", 
                                Type = "success"
                            })
                        end
                    end
                end)
            end
            task.wait(60) 
        end
    end)

    -- Auto Hatching Worker
    task.spawn(function()
        local StarMapping = {
            ["Dressrosa"]          = "World 1",
            ["Marine Fortress"]    = "World 2",
            ["Capsule Corp"]       = "World 3",
            ["Dragon Arena"]       = "World 4",
            ["Jura Forest"]        = "World 5",
            ["Tempest Federation"] = "World 6",
            ["Sorcerers Academy"]  = "World 7",
            ["Cursed Bridge"]      = "World 8",
            ["Leveling City"]      = "World 9",
            ["Double Dungeon"]     = "World 10",
            ["Soul Society"]       = "World 11",
            ["Hueco Mundo"]        = "World 12",
            ["Bizzare City"]       = "World 13",
            ["Ghoul Verse"]        = "World 14"
        }

        while task.wait() do
            if not state.Nebublox_Running then break end
            if state.AutoHatch and state.ActiveHatchWorld ~= "None" then
                local internalName = StarMapping[state.ActiveHatchWorld] or state.ActiveHatchWorld
                local function GetMaxHatches()
                    local Omni = GetOmniData()
                    local data = Omni.Data
                    if not data then return 5 end
                    local base = data.MaxAllowedHatches or 1
                    local vip = (data.Gamepasses and data.Gamepasses.VIP) and 1 or 0
                    return math.max(1, base + vip)
                end
                
                local amount = GetMaxHatches()
                FireOmniSignal("General", "Stars", "Roll", internalName, {}, amount)
                FireOmniSignal("Player", "AntiAfk", "SetValue", "LastStar", internalName)
                task.wait(0.4)
            end
        end
    end)

    -- Auto Battlepass Worker
    task.spawn(function()
        while state.Nebublox_Running do
            if state.State_AutoBattlepass then
                pcall(function()
                    FireOmniSignal("General", "Battlepass", "ClaimAll")
                end)
            end
            task.wait(300) -- Claim every 5 minutes
        end
    end)

    -- Auto Chest Collection Worker
    task.spawn(function()
        while state.Nebublox_Running do
            if state.AutoChests then
                pcall(function()
                    local chests = {"Group Chest", "Daily Chest", "VIP Chest"}
                    for _, name in ipairs(chests) do
                        local chest = workspace:FindFirstChild(name, true)
                        if chest then
                            firetouchinterest(player.Character.HumanoidRootPart, chest.PrimaryPart or chest, 0)
                            firetouchinterest(player.Character.HumanoidRootPart, chest.PrimaryPart or chest, 1)
                        end
                    end
                end)
            end
            task.wait(30)
        end
    end)


    -- Auto Boss Spawner Worker
    task.spawn(function()
        while state.Nebublox_Running do
            if state.AutoSpawnCarsBoss then
                pcall(function()
                    local args = {
                        {
                            { "General", "SpawnBosses", "Spawn", "Cars", 1, n = 5 },
                            "\002"
                        }
                    }
                    game:GetService("ReplicatedStorage"):WaitForChild("BridgeNet"):WaitForChild("dataRemoteEvent"):FireServer(unpack(args))
                end)
            end
            task.wait(1.5)
        end
    end)

    -- Auto Enchant Worker
    task.spawn(function()
        while state.Nebublox_Running do
            if state.AutoEnchant and state.TargetEnchant ~= "None" and state.SelectedEnchantSword ~= "None" then
                pcall(function()
                    local Omni = GetOmniData()
                    local sword = Omni.Data and Omni.Data.Inventory and Omni.Data.Inventory.Swords and Omni.Data.Inventory.Swords[state.SelectedEnchantSword]
                    
                    if sword and sword.Enchant ~= state.TargetEnchant then
                        local eData = EnchantSheet[state.TargetEnchant]
                        if eData then
                            local canCraft = true
                            for _, item in ipairs(eData.Items) do
                                local owned = (Omni.Data.Inventory.Items and Omni.Data.Inventory.Items[item.Name]) or 0
                                if owned < item.Amount then canCraft = false; break end
                            end
                            
                            if canCraft then
                                FireOmniSignal("Forge", "Enchants", "Craft", state.TargetEnchant)
                                task.wait(1)
                            end
                        end
                    end
                end)
            end
            task.wait(1.5)
        end
    end)

    local oldOnDestroy = Window.OnDestroy
    Window.OnDestroy = function()
        if oldOnDestroy then pcall(oldOnDestroy) end
        CleanupPreviousInstance()
    end

    return Window
end
InitializeApp()
