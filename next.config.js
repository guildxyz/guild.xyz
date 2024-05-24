// @ts-check

const { BugsnagSourceMapUploaderPlugin } = require("webpack-bugsnag-plugins")

/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            replaceAttrValues: { "#fff": "currentColor" },
          },
        },
      ],
    })

    if (process.env.VERCEL_ENV === "production") {
      if (!config.plugins) config.plugins = []
      config.plugins.push(
        new BugsnagSourceMapUploaderPlugin({
          apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY ?? "",
          overwrite: true,
          publicPath: `https://${process.env.VERCEL_URL ?? "guild.xyz"}/_next/`,
        })
      )
    }

    return config
  },
  productionBrowserSourceMaps: true,

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "storageapi.fleek.co",
      },
      {
        hostname: "ipfs.fleek.co",
      },
      {
        hostname: "cdn.discordapp.com",
      },
      {
        hostname: "guild-xyz.mypinata.cloud",
      },
      {
        hostname: "assets.poap.xyz",
      },
      {
        hostname: "pbs.twimg.com",
      },
      {
        hostname: "abs.twimg.com",
      },
      {
        hostname: "guild.xyz",
      },
      {
        hostname: "discord.com",
      },
      {
        hostname: "img.evbuc.com",
      },
      {
        hostname: "images.lumacdn.com",
      },
      {
        hostname: "og.link3.to",
      },
    ],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/arc",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          // Redirecting to the "home page", because we had an incorrect QR code on the packaging
          destination: "/lego",
        },
        {
          source: "/light",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          destination: "/lego/LightGuildEmpireAssembly.pdf",
        },
        {
          source: "/dark",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          destination: "/lego/DarkGuildEmpireAssembly.pdf",
        },
        {
          source: "/castle",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          destination: "https://guild.xyz/lego/GuildCastleAssembly.pdf",
        },
        {
          source: "/dude",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          destination: "/lego/GuildDudeAssembly.pdf",
        },
        {
          source: "/fox",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          destination: "/lego/GuildFoxAssembly.pdf",
        },
        {
          source: "/ghost",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          destination: "/lego/GuildGhostAssembly.pdf",
        },
      ],
      afterFiles: [
        {
          source: "/js/script.js",
          destination: "https://stat.zgen.hu/js/plausible.exclusions.js",
        },
        {
          source: "/api/event",
          destination: "https://stat.zgen.hu/api/event",
        },
        {
          source: "/sitemap.xml",
          destination: "/api/sitemap.xml",
        },
        {
          source: "/api/posthog/:path*",
          destination: "https://app.posthog.com/:path*",
        },
        {
          source: "/api/bugsnag/notify",
          destination: "https://notify.bugsnag.com",
        },
        {
          source: "/api/bugsnag/sessions",
          destination: "https://sessions.bugsnag.com",
        },
      ],
      fallback: [],
    }
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/explorer",
        permanent: false,
        has: [
          {
            type: "host",
            value: "guild.xyz",
          },
        ],
      },
      {
        source: "/community",
        destination:
          "https://help.guild.xyz/en/collections/3826818-our-guild-the-community",
        permanent: false,
      },
      {
        source: "/guild/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/ethdenver/:path*",
        destination: "/guildday/:path*",
        permanent: true,
      },
      {
        source: "/buildonbase/:path*",
        destination: "/base/:path*",
        permanent: true,
      },
      {
        source: "/protein-community/:path*",
        destination: "/protein/:path*",
        permanent: false,
      },
      {
        source: "/courtside/:path*",
        destination: "/the-krause-house/:path*",
        permanent: false,
      },
      {
        source: "/club-level/:path*",
        destination: "/the-krause-house/:path*",
        permanent: false,
      },
      {
        source: "/upper-level/:path*",
        destination: "/the-krause-house/:path*",
        permanent: false,
      },
      {
        source: "/ticketholder/:path*",
        destination: "/the-krause-house/:path*",
        permanent: false,
      },
      {
        source: "/entr-hodlers/:path*",
        destination: "/enter-dao/:path*",
        permanent: false,
      },
      {
        source: "/sharded-minds/:path*",
        destination: "/enter-dao/:path*",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
