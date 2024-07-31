// @ts-check

const { BugsnagSourceMapUploaderPlugin } = require("webpack-bugsnag-plugins")
const CircularDependencyPlugin = require("circular-dependency-plugin")

/** @type {import("next").NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: process.env.TS_CONFIG_PATH,
  },
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

    // To get rid of "Can't resolve ..." errors which come from some wallet connector SDKs
    config.externals.push("pino-pretty", "lokijs", "encoding")

    if (!config.plugins) config.plugins = []
    if (process.env.VERCEL_ENV === "production") {
      config.plugins.push(
        new BugsnagSourceMapUploaderPlugin({
          apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY ?? "",
          overwrite: true,
          publicPath: `https://${process.env.VERCEL_URL ?? "guild.xyz"}/_next/`,
        })
      )
      config.plugins.push(
        new CircularDependencyPlugin({
          exclude: /.next|node_modules/,
          include: /src/,
          // TODO: if all circular dependencies are resolved, set this argument to true
          failOnError: false,
          allowAsyncCycles: false,
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
    bundlePagesExternals: process.env.NODE_ENV !== "development",
    optimizePackageImports: [
      "@phosphor-icons/react",
      "@phosphor-icons/react/dist/ssr",
      "@fuels/react",
      "fuels",
    ],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js"
        }
      }
    }
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
