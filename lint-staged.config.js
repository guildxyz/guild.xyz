const config = {
  '*.{mjs,js,jsx,ts,tsx}': [
    'biome format --write',
    'biome lint --apply',
  ],
};

export default config;
