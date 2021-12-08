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
    domains: ["storageapi.fleek.co"],
  },
  async redirects() {
    return [
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
    ]
  },
}
