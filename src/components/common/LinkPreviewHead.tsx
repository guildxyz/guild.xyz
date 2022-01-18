import Head from "next/head"
import { useRouter } from "next/router"

const LinkPreviewHead = () => {
  const router = useRouter()
  const url = `https://alpha.guild.xyz/api/linkpreview${router.asPath}`

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
