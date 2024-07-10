const config = {
  "*.{mjs,js,jsx,ts,tsx}": ["biome format --write", "biome lint --apply"],
  "*.json": ["biome format --write"],
}

export default config
