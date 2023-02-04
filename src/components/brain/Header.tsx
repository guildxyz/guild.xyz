import {
  Button,
  Img,
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
} from "@chakra-ui/react"
import { DiscordLogo, Globe, TwitterLogo } from "phosphor-react"
import { PropsWithChildren } from "react"

const getProperties = (props) => {
  const tags = props?.block?.properties?.["`SJU"]?.[0]?.[0]
    .split(",")
    .filter((tag) => tag !== "")
  const guildSlug = props?.block?.properties?.JqtI?.[0]?.[0]
  const websiteURL = props?.block?.properties?.uRBq?.[0]?.[0]
  const twitterURL = props?.block?.properties?.["ByX="]?.[0]?.[0]
  const discordURL = props?.block?.properties?.["Uw?a"]?.[0]?.[0]
  const isContentTypePage = props?.block?.properties?.KYWu?.[0]?.[0] === "content"
  return { tags, guildSlug, websiteURL, twitterURL, discordURL, isContentTypePage }
}

const Header = (props) => {
  const { tags, guildSlug, websiteURL, twitterURL, discordURL, isContentTypePage } =
    getProperties(props)

  if (
    (tags === undefined || tags.length === 0) &&
    guildSlug === undefined &&
    websiteURL === undefined &&
    twitterURL === undefined &&
    discordURL === undefined
  )
    return null
  if (isContentTypePage) return

  const GuildIcon = (): JSX.Element => (
    <Img src="/guildLogos/logo.svg" w="16px" mr="8px"></Img>
  )

  const links: PropsWithChildren<
    Array<{
      name: string
      url: string
      icon?: any
    }>
  > = [
    { name: "Guild", url: guildSlug, icon: GuildIcon },
    { name: "website", url: websiteURL, icon: Globe },
    { name: "Twitter", url: twitterURL, icon: TwitterLogo },
    { name: "Discord", url: discordURL, icon: DiscordLogo },
  ].filter((link) => link.url !== undefined && link.url !== "")

  links.map((link) => {
    if (link.name === "Guild") return
    link.url = !link.url.startsWith("http") ? "http://" + link.url : link.url
  })

  return (
    <Wrap justify="space-between" pb="8px">
      <Wrap>
        {links?.map((link, index) => (
          <Link
            key={index}
            href={link.name !== "Guild" ? link.url : `/${link.url}`}
            isExternal={link.name !== "Guild"}
            textDecoration="none !important"
          >
            <Button colorScheme="alpha" color="whiteAlpha.900" height={8}>
              <TagLeftIcon as={link.icon} />
              {link.name}
            </Button>
          </Link>
        ))}
      </Wrap>
      <Wrap>
        {tags?.map((tag, index) => (
          <Tag as="li" key={index}>
            <TagLabel>{tag}</TagLabel>
          </Tag>
        ))}
      </Wrap>
    </Wrap>
  )
}

export default Header
