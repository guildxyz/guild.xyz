import { Box, BoxProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<Omit<BoxProps, "title">>

const Content = ({ children, ...wrapperProps }: Props) => (
  <Box {...wrapperProps}>{children}</Box>
)

export default Content
