import NextHead from "next/head"

interface Props {
  ogTitle?: string
  ogDescription?: string
  image?: JSX.Element
  imageUrl?: string
  title?: JSX.Element | string
}

export const Head = ({ ogTitle, ogDescription, title, imageUrl }: Props) => {
  return (
    <NextHead>
      <title>{`${ogTitle ?? title}`}</title>
      <meta property="og:title" content={`${ogTitle ?? title}`} />
      <link rel="shortcut icon" href={imageUrl ?? "/guild-icon.png"} />
      {ogDescription && (
        <>
          <meta name="description" content={ogDescription} />
          <meta property="og:description" content={ogDescription} />
        </>
      )}
    </NextHead>
  )
}
