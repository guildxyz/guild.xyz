import Head from "next/head"

type Props = {
  path: string
}

const LinkPreviewHead = ({ path }: Props) => {
  const url = `https://alpha.guild.xyz/api/linkpreview/${path}`

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
