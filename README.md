# Usage
npm run createProj <Path_To_Addons_Folder> <Addon_Name> <Abbreviated_Name>

# Example
npm run createProj ../addons/ myAddon myA


## Addon Structure
```
myaddon
├── ma-autorun.lua
├── myaddon
│   ├──  client
│   │   └── cl_ma_init.lua
│   ├──  server
│   │   └── sv_ma_init.lua  
│   ├──  shared
│   │   └── sh_ma_init.lua
└──────────────────────────
```