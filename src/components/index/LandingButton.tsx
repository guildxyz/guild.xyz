import { ButtonProps, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import React, { PropsWithChildren } from "react"

const LandingButton = ({ children, ...rest }: PropsWithChildren<ButtonProps>) => {
  const size = useBreakpointValue({ base: "md", md: "lg" })
  return (
    <Button size={size} fontWeight="bold" {...rest}>
      {children}
    </Button>
  )
}

export default LandingButton
