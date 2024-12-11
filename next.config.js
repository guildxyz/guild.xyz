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

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "zgen",
    project: "guildxyz",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    sourcemaps: { deleteSourcemapsAfterUpload: true },
  }
);
