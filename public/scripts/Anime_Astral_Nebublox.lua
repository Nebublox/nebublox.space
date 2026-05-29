getgenv().CleanupPreviousInstance = function()
    local stateKeys = {"NebuState_AnimeAstral"}
    for _, key in ipairs(stateKeys) do
        if getgenv()[key] then
            pcall(function() getgenv()[key].Nebublox_Running = false end)
            if getgenv()[key].MovementConnection then
                pcall(function() getgenv()[key].MovementConnection:Disconnect() end)
            end
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
        local char = game:GetService("Players").LocalPlayer.Character
        if char then
            for _, p in ipairs(char:GetDescendants()) do
                if p:IsA("BasePart") then p.CanCollide = true end
            end
        end
    end)
end

getgenv().InitializeApp = function()
    CleanupPreviousInstance()

    local success, err = pcall(function()
        local ReplicatedStorage = game:GetService("ReplicatedStorage")
        local Workspace = game:GetService("Workspace")
        local Players = game:GetService("Players")
        local RunService = game:GetService("RunService")
        local player = Players.LocalPlayer

        -- [ UTILITY MODULES ]
        local StringUtil = {
            Trim = function(str) return str:match("^%s*(.-)%s*$") end,
            TrimStart = function(str) return str:match("^%s*(.*)$") end,
            TrimEnd = function(str) return str:match("^(.-)%s*$") end,
            Split = function(str, sep)
                local t = {}
                for s in str:gmatch("([^" .. (sep or "%s") .. "]+)") do table.insert(t, s) end
                return t
            end,
            Join = function(t, sep) return table.concat(t, sep or "") end,
            StartsWith = function(str, prefix) return str:sub(1, #prefix) == prefix end,
            EndsWith = function(str, suffix) return str:sub(-#suffix) == suffix end,
            Contains = function(str, sub) return str:find(sub, 1, true) ~= nil end,
            Capitalize = function(str) return str:sub(1, 1):upper() .. str:sub(2):lower() end,
            CapitalizeWords = function(str)
                return str:gsub("(%a)([%w_\']*)", function(a, b) return a:upper() .. b:lower() end)
            end,
            Upper = function(str) return str:upper() end,
            Lower = function(str) return str:lower() end,
            Replace = function(str, pat, repl, n) return str:gsub(pat, repl, n) end,
            Repeat = function(str, n) return str:rep(n) end,
            Escape = function(str) return str:gsub("([%^%$%(%)%%%.%[%]%*%+%-%?])", "%%%1") end,
        }

        local TableUtil = {
            DeepCopy = function(orig)
                if type(orig) ~= "table" then return orig end
                local copy = {}
                for k, v in pairs(orig) do
                    copy[k] = type(v) == "table" and TableUtil.DeepCopy(v) or v
                end
                return setmetatable(copy, getmetatable(orig))
            end,
            ShallowCopy = function(orig)
                local copy = {}
                for k, v in pairs(orig) do copy[k] = v end
                return copy
            end,
            Keys = function(t)
                local keys = {}
                for k in pairs(t) do table.insert(keys, k) end
                return keys
            end,
            Values = function(t)
                local vals = {}
                for _, v in pairs(t) do table.insert(vals, v) end
                return vals
            end,
            Count = function(t)
                local count = 0
                for _ in pairs(t) do count = count + 1 end
                return count
            end,
        }

        local Suffixes = {
            "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg", "Tg", "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg", "Qag", "Uqag", "Dqag", "Tqag", "Qaqag", "Qiqag", "Sxqag", "Spqag", "Ocqag", "Noqag", "Qqg", "Uqqg", "Dqqg", "Tqqg", "Qaqqg", "Qiqqg", "Sxqqg", "Spqqg", "Ocqqg", "Noqqg", "Sg", "Usg", "Dsg", "Tsg", "Qasg", "Qisg", "Sxsg", "Spsg", "Ocsg", "Nosg", "Og", "Uog", "Dog", "Tog", "Qaog", "Qiog", "Sxog", "Spog", "Ocog", "Noog", "Ng", "Ung", "Dng", "Tng", "Qang", "Qing", "Sxng", "Spng", "Ocng", "Nong", "Ce", "Uce"
        }
        local SuffixMultipliers = {
            ["K"] = 1000, ["M"] = 1000000, ["B"] = 1000000000, ["T"] = 1000000000000, ["Qa"] = 1000000000000000, ["Qi"] = 1e18, ["Sx"] = 1e21, ["Sp"] = 1e24, ["Oc"] = 1e27, ["No"] = 1e30, ["Dc"] = 1e33, ["Ud"] = 1e36, ["Dd"] = 1e39, ["Td"] = 1e42, ["Qad"] = 1e45, ["Qid"] = 1e48, ["Sxd"] = 1e51, ["Spd"] = 1e54, ["Ocd"] = 1e57, ["Nod"] = 1e60, ["Vg"] = 1e63, ["Uvg"] = 1e66, ["Dvg"] = 1e69, ["Tvg"] = 1e72, ["Qavg"] = 1e75, ["Qivg"] = 1e78, ["Sxvg"] = 1e81, ["Spvg"] = 1e84, ["Ocvg"] = 1e87, ["Novg"] = 1e90, ["Tg"] = 1e93, ["Utg"] = 1e96, ["Dtg"] = 1e99, ["Ttg"] = 1e102, ["Qatg"] = 1e105, ["Qitg"] = 1e108, ["Sxtg"] = 1e111, ["Sptg"] = 1e114, ["Octg"] = 1e117, ["Notg"] = 1e120, ["Qag"] = 1e123, ["Uqag"] = 1e126, ["Dqag"] = 1e129, ["Tqag"] = 1e132, ["Qaqag"] = 1e135, ["Qiqag"] = 1e138, ["Sxqag"] = 1e141, ["Spqag"] = 1e144, ["Ocqag"] = 1e147, ["Noqag"] = 1e150, ["Qqg"] = 1e153, ["Uqqg"] = 1e156, ["Dqqg"] = 1e159, ["Tqqg"] = 1e162, ["Qaqqg"] = 1e165, ["Qiqqg"] = 1e168, ["Sxqqg"] = 1e171, ["Spqqg"] = 1e174, ["Ocqqg"] = 1e177, ["Noqqg"] = 1e180, ["Sg"] = 1e183, ["Usg"] = 1e186, ["Dsg"] = 1e189, ["Tsg"] = 1e192, ["Qasg"] = 1e195, ["Qisg"] = 1e198, ["Sxsg"] = 1e201, ["Spsg"] = 1e204, ["Ocsg"] = 1e207, ["Nosg"] = 1e210, ["Og"] = 1e213, ["Uog"] = 1e216, ["Dog"] = 1e219, ["Tog"] = 1e222, ["Qaog"] = 1e225, ["Qiog"] = 1e228, ["Sxog"] = 1e231, ["Spog"] = 1e234, ["Ocog"] = 1e237, ["Noog"] = 1e240, ["Ng"] = 1e243, ["Ung"] = 1e246, ["Dng"] = 1e249, ["Tng"] = 1e252, ["Qang"] = 1e255, ["Qing"] = 1e258, ["Sxng"] = 1e261, ["Spng"] = 1e264, ["Ocng"] = 1e267, ["Nong"] = 1e270, ["Ce"] = 1e273, ["Uce"] = 1e276
        }

        local NumberParser = {
            Parse = function(val)
                if type(val) == "number" then
                    return (val ~= val or val == (1/0) or val == (-1/0)) and 0 or (val > 1e276 and 1e276 or val)
                end
                if type(val) ~= "string" or val == "" then return 0 end
                local clean = val:gsub(",", ""):gsub("%s+", "")
                if clean == "" then return 0 end
                local num = tonumber(clean)
                if num then return (num ~= num or num == (1/0) or num == (-1/0)) and 0 or (num > 1e276 and 1e276 or num) end
                
                -- Suffix parsing
                for suffix, mult in pairs(SuffixMultipliers) do
                    local pattern = "^([%d%.]+)%s*" .. suffix:gsub("([%^%$%(%)%%%.%[%]%*%+%-%?])", "%%%1") .. "$"
                    local match = clean:match(pattern)
                    if match then
                        local n = tonumber(match)
                        if n then
                            local res = n * mult
                            return (res ~= res or res == (1/0) or res == (-1/0)) and 1e276 or (res > 1e276 and 1e276 or res)
                        end
                    end
                end
                
                local fallback = clean:match("^([%d%.]+)")
                local fn = fallback and tonumber(fallback)
                return fn or 0
            end,
            Format = function(num, decimals)
                local dec = decimals or 1
                if not num or num ~= num then return "0" end
                if num == (1/0) or num > 1e276 then return "MAX" end
                if num == (-1/0) then return "-MAX" end
                if num < 1000 then
                    if num % 1 == 0 then return tostring(math.floor(num)) end
                    return string.format("%." .. dec .. "f", num):gsub("%.?0+$", "")
                end
                local exp = math.floor(math.log10(math.abs(num)) / 3)
                if exp > #Suffixes then return "MAX" end
                local val = num / (10 ^ (exp * 3))
                local formatted = string.format("%." .. dec .. "f", val):gsub("%.?0+$", "")
                return formatted .. Suffixes[exp]
            end
        }

        -- [ GAME CONFIGURATIONS ]
        local TrialConfig = {
            Name = "Time Trial Easy",
            TotalRooms = 50,
            InitialEnemyHealth = NumberParser.Parse("140B"),
            InitialEnemyHealthDisplay = "140B",
            EnemyWorldLoop = {
                { WorldId = 1, Uncommon = "Tobi", Rare = "Kisame", Epic = "Pain", Legendary = "Madara", Mythical = "Kaguya" },
                { WorldId = 2, Uncommon = "Burter", Rare = "Ginyu", Epic = "Recoome", Legendary = "Cell", Mythical = "Boo" },
                { WorldId = 3, Uncommon = "Enel", Rare = "Kizaru", Epic = "Aokiji", Legendary = "Akainu", Mythical = "Kaido" },
                { WorldId = 4, Uncommon = "FemaleTitan", Rare = "Zeke", Epic = "AttackTitan", Legendary = "DreadHammer", Mythical = "Colossal" },
            }
        }

        local RaidConfig = {
            Name = "Ninja Raid",
            WorldId = 1,
            TotalWaves = 100,
            Cost = { ItemId = "DoujutsuToken", Amount = 1 },
            Enemies = {
                Madara = { Health = NumberParser.Parse("5M") },
                Kaguya = { Health = NumberParser.Parse("50M") }
            }
        }

        local ProgressionConfig = {
            World2 = { Name = "Ki Rank", MaxLevel = 35, SuccessChance = 25, CostId = "KiToken", CostAmount = 10, Stat = "Power Boost (10%/lvl)" },
            World3 = { Name = "Fruit Rank", MaxLevel = 35, SuccessChance = 25, CostId = "FruitToken", CostAmount = 10, Stat = "Damage Boost (10%/lvl)" }
        }

        local GachaConfig = {
            World1 = {
                Name = "DOUJUTSU", CostId = "DoujutsuToken", CostAmount = 10,
                Items = {
                    { Name = "Sharingan", Rarity = "Common", Mult = 1.25, Chance = 44.44 },
                    { Name = "Byakugan", Rarity = "Uncommon", Mult = 1.5, Chance = 28.5 },
                    { Name = "Ketsuryugan", Rarity = "Rare", Mult = 2.0, Chance = 17.5 },
                    { Name = "Jogan", Rarity = "Epic", Mult = 2.5, Chance = 8.5 },
                    { Name = "Tenseigan", Rarity = "Legendary", Mult = 3.5, Chance = 1.0 },
                    { Name = "Rinnegan", Rarity = "Mythical", Mult = 5.0, Chance = 0.05 },
                    { Name = "RinneSharingan", Rarity = "Secret", Mult = 10.0, Chance = 0.004 },
                    { Name = "Kokugan", Rarity = "Divine", Mult = 15.0, Chance = 0.0004 },
                }
            },
            World2 = {
                Name = "RACES", CostId = "RaceToken", CostAmount = 10,
                Items = {
                    { Name = "Human", Rarity = "Common", Mult = 1.25, Chance = 44.44 },
                    { Name = "Namekian", Rarity = "Uncommon", Mult = 1.5, Chance = 28.5 },
                    { Name = "Saiyan", Rarity = "Rare", Mult = 2.0, Chance = 17.5 },
                    { Name = "Androide", Rarity = "Epic", Mult = 2.5, Chance = 8.5 },
                    { Name = "Majin", Rarity = "Legendary", Mult = 3.5, Chance = 1.0 },
                    { Name = "Kaioshin", Rarity = "Mythical", Mult = 5.0, Chance = 0.05 },
                    { Name = "GOD", Rarity = "Secret", Mult = 10.0, Chance = 0.004 },
                    { Name = "Angel", Rarity = "Divine", Mult = 15.0, Chance = 0.0004 },
                }
            },
            World3 = {
                Name = "HAKIS", CostId = "HakiToken", CostAmount = 10,
                Items = {
                    { Name = "Sanje", Rarity = "Common", Mult = 1.25, Chance = 44.44 },
                    { Name = "Zorro", Rarity = "Uncommon", Mult = 1.5, Chance = 28.5 },
                    { Name = "Mehowk", Rarity = "Rare", Mult = 2.0, Chance = 17.5 },
                    { Name = "Royleigh", Rarity = "Epic", Mult = 2.5, Chance = 8.5 },
                    { Name = "Luffe", Rarity = "Legendary", Mult = 3.5, Chance = 1.0 },
                    { Name = "Beard White", Rarity = "Mythical", Mult = 5.0, Chance = 0.05 },
                    { Name = "Gol De Rogar", Rarity = "Secret", Mult = 10.0, Chance = 0.004 },
                    { Name = "Shunks", Rarity = "Divine", Mult = 15.0, Chance = 0.0004 },
                }
            },
            World4 = {
                Name = "FAMILY", CostId = "FamilyToken", CostAmount = 10,
                Items = {
                    { Name = "Wagenor", Rarity = "Common", Mult = 1.25, Chance = 44.44 },
                    { Name = "Sprenger", Rarity = "Uncommon", Mult = 1.5, Chance = 28.5 },
                    { Name = "Leonart", Rarity = "Rare", Mult = 2.0, Chance = 17.5 },
                    { Name = "Zohe", Rarity = "Epic", Mult = 2.5, Chance = 8.5 },
                    { Name = "Broun", Rarity = "Legendary", Mult = 3.5, Chance = 1.0 },
                    { Name = "Rezz", Rarity = "Mythical", Mult = 5.0, Chance = 0.05 },
                    { Name = "Yeagor", Rarity = "Secret", Mult = 10.0, Chance = 0.004 },
                    { Name = "Ackermon", Rarity = "Divine", Mult = 15.0, Chance = 0.0004 },
                }
            }
        }

        getgenv().NebuState_AnimeAstral = {
            Nebublox_Running = true,
            Farm = false,
            PriorityTargetName = "None",
            SecondaryTargetNames = {"All"},
            ScanRange = 300,
            
            -- Automation
            AutoClaimDaily = false,
            AutoClaimTime = false,
            AutoClaimAchievements = false,
            SelectedStat = "None",
            AutoJoinEasyTrial = false,
            AutoJoinNinjaRaid = false,
            AutoJoinTitanDefense = false,
            RaidLeaveWave = 0,
            DefenseLeaveWave = 0,
            TrialLeaveRoom = 0,

            -- Gacha & Systems
            AutoLobbyRangeUpgrade = false,
            AutoLobbySwordRoll = false,
            
            AutoW1Egg = false,
            AutoW1Gacha = false,
            
            AutoW2Egg = false,
            AutoW2Gacha = false,
            AutoW2Progression = false,
            
            AutoW3Egg = false,
            AutoW3Gacha = false,
            AutoW3Progression = false,
            
            AutoW4Egg = false,
            AutoW4Gacha = false,
            AutoW4Titans = false,

            Toggles = {},
            Initialized = false
        }
        
        local state = getgenv().NebuState_AnimeAstral
        
        -- [ NEBUBLOX LIBRARY LOADER ]
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
                local paths = {"NebubloxUI.lua", "scripts/NebubloxUI.lua", "DarkMatterV1-main/scripts/NebubloxUI.lua", "NebubloxUI-main/NebubloxUI.lua", "./NebubloxUI.lua"}
                local rawCode = nil
                for _, p in ipairs(paths) do
                    rawCode = GetLocal(p)
                    if rawCode then break end
                end
                if not rawCode then
                    local s, res = pcall(game.HttpGet, game, "https://script.google.com/macros/s/AKfycbzioe0bab-e9y3kHHHlB3PLD1CPI_pE16m4dKivriqfSshLwbZyZ1FbUj_UtQrpjVzr-g/exec?file=scripts/NebubloxUI.lua")
                    if s and res and (res:find("NEBUBLOX UI") or res:find("SUPERNOVA")) then
                        rawCode = res
                    else
                        local s2, res2 = pcall(game.HttpGet, game, "https://raw.githubusercontent.com/Nebublox/DarkMatterV1/main/scripts/NebubloxUI.lua")
                        if s2 and res2 and (res2:find("NEBUBLOX UI") or res2:find("SUPERNOVA")) then rawCode = res2 end
                    end
                end
                if rawCode then
                    local fn = loadstring(rawCode, "NebubloxUI")
                    if fn then
                        local ok, result = pcall(fn)
                        if ok and type(result) == "table" then getgenv().Nebublox = result; return result end
                    end
                end
                return nil
            end)()
        end

        if not Nebublox then warn("[Critical] Nebublox UI library failed to load.") return end

        local Window = Nebublox:CreateWindow({
            Title = "<b><font color='#00E6FF'>ANIME</font> <font color='#FFAA00'>ASTRAL</font></b>",
            Subtitle = "<b><font color='#00E6FF'>ANIME</font> <font color='#FFAA00'>ASTRAL</font></b>",
            Size = UDim2.new(0, 530, 0, 320),
            KeySystem = false,
            Profile = true,
            ConfigFolder = "AnimeAstral",
            CyberBackground = true,
            TitleGradient = {Color3.fromRGB(0, 230, 255), Color3.fromRGB(255, 170, 0)}
        }, state)
        
        Window:AddConsole()
        Window:AddStandardHome()

        -- [ UTILS & BRIDGE ]
        local function FireBridge(name, ...)
            pcall(function()
                local Library = require(ReplicatedStorage.SimpleWorld.Library)
                local bridge = Library.getBridge(name)
                if bridge then
                    bridge:Fire(...)
                end
            end)
        end

        -- [ DIRECT REMOTE ACTIONS ]
        local function FireRangeUpgrade(world)
            pcall(function() FireBridge("RangeUpgrade", world or "World0") end)
            -- Fallback
            local evt = ReplicatedStorage:FindFirstChild("BridgeNet2") and ReplicatedStorage.BridgeNet2:FindFirstChild("dataRemoteEvent")
            if evt then evt:FireServer({world or "World0", "\028"}) end
        end

        local function FireSwordRoll(world)
            pcall(function() FireBridge("SwordRoll", world or "World0") end)
            -- Fallback
            local evt = ReplicatedStorage:FindFirstChild("BridgeNet2") and ReplicatedStorage.BridgeNet2:FindFirstChild("dataRemoteEvent")
            if evt then evt:FireServer({world or "World0", "\015"}) end
        end

        local function FireStarHatch(world)
            pcall(function() FireBridge("StarHatch", world) end)
            -- Fallback
            local evt = ReplicatedStorage:FindFirstChild("BridgeNet2") and ReplicatedStorage.BridgeNet2:FindFirstChild("dataRemoteEvent")
            if evt then evt:FireServer({world, "\148"}) end
        end

        local function FireGacha(world)
            pcall(function() FireBridge("GachaRoll", world, true, false) end)
            -- Fallback
            local evt = ReplicatedStorage:FindFirstChild("BridgeNet2") and ReplicatedStorage.BridgeNet2:FindFirstChild("dataRemoteEvent")
            if evt then
                evt:FireServer({
                    { __BridgeTuplePayload__ = true, Payload = table.pack("Gacha", world, true, false) },
                    "\155", world, "8"
                })
            end
        end

        local function FireCreateRaid(world)
            FireBridge("RaidJoin", "Create", world)
        end

        local lastFired = {}
        local function FireThrottle(name, interval, func)
            local now = os.clock()
            if not lastFired[name] or (now - lastFired[name]) >= interval then
                lastFired[name] = now
                pcall(func)
            end
        end

        -- [ COMPACT LAYOUT HELPERS ]
        local lastToggleState = {}
        local function AddWorldToggle(column, config, activeColor)
            local originalCallback = config.Callback
            config.Color = activeColor
            lastToggleState[config.Name] = config.Default or false
            
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
                lastToggleState[config.Name] = v
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
                    pcall(function()
                        toggleObj.Frame.BackgroundColor3 = targetBG
                        toggleObj.Frame.BackgroundTransparency = targetTrans
                    end)
                    pcall(function()
                        local icon = toggleObj.Frame:FindFirstChild("Icon") or toggleObj.Frame:FindFirstChild("IconEmoji")
                        if icon then
                            icon.Position = UDim2.new(0.5, 0, 0.5, 0)
                            icon.AnchorPoint = Vector2.new(0.5, 0.5)
                        end
                    end)
                end
            end)
            return toggleObj
        end

        local function AddCompactRow(section, numCols)
            local cols = section:AddRow({Columns = numCols})
            task.spawn(function()
                task.wait(0.05)
                pcall(function()
                    local rowFrame = cols[1] and cols[1].Frame and cols[1].Frame.Parent
                    if not rowFrame then return end
                    local btnSize = 60
                    local gap = 10
                    local totalW = numCols * btnSize + (numCols - 1) * gap
                    rowFrame.Size = UDim2.new(0, totalW, 0, 0)
                    rowFrame.Position = UDim2.new(0.5, -totalW / 2, 0, 0)
                    rowFrame.AutomaticSize = Enum.AutomaticSize.Y
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

        local function FireChangeWorld(index)
            FireBridgeDirect({ index, "\021" })
        end

         local function Teleport(targetUIPath, worldIndex, fallbackName)
             pcall(function()
                 if typeof(worldIndex) == "number" then
                     FireChangeWorld(worldIndex)
                 else
                     FireBridge("RequestChangeWorld", fallbackName)
                 end
             end)
         end

        local CombatTab = Window:CreateTab({Name = "Combat", Icon = "rbxassetid://137397942282915"})
        local WorldsTab = Window:CreateTab({Name = "Worlds & Gacha", Icon = "rbxassetid://129061505028644"})
        local StatsTab = Window:CreateTab({Name = "Stats & Misc", Icon = "rbxassetid://91343385790283"})

        -- [ COMBAT TAB ]
        local FarmSec = CombatTab:AddSection({Name = "<b><font color='#FFFFFF' size='24'>Master Farm</font></b>"})
        FarmSec:AddToggle({Name = "Autofarm", Default = state.Farm, Callback = function(v) state.Farm = v end})
        
        local scannerRow = FarmSec:AddRow({Columns = 2})
        state.PriorityDropdown = scannerRow[1]:AddDropdown({Name = "🎯 Priority", Options = {"None"}, Callback = function(v) state.PriorityTargetName = v end})
        scannerRow[2]:AddButton({Name = "🔍 Scan Mobs", Callback = function()
            -- We'll link this to the scan function below
        end})
        state.SecondaryDropdown = FarmSec:AddDropdown({Name = "🛡️ Secondary", Options = {"All"}, Multi = true, Callback = function(v) state.SecondaryTargetNames = v end})
        FarmSec:AddSlider({Name = "Scan Radius", Min = 0, Max = 300, Default = state.ScanRange, Callback = function(v) state.ScanRange = v end})

        local ModeSec = CombatTab:AddSection({Name = "<b>Auto Gamemodes</b>"})
        local trialRow = ModeSec:AddRow({Columns = 2})
        trialRow[1]:AddToggle({Name = "Auto Join Easy Trial", Icon = "rbxassetid://137177523956654", Default = state.AutoJoinEasyTrial, Callback = function(v) state.AutoJoinEasyTrial = v end})
        trialRow[2]:AddInput({Placeholder = "Leave Room #", Default = tostring(state.TrialLeaveRoom or 0), Callback = function(v) state.TrialLeaveRoom = tonumber(v) or 0 end})
        
        local raidRow = ModeSec:AddRow({Columns = 2})
        raidRow[1]:AddToggle({Name = "Auto Join Ninja Raid", Icon = "rbxassetid://120721480088551", Default = state.AutoJoinNinjaRaid, Callback = function(v) state.AutoJoinNinjaRaid = v end})
        raidRow[2]:AddInput({Placeholder = "Leave Wave #", Default = tostring(state.RaidLeaveWave or 0), Callback = function(v) state.RaidLeaveWave = tonumber(v) or 0 end})

        local defenseRow = ModeSec:AddRow({Columns = 2})
        defenseRow[1]:AddToggle({Name = "Auto Join Defense", Icon = "rbxassetid://99704559462121", Default = state.AutoJoinTitanDefense, Callback = function(v) state.AutoJoinTitanDefense = v end})
        defenseRow[2]:AddInput({Placeholder = "Leave Wave #", Default = tostring(state.DefenseLeaveWave or 0), Callback = function(v) state.DefenseLeaveWave = tonumber(v) or 0 end})

        -- [ WORLDS TAB ]
        local InfoSec = WorldsTab:AddSection({Name = "<b>Information</b>"})
        InfoSec:AddParagraph({
            Title = "⚠️ Note on Remote Features",
            Content = "You must own the Remote Egg/Gacha Gamepasses to open them from anywhere on the map. If you do not own them, you must stand next to the machines for these toggles to work."
        })

        -- Lobby
        WorldsTab:AddBanner({
            Title = "LOBBY ARENA", 
            Image = "rbxassetid://120721480088551", 
            Color = Color3.fromRGB(0, 230, 255),
            Callback = function() Teleport(player.PlayerGui.Windows.Teleport.Main.Worlds.World0.Teleport, 0, "World0") end
        })
        local LobbyRow = AddCompactRow(WorldsTab, 2)
        state.Toggles.LobbyRange = AddWorldToggle(LobbyRow[1], {Name = "RangeUpgrade", Icon = "rbxassetid://104207244074961", Scale = 1.2, Default = state.AutoLobbyRangeUpgrade, Callback = function(v) state.AutoLobbyRangeUpgrade = v end}, Color3.fromRGB(0, 230, 255))
        state.Toggles.LobbySword = AddWorldToggle(LobbyRow[2], {Name = "SwordRoll", Icon = "rbxassetid://106822073961175", Scale = 1.2, Default = state.AutoLobbySwordRoll, Callback = function(v) state.AutoLobbySwordRoll = v end}, Color3.fromRGB(0, 230, 255))

        -- World 1: Ninja Village
        WorldsTab:AddBanner({
            Title = "NINJA VILLAGE", 
            Image = "rbxassetid://128198870943435", 
            Color = Color3.fromRGB(255, 100, 100),
            Callback = function() Teleport(player.PlayerGui.Windows.Teleport.Main.Worlds.World1.Teleport, 1, "World1") end
        })
        local W1Row = AddCompactRow(WorldsTab, 2)
        state.Toggles.W1Egg = AddWorldToggle(W1Row[1], {Name = "W1 Egg", Icon = "rbxassetid://119485607895116", Scale = 1.2, Default = state.AutoW1Egg, Callback = function(v) state.AutoW1Egg = v end}, Color3.fromRGB(255, 100, 100))
        state.Toggles.W1Gacha = AddWorldToggle(W1Row[2], {Name = "W1 Gacha", Icon = "rbxassetid://108317182286959", Scale = 1.2, Default = state.AutoW1Gacha, Callback = function(v) state.AutoW1Gacha = v end}, Color3.fromRGB(255, 100, 100))

        -- World 2: Namek City
        WorldsTab:AddBanner({
            Title = "NAMEK CITY", 
            Image = "rbxassetid://115267423788695", 
            Color = Color3.fromRGB(100, 255, 100),
            Callback = function() Teleport(player.PlayerGui.Windows.Teleport.Main.Worlds.World2.Teleport, 2, "World2") end
        })
        local W2Row = AddCompactRow(WorldsTab, 3)
        state.Toggles.W2Egg = AddWorldToggle(W2Row[1], {Name = "W2 Egg", Icon = "rbxassetid://119485607895116", Scale = 1.2, Default = state.AutoW2Egg, Callback = function(v) state.AutoW2Egg = v end}, Color3.fromRGB(100, 255, 100))
        state.Toggles.W2Gacha = AddWorldToggle(W2Row[2], {Name = "W2 Gacha", Icon = "rbxassetid://126398488981974", Scale = 1.2, Default = state.AutoW2Gacha, Callback = function(v) state.AutoW2Gacha = v end}, Color3.fromRGB(100, 255, 100))
        state.Toggles.W2Progression = AddWorldToggle(W2Row[3], {Name = "W2 Progression", Icon = "rbxassetid://129126410667323", Scale = 1.2, Default = state.AutoW2Progression, Callback = function(v) state.AutoW2Progression = v end}, Color3.fromRGB(100, 255, 100))

        -- World 3: Wano Island
        WorldsTab:AddBanner({
            Title = "WANO ISLAND", 
            Image = "rbxassetid://84198722942419", 
            Color = Color3.fromRGB(255, 100, 255),
            Callback = function() Teleport(player.PlayerGui.Windows.Teleport.Main.Worlds.World3.Teleport, 3, "World3") end
        })
        local W3Row = AddCompactRow(WorldsTab, 3)
        state.Toggles.W3Egg = AddWorldToggle(W3Row[1], {Name = "W3 Egg", Icon = "rbxassetid://119485607895116", Scale = 1.2, Default = state.AutoW3Egg, Callback = function(v) state.AutoW3Egg = v end}, Color3.fromRGB(255, 100, 255))
        state.Toggles.W3Gacha = AddWorldToggle(W3Row[2], {Name = "W3 Gacha", Icon = "rbxassetid://86565949329723", Scale = 1.2, Default = state.AutoW3Gacha, Callback = function(v) state.AutoW3Gacha = v end}, Color3.fromRGB(255, 100, 255))
        state.Toggles.W3Progression = AddWorldToggle(W3Row[3], {Name = "W3 Progression", Icon = "rbxassetid://93136272259323", Scale = 1.2, Default = state.AutoW3Progression, Callback = function(v) state.AutoW3Progression = v end}, Color3.fromRGB(255, 100, 255))

        -- World 4: Titan Wall
        WorldsTab:AddBanner({
            Title = "TITAN WALL", 
            Image = "rbxassetid://93230737506569", 
            Color = Color3.fromRGB(255, 165, 0),
            Callback = function() Teleport(player.PlayerGui.Windows.Teleport.Main.Worlds.World4.Teleport, 4, "World4") end
        })
        local W4Row = AddCompactRow(WorldsTab, 3)
        state.Toggles.W4Egg = AddWorldToggle(W4Row[1], {Name = "W4 Egg", Icon = "rbxassetid://119485607895116", Scale = 1.2, Default = state.AutoW4Egg, Callback = function(v) state.AutoW4Egg = v end}, Color3.fromRGB(255, 165, 0))
        state.Toggles.W4Gacha = AddWorldToggle(W4Row[2], {Name = "W4 Gacha", Icon = "rbxassetid://89457548986175", Scale = 1.2, Default = state.AutoW4Gacha, Callback = function(v) state.AutoW4Gacha = v end}, Color3.fromRGB(255, 165, 0))
        state.Toggles.W4Titans = AddWorldToggle(W4Row[3], {Name = "W4 Titans", Icon = "rbxassetid://138949491596268", Scale = 1.2, Default = state.AutoW4Titans, Callback = function(v) state.AutoW4Titans = v end}, Color3.fromRGB(255, 165, 0))

        -- [ STATS & MISC TAB ]
        StatsTab:AddSection({Name = "<b>Coming Soon</b>"})
        StatsTab:AddParagraph({Title = "", Content = "Features have been removed or migrated as per the latest game update."})


        -- [ ZONE LOGIC & CACHE ]
        local CurrentZone = nil
        local TargetCache = {}
        local currentTargetInstance = nil
        local currentTargetTime = 0
        local targetHistory = {} -- Maps target instance to timestamp of when it was un-targeted

        local function IsIgnoredModel(e)
            if not e then return true end
            if e:FindFirstAncestor("Auras") or e:FindFirstAncestor("Map") then
                return true
            end
            local nameLower = e.Name:lower()
            if nameLower:find("shiny") or nameLower:find("dummy") or nameLower == "sasuke shiny" then
                return true
            end
            return false
        end

        local function GetCurrentZone()
            local char = player.Character
            local root = char and char:FindFirstChild("HumanoidRootPart")
            if not root then return nil end

            -- Time Trials
            if Workspace:FindFirstChild("TimeTrialArenas") and Workspace.TimeTrialArenas:FindFirstChild("Easy") then
                local easy = Workspace.TimeTrialArenas.Easy
                if easy:FindFirstChild("Enemies") and #easy.Enemies:GetChildren() > 0 then
                    return easy
                end
            end

            -- Raid Arenas
            if Workspace:FindFirstChild("RaidArenas") then
                for _, raidWorld in ipairs(Workspace.RaidArenas:GetChildren()) do
                    local spawnPart = raidWorld:FindFirstChild("Spawn") or raidWorld:FindFirstChild("SpawnLocation")
                    if not spawnPart then
                        for _, p in ipairs(raidWorld:GetDescendants()) do
                            if p:IsA("BasePart") then
                                spawnPart = p
                                break
                            end
                        end
                    end
                    if spawnPart then
                        local d = (root.Position - spawnPart.Position).Magnitude
                        if d < 1500 then
                            return raidWorld
                        end
                    end
                end
            end

            -- Defense Arenas
            local defenseFolder = Workspace:FindFirstChild("DefenseArenas") or Workspace:FindFirstChild("TitanDefenseArenas")
            if defenseFolder then
                for _, defWorld in ipairs(defenseFolder:GetChildren()) do
                    local spawnPart = defWorld:FindFirstChild("Spawn") or defWorld:FindFirstChild("SpawnLocation")
                    if not spawnPart then
                        for _, p in ipairs(defWorld:GetDescendants()) do
                            if p:IsA("BasePart") then
                                spawnPart = p
                                break
                            end
                        end
                    end
                    if spawnPart then
                        local d = (root.Position - spawnPart.Position).Magnitude
                        if d < 1500 then
                            return defWorld
                        end
                    end
                end
            end
            
            -- Normal Worlds
            if Workspace:FindFirstChild("Worlds") then
                local closestWorld = nil
                local minDist = math.huge
                for _, world in ipairs(Workspace.Worlds:GetChildren()) do
                    local spawnPart = world:FindFirstChild("Spawn") or world:FindFirstChild("SpawnLocation")
                    if not (spawnPart and spawnPart:IsA("BasePart")) then
                        -- Fallback to find any BasePart in descendants
                        for _, p in ipairs(world:GetDescendants()) do
                            if p:IsA("BasePart") then
                                spawnPart = p
                                break
                            end
                        end
                    end
                    
                    if spawnPart and spawnPart:IsA("BasePart") then
                        local d = (root.Position - spawnPart.Position).Magnitude
                        if d < minDist then
                            minDist = d
                            closestWorld = world
                        end
                    end
                end
                
                if closestWorld and minDist < 2000 then
                    return closestWorld
                end
            end

            return Workspace
        end

        local function UpdateScanner()
            local zone = GetCurrentZone()
            if zone ~= CurrentZone then
                CurrentZone = zone
                TargetCache = {} -- Clear cache on zone switch
                targetHistory = {} -- Clear targeting history on zone switch
                currentTargetInstance = nil -- Reset current target on zone switch
                currentTargetTime = 0
            end
            
            local enemiesFolder = (zone and zone:FindFirstChild("Enemies")) or zone
            if not enemiesFolder then return end
            
            local seen = {}
            local priList = {"None"}
            local secList = {"All"}
            
            for _, e in ipairs(enemiesFolder:GetChildren()) do
                if not IsIgnoredModel(e) then
                    local hum = e:FindFirstChildOfClass("Humanoid")
                    local eRoot = e:FindFirstChild("HumanoidRootPart")
                    if hum and eRoot then
                        local clean = e.Name:gsub("%s*%(.-%)%s*", ""):gsub("%d+$", ""):gsub("%s+$", "")
                        if clean ~= "" and not seen[clean] then
                            seen[clean] = true
                            table.insert(priList, clean)
                            table.insert(secList, clean)
                        end
                    end
                end
            end
            
            table.sort(priList)
            table.sort(secList)
            if state.PriorityDropdown then state.PriorityDropdown:Refresh(priList) end
            if state.SecondaryDropdown then state.SecondaryDropdown:Refresh(secList) end
        end

        -- Call UpdateScanner when search button is clicked
        scannerRow[2].Callback = function() UpdateScanner() end

        task.spawn(function()
            while task.wait(3) do
                if not state.Nebublox_Running then break end
                pcall(UpdateScanner)
            end
        end)

        -- [ MOVEMENT SENSOR (NO CLICK, JUST TELEPORT) ]

        local function GetTarget()
            local char = player.Character
            local root = char and char:FindFirstChild("HumanoidRootPart")
            if not root then return nil end

            local now = os.clock()

            -- Clean history of old entries
            for inst, t in pairs(targetHistory) do
                if now - t > 10 then
                    targetHistory[inst] = nil
                end
            end

            local function IsEnemyValid(e)
                if IsIgnoredModel(e) then return false end
                
                local eRoot = e:FindFirstChild("HumanoidRootPart") or e:FindFirstChild("Hitbox")
                if not eRoot then return false end
                if eRoot.Position.Y < -500 then return false end

                local hum = e:FindFirstChildOfClass("Humanoid")
                if hum and hum.Health <= 0 then return false end

                local customHealth = e:FindFirstChild("Health")
                if customHealth and (customHealth:IsA("NumberValue") or customHealth:IsA("IntValue")) then
                    if customHealth.Value <= 0 then return false end
                end

                local fill = e:FindFirstChild("Bar", true) or e:FindFirstChild("BarFill", true)
                if fill and fill:IsA("GuiObject") then
                    if fill.Size.X.Scale <= 0 and fill.Size.X.Offset <= 0 then return false end
                end

                if Players:GetPlayerFromCharacter(e) then return false end

                return true
            end

            -- 1. Stick to current target if it is valid and we haven't spent 1 second on it yet
            if currentTargetInstance and IsEnemyValid(currentTargetInstance) then
                if now - currentTargetTime < 1 then
                    return currentTargetInstance
                end
            end

            local targets = {}
            local function ScanContainer(container, list)
                if container:IsA("Folder") or container:IsA("Model") then
                    for _, e in ipairs(container:GetChildren()) do
                        if e:IsA("Model") and IsEnemyValid(e) then
                            table.insert(list, e)
                        elseif e:IsA("Folder") and e.Name ~= "Terrain" then
                            ScanContainer(e, list)
                        end
                    end
                end
            end

            local physicalZone = GetCurrentZone()
            local pZoneName = physicalZone and physicalZone.Name:lower() or ""
            local isPhysicallyInGamemode = pZoneName:find("raid") or pZoneName:find("defense") or pZoneName:find("easy") or pZoneName:find("arena") or pZoneName:find("trial")

            -- Pause Farm in Lobby if Auto-Joining
            if pZoneName == "world0" and (state.AutoJoinEasyTrial or state.AutoJoinNinjaRaid or state.AutoJoinTitanDefense) then
                return nil
            end

            if InGamemode or isPhysicallyInGamemode then
                if physicalZone then
                    ScanContainer(physicalZone, targets)
                end
                -- We DO NOT fallback to scanning all other arenas here.
                -- This prevents the bot from teleporting into someone else's arena when ours is empty.
            else
                if physicalZone then
                    ScanContainer(physicalZone, targets)
                end
                
                if #targets == 0 then
                    if Workspace:FindFirstChild("Worlds") then
                        for _, world in ipairs(Workspace.Worlds:GetChildren()) do
                            local enemiesFolder = world:FindFirstChild("Enemies")
                            if enemiesFolder then
                                ScanContainer(enemiesFolder, targets)
                            end
                        end
                    else
                        ScanContainer(Workspace, targets)
                    end
                end
            end

            if #targets == 0 then
                currentTargetInstance = nil
                return nil
            end

            local currentMaxRange = (InGamemode or isPhysicallyInGamemode) and 300 or (state.ScanRange or 300)

            -- Score function: distance + penalty if recently visited or stayed on too long
            local function GetTargetScore(e)
                local eRoot = e:FindFirstChild("HumanoidRootPart") or e:FindFirstChild("Hitbox")
                if not eRoot then return math.huge end
                local dist = (root.Position - eRoot.Position).Magnitude
                
                if dist > currentMaxRange then return math.huge end
                
                -- Penalty if recently visited
                local lastVisited = targetHistory[e]
                if lastVisited and (now - lastVisited) < 6 then
                    return dist + 10000
                end
                
                -- Penalty if currently targeted and spent >= 1 second on it (to cycle target)
                if e == currentTargetInstance and (now - currentTargetTime) >= 1 then
                    return dist + 10000
                end
                
                return dist
            end

            -- Priority Target (Closest with score)
            if state.PriorityTargetName and state.PriorityTargetName ~= "None" then
                local bestPri = nil
                local bestScore = math.huge
                for _, e in ipairs(targets) do
                    local clean = e.Name:gsub("%s*%(.-%)%s*", ""):gsub("%d+$", ""):gsub("%s+$", "")
                    if (state.PriorityTargetName == "All" or clean == state.PriorityTargetName) then
                        local score = GetTargetScore(e)
                        if score < bestScore then
                            bestScore = score
                            bestPri = e
                        end
                    end
                end
                if bestPri then
                    if bestPri ~= currentTargetInstance then
                        if currentTargetInstance then
                            targetHistory[currentTargetInstance] = now
                        end
                        currentTargetInstance = bestPri
                        currentTargetTime = now
                    end
                    return bestPri
                end
            end

            -- Secondary Targets (Closest with score)
            local sList = state.SecondaryTargetNames
            if sList and #sList > 0 then
                local bestSec = nil
                local bestScore = math.huge
                for _, e in ipairs(targets) do
                    local clean = e.Name:gsub("%s*%(.-%)%s*", ""):gsub("%d+$", ""):gsub("%s+$", "")
                    for _, sName in ipairs(sList) do
                        if (sName == "All" or clean == sName) then
                            local score = GetTargetScore(e)
                            if score < bestScore then
                                bestScore = score
                                bestSec = e
                            end
                        end
                    end
                end
                if bestSec then
                    if bestSec ~= currentTargetInstance then
                        if currentTargetInstance then
                            targetHistory[currentTargetInstance] = now
                        end
                        currentTargetInstance = bestSec
                        currentTargetTime = now
                    end
                    return bestSec
                end
            end

            -- Fallback Closest (Closest with score)
            local bestClosest = nil
            local bestScore = math.huge
            for _, e in ipairs(targets) do
                local score = GetTargetScore(e)
                if score < bestScore then
                    bestScore = score
                    bestClosest = e
                end
            end

            if bestClosest then
                if bestClosest ~= currentTargetInstance then
                    if currentTargetInstance then
                        targetHistory[currentTargetInstance] = now
                    end
                    currentTargetInstance = bestClosest
                    currentTargetTime = now
                end
                return bestClosest
            end

            currentTargetInstance = nil
            return nil
        end

        local function TriggerUIAction()
            pcall(function()
                local pg = player:FindFirstChild("PlayerGui")
                if not pg then return end
                
                -- Attempt to find an active Auto Roll, Roll, or Hatch button in the windows
                for _, btn in ipairs(pg:GetDescendants()) do
                    if (btn:IsA("TextButton") or btn:IsA("ImageButton")) and btn.Visible then
                        local nameLower = btn.Name:lower()
                        local textLower = btn:IsA("TextButton") and btn.Text:lower() or ""
                        
                        local isRoll = nameLower:find("auto") or textLower:find("auto") or nameLower == "roll" or textLower == "roll"
                        local isHatch = nameLower:find("hatch") or textLower:find("hatch")
                        
                        if isRoll or isHatch then
                            -- Only click if it's inside a Gacha or Hatch UI
                            if btn:FindFirstAncestor("Gacha") or btn:FindFirstAncestor("Roll") or btn:FindFirstAncestor("Summon") or btn:FindFirstAncestor("Hatch") or btn:FindFirstAncestor("Star") then
                                local getevents = getconnections or get_signal_cons
                                if getevents then
                                    for _, conn in ipairs(getevents(btn.MouseButton1Click)) do
                                        conn:Fire()
                                    end
                                    for _, conn in ipairs(getevents(btn.Activated)) do
                                        conn:Fire()
                                    end
                                end
                            end
                        end
                    end
                end
            end)
        end

        state.GachaConnection = RunService.Heartbeat:Connect(function()
            if not state.Nebublox_Running then return end
            
            local char = player.Character
            local root = char and char:FindFirstChild("HumanoidRootPart")
            if not root then return end

            local W = Workspace:FindFirstChild("Worlds")
            if W then
                -- Try each active gacha toggle
                pcall(function()
                    if state.AutoW1Gacha then
                        FireThrottle("W1Gacha", 0.5, function()
                            FireGacha("World1")
                            TriggerUIAction()
                        end)
                    end
                    if state.AutoW2Gacha then
                        FireThrottle("W2Gacha", 0.5, function()
                            FireGacha("World2")
                            TriggerUIAction()
                        end)
                    end
                    if state.AutoW3Gacha then
                        FireThrottle("W3Gacha", 0.5, function()
                            SafeClickToggle(W.World3.Systems.System_Gacha)
                            TriggerUIAction()
                        end)
                    end
                    if state.AutoW4Gacha then
                        FireThrottle("W4Gacha", 0.5, function()
                            SafeClickToggle(W.World4.Systems.System_Gacha)
                            TriggerUIAction()
                        end)
                    end
                end)
            end
        end)

        state.MovementConnection = RunService.Heartbeat:Connect(function()
            if not state.Nebublox_Running or not state.Farm then return end
            local char = player.Character
            local root = char and char:FindFirstChild("HumanoidRootPart")
            if not root then return end

            local target = GetTarget()
            if target then
                local tRoot = target:FindFirstChild("HumanoidRootPart")
                if tRoot then
                    -- Noclip
                    for _, p in ipairs(char:GetDescendants()) do
                        if p:IsA("BasePart") and p.CanCollide then p.CanCollide = false end
                    end
                    -- Position player directly on target
                    root.AssemblyLinearVelocity = Vector3.zero
                    root.AssemblyAngularVelocity = Vector3.zero
                    
                    local tPos = tRoot.Position
                    root.CFrame = CFrame.new(tPos + Vector3.new(0, 0, 1.5), tPos)
                end
            else
                -- Restore collide
                for _, p in ipairs(char:GetDescendants()) do
                    if p:IsA("BasePart") and p.Name ~= "HumanoidRootPart" and not p:FindFirstAncestorOfClass("Accessory") then
                        p.CanCollide = true
                    end
                end
            end
        end)


        -- [ GACHA & SYSTEM LOOPS (THROTTLED FOR REMOTE GUARD) ]
        local function SafeClickToggle(path)
            if not path then return end
            local get_cons = getgenv().getconnections or getgenv().get_signal_cons
            if type(get_cons) == "function" then
                for _, c in ipairs(get_cons(path.MouseButton1Click) or {}) do pcall(function() c:Fire() end) end
                for _, c in ipairs(get_cons(path.Activated) or {}) do pcall(function() c:Fire() end) end
            end
        end

        task.spawn(function()
            while task.wait(0.1) do
                if not state.Nebublox_Running then break end
                pcall(function()
                    local W = player.PlayerGui.Windows.Teleport.Main.Worlds
                    if state.AutoLobbyRangeUpgrade then
                        FireThrottle("LobbyRange", 0.5, function()
                            FireRangeUpgrade("World0")
                        end)
                    end
                    if state.AutoLobbySwordRoll then
                        FireThrottle("LobbySword", 0.5, function()
                            FireSwordRoll("World0")
                        end)
                    end
                    
                    if state.AutoW1Egg then
                        FireThrottle("W1Egg", 0.5, function()
                            FireStarHatch("World1")
                            TriggerUIAction()
                        end)
                    end
                    
                    if state.AutoW2Egg then
                        FireThrottle("W2Egg", 0.5, function()
                            FireStarHatch("World2")
                            TriggerUIAction()
                        end)
                    end
                    
                    if state.AutoW2Progression then
                        FireThrottle("W2Progression", 0.5, function()
                            SafeClickToggle(W.World2.Systems.System_Progression)
                        end)
                    end
                    
                    if state.AutoW3Egg then
                        FireThrottle("W3Egg", 0.5, function()
                            FireStarHatch("World3")
                            TriggerUIAction()
                        end)
                    end
                    
                    if state.AutoW3Progression then
                        FireThrottle("W3Progression", 0.5, function()
                            SafeClickToggle(W.World3.Systems.System_Progression)
                        end)
                    end
                    
                    if state.AutoW4Egg then
                        FireThrottle("W4Egg", 0.5, function()
                            FireStarHatch("World4")
                            TriggerUIAction()
                        end)
                    end
                    
                    if state.AutoW4Titans then
                        FireThrottle("W4Titans", 0.5, function()
                            SafeClickToggle(W.World4.Systems.System_Titans)
                        end)
                    end
                end)
            end
        end)


        -- [ TRIAL, RAID, DEFENSE & AUTO-LEAVE ]
        local InGamemode = false
        task.spawn(function()
            local evt = ReplicatedStorage:FindFirstChild("BridgeNet2") and ReplicatedStorage.BridgeNet2:FindFirstChild("dataRemoteEvent")
            if evt then
                evt.OnClientEvent:Connect(function(data)
                    if type(data) ~= "table" then return end
                    for bridgeId, payloadList in pairs(data) do
                        if type(payloadList) == "table" then
                            for _, item in ipairs(payloadList) do
                                if type(item) == "table" and item.M and item.M[1] then
                                    local p = item.M[1]
                                    if p.Room ~= nil and p.TimeLeft ~= nil then
                                        InGamemode = true
                                        CurrentRoom = tonumber(p.Room) or 0
                                    end
                                end
                            end
                        end
                    end
                end)
            end
        end)

        local lastLeaveAttempt = 0
        task.spawn(function()
            while task.wait(3) do
                if not state.Nebublox_Running then break end
                pcall(function()
                    -- Check if in gamemode based on UI visibility
                    local pg = player.PlayerGui
                    local inDefense = pg:FindFirstChild("DefenseGui") and pg.DefenseGui.Enabled
                    local inRaid = pg:FindFirstChild("RaidGui") and pg.RaidGui.Enabled
                    local inTrial = pg:FindFirstChild("TrialGui") and pg.TrialGui.Enabled
                    
                    if inDefense or inRaid or inTrial then
                        InGamemode = true
                        local now = os.clock()
                        if now - lastLeaveAttempt > 5 then
                            if inTrial then
                                local shouldLeave = state.TrialLeaveRoom and state.TrialLeaveRoom > 0 and CurrentRoom >= state.TrialLeaveRoom
                                if shouldLeave then
                                    lastLeaveAttempt = now
                                    SafeClickToggle(pg.TrialGui.Main.Leave)
                                end
                            end
                            if inRaid then
                                local shouldLeave = state.RaidLeaveWave and state.RaidLeaveWave > 0 and CurrentRoom >= state.RaidLeaveWave
                                if shouldLeave then
                                    lastLeaveAttempt = now
                                    if pg.RaidGui.Main.Leave.Visible then SafeClickToggle(pg.RaidGui.Main.Leave) else FireBridge("RaidLeave") end
                                end
                            end
                            if inDefense then
                                local shouldLeave = state.DefenseLeaveWave and state.DefenseLeaveWave > 0 and CurrentRoom >= state.DefenseLeaveWave
                                if shouldLeave then
                                    lastLeaveAttempt = now
                                    if pg.DefenseGui.Main.Leave.Visible then SafeClickToggle(pg.DefenseGui.Main.Leave) else FireBridge("DefenseLeave") end
                                end
                            end
                        end
                    else
                        InGamemode = false
                        CurrentRoom = 0
                        
                        -- Auto Joins (only in lobby World0 to prevent load screen conflicts)
                        local zone = GetCurrentZone()
                        local zoneName = zone and zone.Name
                        if zoneName == "World0" then
                            if state.AutoJoinEasyTrial then
                                FireBridge("TimeTrialJoin", "Join", "Easy")
                            end
                            if state.AutoJoinNinjaRaid then 
                                FireBridge("RaidJoin", "Create", "World1") 
                            end
                            if state.AutoJoinTitanDefense then 
                                FireBridge("DefenseJoin", "Join", "Easy")
                            end
                        end
                    end
                end)
            end
        end)

        -- [ STATS & REWARDS UPGRADE LOOP ]
        task.spawn(function()
            while task.wait(1.5) do
                if not state.Nebublox_Running then break end
                pcall(function()
                    -- Stats Upgrade
                    if state.SelectedStat ~= "None" then
                        local btnPath = player.PlayerGui:FindFirstChild("Windows") and player.PlayerGui.Windows:FindFirstChild("LevelStats") and player.PlayerGui.Windows.LevelStats.Main.ScrollingFrame:FindFirstChild(state.SelectedStat)
                        if btnPath and btnPath:FindFirstChild("Upgrade") then
                            SafeClickToggle(btnPath.Upgrade)
                        else
                            FireBridge("SpendStatPoint", state.SelectedStat)
                        end
                    end

                    -- Rewards
                    if state.AutoClaimDaily then
                        local f = ReplicatedStorage:FindFirstChild("SimpleWorld") and ReplicatedStorage.SimpleWorld.Library.Network.Functions:FindFirstChild("ClaimAllDailyRewards")
                        if f then f:InvokeServer() end
                    end
                    if state.AutoClaimTime then
                        local f = ReplicatedStorage:FindFirstChild("SimpleWorld") and ReplicatedStorage.SimpleWorld.Library.Network.Functions:FindFirstChild("ClaimAllTimeRewards")
                        if f then f:InvokeServer() end
                    end
                    if state.AutoClaimAchievements then
                        pcall(function() FireBridge("ClaimAllAchievements") end)
                        pcall(function()
                            local claimBtn = player.PlayerGui.Windows.Achievements.Main.ClaimAll
                            if claimBtn and claimBtn.Visible then SafeClickToggle(claimBtn) end
                        end)
                        local network = ReplicatedStorage:FindFirstChild("SimpleWorld") and ReplicatedStorage.SimpleWorld.Library:FindFirstChild("Network")
                        if network then
                            local funcs = network:FindFirstChild("Functions")
                            if funcs then
                                for _, f in ipairs(funcs:GetChildren()) do
                                    if f:IsA("RemoteFunction") and f.Name:lower():find("achievement") then
                                        pcall(function() f:InvokeServer() end)
                                    end
                                end
                            end
                            local events = network:FindFirstChild("Events")
                            if events then
                                for _, e in ipairs(events:GetChildren()) do
                                    if e:IsA("RemoteEvent") and e.Name:lower():find("achievement") then
                                        pcall(function() e:FireServer() end)
                                    end
                                end
                            end
                        end
                    end
                end)
            end
        end)

        -- [ AUTO CLICK ATTACK LOOP ]
        -- Disabled per user request (autofarm now only teleports to mobs without click actions)

        Window:Notify({Title = "Anime Astral", Content = "Loaded Premium Automation Successfully.", Type = "success"})
    end)
    
    if not success then warn("[AnimeAstral Loader Error]: " .. tostring(err)) end
end

InitializeApp()
