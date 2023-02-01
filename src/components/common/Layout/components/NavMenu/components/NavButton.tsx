import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { forwardRef, PropsWithChildren, Ref } from "react"
import { Rest } from "types"

const NavButton = forwardRef(
  (
    { href, children, ...rest }: PropsWithChildren<ButtonProps & Rest>,
    ref: Ref<HTMLButtonElement>
  ) => {
    const router = useRouter()

    return (
      <NextLink passHref href={href}>
        <Button
          as="a"
          ref={ref}
          variant="ghost"
          h={10}
          w="full"
          justifyContent="left"
          {...rest}
          fontWeight={router.route === href ? "semibold" : "normal"}
          backgroundColor={router.route === href && "whiteAlpha.200"}
        >
          {children}
        </Button>
      </NextLink>
    )
  }
)

export default NavButton
