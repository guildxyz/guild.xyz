import Document, { Head, Html, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head>
          <link
            rel="preload stylesheet"
            as="style"
            href="https://rsms.me/inter/inter.css"
            crossOrigin="anonymous"
          />
          <link
            rel="preload stylesheet"
            as="style"
            href="/fonts/fonts.css"
            crossOrigin="anonymous"
          />
          {process.env.NODE_ENV === "production" && (
            <>
              <script
                async
                defer
                src="/js/script.js"
                data-api="/api/event"
                data-domain="alpha.guild.xyz"
              ></script>
              <script async src="/js/dd_rum.js"></script>
            </>
          )}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@guildxyz" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div
            id="chakra-react-select-portal"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 9999,
              width: 0,
              height: 0,
            }}
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument
