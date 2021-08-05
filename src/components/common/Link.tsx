import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react"
import { LinkProps as NextLinkProps } from "next/dist/client/link"
import NextLink from "next/link"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<NextLinkProps & Omit<ChakraLinkProps, "as">>

//  Has to be a new component because both chakra and next share the `as` keyword
const Link = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  children,
  ...chakraProps
}: Props): JSX.Element => (
  <NextLink
    passHref
    href={href}
    as={as}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    prefetch={prefetch}
  >
    <ChakraLink {...chakraProps}>{children}</ChakraLink>
  </NextLink>
)

export default Link
