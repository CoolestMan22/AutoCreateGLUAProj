let process = require('process')
let fs = require('fs')

let commandLineArgs = process.argv.slice(2)

if (commandLineArgs.length < 3) {
    console.log("Usage: node index.js <addons Directory> <fullName> <abbrevName>")
    return
};

let fullName = commandLineArgs[1].toLowerCase()
let abbrevName = commandLineArgs[2].toLowerCase()
let baseaddonsDir = commandLineArgs[0]

if (!baseaddonsDir.endsWith("addons")) {
    console.log("Error: The directory must be the addons directory")
    return
}

if (!fs.existsSync(baseaddonsDir)) {
    console.log("Error: The directory does not exist")
    return
}

let addonDir = `${baseaddonsDir}/${fullName}`
let addonLua = `${addonDir}/lua`
let addonAutorun = `${addonLua}/autorun`
let addonsAutoRun = `${addonAutorun}${abbrevName}-autorun.lua`

let addonDir2 = `${addonDir}/lua/${fullName}`
let addonClient = `${addonDir2}/client`
let addonServer = `${addonDir2}/server`
let addonShared = `${addonDir2}/shared`

let addonClientFile = `${addonClient}/cl_${abbrevName}_init.lua`
let addonServerFile = `${addonServer}/sv_${abbrevName}_init.lua`
let addonSharedFile = `${addonShared}/sh_${abbrevName}_init.lua`

let clientContent = `// Main Client File`
let serverContent = `// Main Server File`
let sharedContent = `// Main Shared File`


let autorunContent = `${fullName} = ${fullName} or {}

// Load File Function
function ${fullName}:LoadFile(path)
    local filename = path:GetFileFromFilename();
    filename = filename ~= "" and filename or path;
    local flagCL = filename:StartsWith(filename, "cl_");
    local flagSV = filename:StartsWith(filename, "sv_");
    local flagSH = filename:StartsWith(filename, "sh_");
    
    if (SERVER) then
        if (flagCL or flagSH) then
            AddCSLuaFile(filename);
        end
        
        if (flagSV or flagSH) then
            include(filename);
        end
    elseif (flagCL or flagSH) then
        include(filename);
    end
end

// Load Directory Function
function ${fullName}:LoadDirectory(directory)
    local files, folders = file.Find(directory .. "/*", "LUA");

    for _, folder in ipairs(folders) do
        self:LoadDirectory(directory .. "/" .. folder);
        print("Directory: " .. directory .. "/" .. folder)
    end
        
    for _, filee in ipairs(files) do
        self:LoadFile(directory .. "/" .. filee);
        print("File: " .. directory .. "/" .. filee)
    end 
end

${fullName}:LoadDirectory("${fullName}")
`

// Create the file in the addons directory
fs.mkdirSync(addonDir)
fs.mkdirSync(addonLua)
fs.mkdirSync(addonDir2)
fs.mkdirSync(addonClient)
fs.mkdirSync(addonServer)
fs.mkdirSync(addonShared)
fs.writeFileSync(addonsAutoRun, autorunContent)
fs.writeFileSync(addonClientFile, clientContent)
fs.writeFileSync(addonServerFile, serverContent)
fs.writeFileSync(addonSharedFile, sharedContent)

