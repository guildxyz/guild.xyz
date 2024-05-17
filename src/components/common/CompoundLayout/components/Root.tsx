import { Box, Container, useColorMode } from "@chakra-ui/react"
import React, { PropsWithChildren, useMemo } from "react"
import { Footer } from "./Footer"
import { doesComponentExistIn } from "../doesComponentExistIn"

type Props = PropsWithChildren<{
  // image?: JSX.Element
  // imageUrl?: string
  // title?: JSX.Element | string
  // ogTitle?: string
  // ogDescription?: string
  // description?: JSX.Element
  // action?: ReactNode | undefined
  background?: string
  // backgroundProps?: BoxProps
  // backgroundImage?: string
  // backgroundOffset?: number
  // backButton?: JSX.Element
  maxWidth?: string
  // showFooter?: boolean
}>

export function Root({ children, maxWidth = "container.lg", background }: Props) {
  const showFooter = useMemo(
    () => doesComponentExistIn(children, Footer),
    [children]
  )
  const { colorMode } = useColorMode()

  return (
    <Box
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
      <Container
        // to be above the absolutely positioned background box
        position="relative"
        maxW={maxWidth}
        pt={{ base: 6, md: 9 }}
        pb={showFooter && 24}
        px={{ base: 4, sm: 6, md: 8, lg: 10 }}
      >
        {children}
      </Container>
    </Box>
  )
}
