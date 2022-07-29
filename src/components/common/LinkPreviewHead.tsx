import Head from "next/head"

type Props = {
  path: string
}

const LinkPreviewHead = ({ path }: Props) => {
  const params = new URLSearchParams({
    hash: Date.now()?.toString(),
    urlName: path,
  }).toString()
  const url = `https://guild.xyz/api/linkpreview?${params}`

  return (
    <Head>
      <meta property="og:image" content={url} />
      <meta name="twitter:image" content={url} />
      <meta property="og:image:width" content="1600" />
      <meta property="og:image:height" content="900" />
    </Head>
  )
}

export default LinkPreviewHead
