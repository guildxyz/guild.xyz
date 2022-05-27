import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import React, { forwardRef, PropsWithChildren, Ref } from "react"
import { Rest } from "types"

const NavButton = forwardRef(
  (
    { children, ...rest }: PropsWithChildren<ButtonProps & Rest>,
    ref: Ref<HTMLButtonElement>
  ) => (
    <Button
      as="a"
      ref={ref}
      variant="ghost"
      h={10}
      w="full"
      justifyContent="left"
      fontWeight="sm"
      {...rest}
    >
      {children}
    </Button>
  )
)

export default NavButton
