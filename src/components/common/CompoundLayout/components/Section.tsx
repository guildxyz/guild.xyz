import { Container, VStack } from "@chakra-ui/react"
import { ReactNode } from "react"
import { callCssVariable } from "../callCssVariable"
import { LAYOUT_MAX_WIDTH_CSS_VAR } from "../constants"

interface SectionProps {
  children: ReactNode
}

export function MainSection({ children }: SectionProps) {
  return (
    <Container
      position="relative"
      maxW={callCssVariable(LAYOUT_MAX_WIDTH_CSS_VAR)}
      px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    >
      {children}
    </Container>
  )
}

export function HeaderSection({ children }: SectionProps) {
  return (
    <VStack position="relative" alignItems={"center"} spacing={0}>
      {children}
    </VStack>
  )
}
