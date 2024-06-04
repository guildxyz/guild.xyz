import { Box, useColorMode } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { LAYOUT_MAX_WIDTH_CSS_VAR } from "../constants"

type Props = PropsWithChildren<{
  background?: string
  maxWidth?: string
}>

function Root({ children, background, maxWidth = "sizes.container.lg" }: Props) {
  const { colorMode } = useColorMode()

  return (
    <Box
      sx={{ [LAYOUT_MAX_WIDTH_CSS_VAR]: maxWidth }}
      position="relative"
      bgColor={colorMode === "light" ? "gray.100" : "gray.800"}
      bgGradient={
        !background
          ? `linear(${
              colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
            } 0px, var(--chakra-colors-gray-100) 700px)`
          : undefined
      }
      bgBlendMode={colorMode === "light" ? "normal" : "color"}
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
