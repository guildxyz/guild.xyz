module.exports = {
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

    return config
  },
  images: {
    domains: ["storageapi.fleek.co", "ipfs.fleek.co", "cdn.discordapp.com"],
  },
  async rewrites() {
    return [
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
    ]
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
