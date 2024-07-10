const config = {
  "*.{mjs,js,jsx,ts,tsx}": ["biome check --write ."],
  "*.json": ["biome format --write ."],
}

export default config
