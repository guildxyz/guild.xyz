module.exports = {
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

    /**
     * Filtering packages which can't be used in the edge runtime, to avoid build
     * warnings and errors
     */
    if (options.isServer && options.nextRuntime === "edge") {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@datadog/browser-rum": false,
        "@datadog/rum-react-integration": false,
        "@chakra-ui/react": false,
        "@web3-react/coinbase-wallet": false,
        "@web3-react/core": false,
        "@web3-react/metamask": false,
        "@web3-react/walletconnect": false,
        "@ethersproject/keccak256": false,
      }
    }

    return config
  },
  productionBrowserSourceMaps: true,
  images: {
    domains: [
      "storageapi.fleek.co",
      "ipfs.fleek.co",
      "cdn.discordapp.com",
      "guild-xyz.mypinata.cloud",
      "assets.poap.xyz",
      "pbs.twimg.com",
      "abs.twimg.com",
      "localhost",
      "guild.xyz",
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "guard.guild.xyz",
            },
          ],
          destination: "/guard/",
        },
        {
          source: "/setup",
          has: [
            {
              type: "host",
              value: "guard.guild.xyz",
            },
          ],
          destination: "/guard/setup",
        },
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "lego.guild.xyz",
            },
          ],
          destination: "/lego/",
        },
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
          destination: "/lego/GuildCastleAssembly.pdf",
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
          destination: "https://stat.zgen.hu/js/plausible.js",
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
          source: "/api/ddrum",
          has: [
            {
              type: "query",
              key: "ddforward",
              value: "https://(?<ddforward>.*)",
            },
          ],
          destination: "https://:ddforward",
        },
      ],
    }
  },
  async redirects() {
    return [
      {
        source: "/guild-community",
        destination:
          "https://abalone-professor-5d6.notion.site/Welcome-to-the-guilds-of-Guild-d9604333bee9478497b05455437f03c1",
        permanent: false,
      },
      {
        source: "/developer-meetup-202216:31",
        destination: "/developer-meetup-2022",
        permanent: true,
      },
      {
        source: "/guild/:path*",
        destination: "/:path*",
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
