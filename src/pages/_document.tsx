import Document, { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head>
          {process.env.NODE_ENV === "production" && (
            <>
              <Script
                async
                defer
                src="https://js.jam.dev/support/d00eb75d-44cf-48af-a274-ae7c828bb08e.js"
              />
            </>
          )}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@guildxyz" />
          <link rel="manifest" href="/manifest.webmanifest" />
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
          <canvas
            id="js-confetti-canvas"
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              zIndex: 10001,
              pointerEvents: "none",
            }}
          />
        </body>
      </Html>
    )
  }
}

export default MyDocument
