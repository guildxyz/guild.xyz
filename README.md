# Guild.xyz interface

Open source interface for Guild.xyz -- a tool for platformless membership management.

- Website: [guild.xyz](https://guild.xyz)
- Docs: [docs.guild.xyz](https://docs.guild.xyz/)
- Twitter: [@Guildxyz](https://twitter.com/guildxyz)
- Email: [contact@agora.space](mailto:contact@agora.space)
- Discord: [Guild.xyz](https://discord.gg/guildxyz)

## Key dependencies overview

- Framework
  - React with Next.js
- Styling:
  - Chakra UI
  - Phosphor icons
  - Framer motion
- State management:
  - SWR for fetching and caching
  - React Hook Form for form state
- Web3 stuff:
  - ethers.js
  - web3-react for connection management
- Deployment:
  - Vercel
- Monitoring:
  - Datadog

## Development

### Running the interface locally:

1. `npm i`
2. `npm run dev`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

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

### Committing:

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) when applicable (recommended but not required)
- Always use present tense in commit messages
- Always review your changes before committing
- A pre-commit hook type checks the code base. If it fails but you want to commit a WIP anyway use `--no-verify`

### PR flow:

- Always create a draft PR right away when starting to work on a new branch
- Vercel creates a unique link for each commit and each branch (showing the latest version of the branch), which you can get from the deployment page. Share the branch link with the team if needed
- Always self-review changes in your PR before asking others. Refactor, clean up and add comments if needed. Repeat until there's no room for improvement that you see, or you've left a comment where there is
- If you consider it ready, mark it as ready for review and ask for a review, or merge it by yourself if you have the permission
