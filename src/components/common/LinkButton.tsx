import { ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import type { LinkProps } from "next/dist/client/link"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<LinkProps & ChakraButtonProps>

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
  <Button
    as={Link}
    href={href}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    prefetch={prefetch}
    variant={variant}
    colorScheme="primary"
    {...chakraProps}
  >
    {children}
  </Button>
)

export default LinkButton
