import NextHead from "next/head"

interface Props {
  ogTitle: string
  ogDescription?: string
  imageUrl?: string
}

const Head = ({ ogTitle, ogDescription, imageUrl }: Props) => (
  <NextHead>
    <title>{ogTitle}</title>
    <meta property="og:title" content={ogTitle} />
    <link rel="shortcut icon" href={imageUrl ?? "/guild-icon.png"} />
    {ogDescription && (
      <>
        <meta name="description" content={ogDescription} />
        <meta property="og:description" content={ogDescription} />
      </>
    )}
  </NextHead>
)

export default Head
