/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ['@fuels/connectors', '@fuels/react'],
  webpack(config) {
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

    return config
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "guild-xyz.mypinata.cloud",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
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
          source: "/api/posthog/:path*",
          destination: "https://app.posthog.com/:path*",
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
        source: "/buildonbase/:path*",
        destination: "/base/:path*",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
