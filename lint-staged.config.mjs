const config = {
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --write --no-errors-on-unmatched", // Format, sort imports, lint, and apply safe fixes
  ],
}

export default config
