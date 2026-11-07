# Guild.xyz

[![Code check](https://github.com/guildxyz/guild.xyz/actions/workflows/code-check.yml/badge.svg)](https://github.com/guildxyz/guild.xyz/actions/workflows/code-check.yml)

Guild.xyz is where a community decides who gets what. You set the rules once, and Guild checks every member's wallets and social accounts against them and keeps their access up to date: Discord roles, Telegram groups, points, gated pages and more.

- Token-gate a Discord server: [guide](https://guild.xyz/docs/guides/token-gate-discord)
- Token-gate a Telegram group: [guide](https://guild.xyz/docs/guides/token-gate-telegram)
- Points and leaderboards: [guide](https://guild.xyz/docs/guides/points-and-leaderboards)
- Quests and campaigns: [guide](https://guild.xyz/docs/guides/quests-and-campaigns)
- Manage a guild from an AI agent such as Claude, through the MCP server at `https://mcp.guild.xyz/mcp`: [docs](https://guild.xyz/docs/agents)

Discord and Telegram gating are on the Free plan. Token and NFT requirements work on 50 EVM mainnets.

- Website: [guild.xyz](https://guild.xyz)
- Docs: [guild.xyz/docs](https://guild.xyz/docs)
- Pricing: [guild.xyz/pricing](https://guild.xyz/pricing)
- X: [@guildxyz](https://x.com/guildxyz)
- Discord: [Guild.xyz](https://discord.gg/KUkghUdk2G)

## About this repository

This repository holds an earlier version of the Guild.xyz web interface (React and Next.js). The current app is developed elsewhere; the notes below describe this codebase.

## Key dependencies overview

- Framework
  - React with Next.js
- Styling:
  - Chakra UI (migration to Tailwind CSS and Radix UI in progress)
  - Phosphor icons
  - Framer motion
- State management:
  - SWR for fetching and caching
  - React Hook Form for form state
  - jotai for custom, simple global state
- Testing:
  - Storybook - [live deployment](https://guildxyz.github.io/guild.xyz)
  - Playwright
- Web3 related:
  - viem
  - wagmi for connection management
- Data visualization, graphics:
  - visx
  - threejs
- Deployment:
  - Vercel
- Product analytics:
  - PostHog
- Error monitoring:
  - BugSnag

## Development

### Running the interface locally

1. `npm i`
2. `npm run dev`
3. If you don't have the secret environment variables, copy the `.env.example` as `.env.local`.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

> [!WARNING]
> We've recently turned on `strict` and `strictNullChecks` tsconfig options, and decided to gradually fix the related TypeScript issues. The pre-commit hook will ignore these, but it is expected that you'll see different issues during local development. Feel free to open a PR if you fix some of them. :wink:

#### For Windows users

If you encounter the error `ERR_OSSL_EVP_UNSUPPORTED` you can do :

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm i --force
npm run dev
```

### Getting secret environment variables (for core team members):

1. Get added to the team on Vercel
1. `npm i vercel@latest -g`
1. `vercel link`
1. `vercel env pull .env.local`

### Code guidelines

- Always use design system values for styling when possible
- Follow the file naming and folder structure pattern of the repository

### Committing

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) when applicable (recommended but not required)
- Always use present tense in commit messages
- Always review your changes before committing
- A pre-commit hook type checks the code base. If it fails but you want to commit a WIP anyway use `--no-verify`

### PR flow

- Always create a draft PR right away when starting to work on a new branch
- Vercel creates a unique link for each commit and each branch (showing the latest version of the branch), which you can get from the deployment page. Share the branch link with the team if needed
- Always self-review changes in your PR before asking others. Refactor, clean up and add comments if needed. Repeat until there's no room for improvement that you see, or you've left a comment where there is
- If you consider it ready, mark it as ready for review and ask for a review, or merge it by yourself if you have the permission
