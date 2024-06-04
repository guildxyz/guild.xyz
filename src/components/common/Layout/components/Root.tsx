import { Box, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { LAYOUT_MAX_WIDTH_CSS_VAR } from "../constants"

type Props = PropsWithChildren<{
  background?: string
  maxWidth?: `sizes.${string}`
}>

function Root({ children, background, maxWidth = "sizes.container.lg" }: Props) {
  const bgColor = useColorModeValue("gray.100", "gray.800")
  const bgGradient = `linear(${useColorModeValue(
    "white",
    "var(--chakra-colors-gray-800)"
  )} 0px, var(--chakra-colors-gray-100) 700px)`
  const bgBlendMode = useColorModeValue("normal", "color")

  return (
    <Box
      sx={{ [LAYOUT_MAX_WIDTH_CSS_VAR]: maxWidth }}
      position="relative"
      bgColor={bgColor}
      bgGradient={background ? undefined : bgGradient}
      bgBlendMode={bgBlendMode}
      minHeight="100vh"
      display="flex"
      flexDir={"column"}
      color="var(--chakra-colors-chakra-body-text)"
    >
      {children}
    </Box>
  )
}

export default Root
