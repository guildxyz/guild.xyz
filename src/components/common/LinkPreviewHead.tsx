import Head from "next/head"

type Props = {
  path: string
}

const LinkPreviewHead = ({ path }: Props) => {
  // TODO: change this back to https://guild.xyz
  const url = `https://guild-xyz-git-og-images-with-vercel-og-zgen.vercel.app/api/${Date.now()?.toString()}/${path}`

  return (
    <Head>
      <meta property="og:image" content={url} />
      <meta name="twitter:image" content={url} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="450" />
    </Head>
  )
}

export default LinkPreviewHead
