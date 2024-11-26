# Guild.xyz interface

[![Code check](https://github.com/guildxyz/guild.xyz/actions/workflows/code-check.yml/badge.svg)](https://github.com/guildxyz/guild.xyz/actions/workflows/code-check.yml)

Open source interface for Guild.xyz -- a tool for platformless membership management.

- Website: [guild.xyz](https://guild.xyz)
- Docs: [docs.guild.xyz](https://docs.guild.xyz/)
- X (formerly Twitter): [@Guildxyz](https://x.com/guildxyz)
- Discord: [Guild.xyz](https://discord.gg/KUkghUdk2G)

## Key dependencies overview

- Framework
  - Next.js
- Styling:
  - Tailwind CSS
  - Radix UI
  - Phosphor icons
  - Framer motion
- State management:
  - React Hook Form for form state
  - jotai for custom, simple global state
- Testing:
  - Storybook - [live deployment](https://guildxyz.github.io/guild.xyz)
  - Playwright
- Web3 related:
  - viem
  - wagmi for connection management
- Deployment:
  - Vercel
- Product analytics:
  - PostHog

## Development

### Running the interface locally

1. `bun i`
2. `bun run dev`
3. If you don't have the secret environment variables, copy the `.env.example` as `.env.local`.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Getting secret environment variables (for core team members):

1. Get added to the team on Vercel
1. `bun i vercel@latest -g`
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
