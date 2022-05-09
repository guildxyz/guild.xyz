import { Heading, HeadingProps } from "@chakra-ui/react"
import React, { PropsWithChildren } from "react"

const LandingSectionTitle = ({
  children,
  ...rest
}: PropsWithChildren<HeadingProps>) => (
  <Heading as="h3" fontFamily="display" fontSize="4xl" {...rest}>
    {children}
  </Heading>
)

export default LandingSectionTitle
