import Head from "next/head"

type Props = {
  path: string
}

const getTimestamp = () => {
  const rounded = new Date()
  rounded.setMinutes(0)
  rounded.setSeconds(0)
  rounded.setMilliseconds(0)
  return rounded.getTime()
}

const LinkPreviewHead = ({ path }: Props) => {
  const url = `https://guild.xyz/api/linkpreview/${getTimestamp()}/${path}`

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
