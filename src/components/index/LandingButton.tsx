import { ButtonProps, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import React, { forwardRef, PropsWithChildren, Ref } from "react"

const LandingButton = forwardRef(
  (
    { children, ...rest }: PropsWithChildren<ButtonProps>,
    ref: Ref<HTMLButtonElement>
  ) => {
    const size = useBreakpointValue({ base: "md", md: "lg", xl: "xl" })
    return (
      <Button ref={ref} size={size} fontWeight="bold" {...rest}>
        {children}
      </Button>
    )
  }
)

export default LandingButton
