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
          <script async data-api="/_hive" src="/bee.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <iframe
            title="soundCloud-placeholder-for-celeberation-music"
            id="sound"
            style={{
              position: 'fixed',
              bottom: '0.2rem',
              right: '0.2rem',
            }}
            width="0"
            height="0"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src=""
          ></iframe>
        </body>
      </Html>
    )
  }
}

export default MyDocument
