import { Button, ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import type { LinkProps as NextLinkProps } from "next/dist/client/link"
import NextLink from "next/link"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<NextLinkProps & ChakraButtonProps>

const LinkButton = ({
  href,
  replace,
  scroll,
  shallow,
  prefetch,
  variant,
  children,
  ...chakraProps
}: Props): JSX.Element => (
  <NextLink
    passHref
    href={href}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    prefetch={prefetch}
  >
    <Button variant={variant} as="a" colorScheme="primary" {...chakraProps}>
      {children}
    </Button>
  </NextLink>
)

export default LinkButton
