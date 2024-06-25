import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Guild APIs
    GUILD_API_KEY: z.string(),
    BALANCY_TOKEN: z.string(),

    // Vercel
    LEADERBOARD_REVALIDATION_SECRET: z.string(),
    KV_REST_API_READ_ONLY_TOKEN: z.string(),
    KV_REST_API_TOKEN: z.string(),
    KV_REST_API_URL: z.string(),
    KV_URL: z.string(),
    POSTGRES_DATABASE: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_PRISMA_URL: z.string(),
    POSTGRES_URL: z.string(),
    POSTGRES_URL_NON_POOLING: z.string(),
    POSTGRES_USER: z.string(),

    // Alchemy
    MAINNET_ALCHEMY_KEY: z.string(),
    POLYGON_ALCHEMY_KEY: z.string(),
    SEPOLIA_ALCHEMY_KEY: z.string(),
    OPTIMISM_ALCHEMY_KEY: z.string(),
    BASE_ALCHEMY_KEY: z.string(),
    ARBITRUM_ALCHEMY_KEY: z.string(),

    // IPFS
    PINATA_ADMIN_JWT: z.string(),
    PINATA_ADMIN_KEY: z.string(),
    PINATA_ADMIN_SECRET: z.string(),

    // Third-party
    COINBASE_PAY_API_KEY: z.string(),
    NOOX_KEY: z.string(),
    OPENSEA_API_KEY: z.string(),
    SOUND_API_KEY: z.string(),
    ZEROX_API_KEY: z.string(),

    // NPM
    WAAS_VIEM_URL: z.string(),
    WAAS_WEB_URL: z.string(),
  },
  client: {
    // Guild APIs
    NEXT_PUBLIC_API: z.string(),
    NEXT_PUBLIC_BALANCY_API: z.string(),
    NEXT_PUBLIC_POLYGONID_API: z.string(),

    // Captcha
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string(),

    // Analytics & monitoring
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_BUGSNAG_KEY: z.string(),

    // IPFS
    NEXT_PUBLIC_IPFS_GATEWAY: z.string(),
    NEXT_PUBLIC_PINATA_API: z.string(),

    // Vercel
    NEXT_PUBLIC_EDGE_CONFIG_ID: z.string(),
    NEXT_PUBLIC_EDGE_CONFIG_READ_ACCESS_TOKEN: z.string(),

    // Third-party
    NEXT_PUBLIC_DISCORD_CLIENT_ID: z.string(),
    NEXT_PUBLIC_TG_BOT_USERNAME: z.string(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string(),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_BALANCY_API: process.env.NEXT_PUBLIC_BALANCY_API,
    NEXT_PUBLIC_POLYGONID_API: process.env.NEXT_PUBLIC_POLYGONID_API,

    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,

    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_BUGSNAG_KEY: process.env.NEXT_PUBLIC_BUGSNAG_KEY,

    NEXT_PUBLIC_IPFS_GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
    NEXT_PUBLIC_PINATA_API: process.env.NEXT_PUBLIC_PINATA_API,

    NEXT_PUBLIC_EDGE_CONFIG_ID: process.env.NEXT_PUBLIC_EDGE_CONFIG_ID,
    NEXT_PUBLIC_EDGE_CONFIG_READ_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_EDGE_CONFIG_READ_ACCESS_TOKEN,

    NEXT_PUBLIC_DISCORD_CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
    NEXT_PUBLIC_TG_BOT_USERNAME: process.env.NEXT_PUBLIC_TG_BOT_USERNAME,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL:
      process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    GUILD_API_KEY: process.env.GUILD_API_KEY,
    BALANCY_TOKEN: process.env.BALANCY_TOKEN,

    LEADERBOARD_REVALIDATION_SECRET: process.env.LEADERBOARD_REVALIDATION_SECRET,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_URL: process.env.KV_URL,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,

    MAINNET_ALCHEMY_KEY: process.env.MAINNET_ALCHEMY_KEY,
    POLYGON_ALCHEMY_KEY: process.env.POLYGON_ALCHEMY_KEY,
    SEPOLIA_ALCHEMY_KEY: process.env.SEPOLIA_ALCHEMY_KEY,
    OPTIMISM_ALCHEMY_KEY: process.env.OPTIMISM_ALCHEMY_KEY,
    BASE_ALCHEMY_KEY: process.env.BASE_ALCHEMY_KEY,
    ARBITRUM_ALCHEMY_KEY: process.env.ARBITRUM_ALCHEMY_KEY,

    PINATA_ADMIN_JWT: process.env.PINATA_ADMIN_JWT,
    PINATA_ADMIN_KEY: process.env.PINATA_ADMIN_KEY,
    PINATA_ADMIN_SECRET: process.env.PINATA_ADMIN_SECRET,

    COINBASE_PAY_API_KEY: process.env.COINBASE_PAY_API_KEY,
    NOOX_KEY: process.env.NOOX_KEY,
    OPENSEA_API_KEY: process.env.OPENSEA_API_KEY,
    SOUND_API_KEY: process.env.SOUND_API_KEY,
    ZEROX_API_KEY: process.env.ZEROX_API_KEY,

    WAAS_VIEM_URL: process.env.WAAS_VIEM_URL,
    WAAS_WEB_URL: process.env.WAAS_WEB_URL,
  },
})
