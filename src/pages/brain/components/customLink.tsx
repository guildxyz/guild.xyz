import { Link } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const CustomLink = ({
  href,
  children,
}: PropsWithChildren<{ href: string; children: any }>) => {
  const linkId =
    href.slice(1, 9) +
    "-" +
    href.slice(9, 13) +
    "-" +
    href.slice(13, 17) +
    "-" +
    href.slice(17, 21) +
    "-" +
    href.slice(21)

  return (
    <Link href={`/brain/${linkId}`} colorScheme={"blue"} fontWeight="medium">
      {children.props.block?.properties.title[0][0]}
    </Link>
  )
}

export default CustomLink
