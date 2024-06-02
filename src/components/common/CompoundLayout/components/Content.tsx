import { Box, BoxProps } from "@chakra-ui/react"
import { PropsWithChildren, useRef } from "react"

type Props = PropsWithChildren<Omit<BoxProps, "title">>

export const Content = ({ children, ...wrapperProps }: Props) => {
  const childrenWrapper = useRef(null)

  return (
    <Box ref={childrenWrapper} {...wrapperProps}>
      {children}
    </Box>
  )
}
