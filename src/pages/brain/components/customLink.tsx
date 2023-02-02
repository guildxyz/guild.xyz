import { Link } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import slugify from "slugify"

const CustomLink = ({
  children,
}: PropsWithChildren<{ href: string; children: any }>) => {
  const slugifiedTitle = slugify(children.props.block?.properties.title[0][0], {
    lower: true,
  })

  return (
    <Link href={`/brain/${slugifiedTitle}`} colorScheme={"blue"} fontWeight="medium">
      {children.props.block?.properties.title[0][0]}
    </Link>
  )
}

export default CustomLink
