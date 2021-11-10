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
            <script
              async
              defer
              data-host-url="https://stats.guild.xyz"
              data-website-id="69d05fe0-195f-4c95-baf7-4fdf1f82fc56"
              src="https://stats.guild.xyz/umami.js"
            ></script>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
