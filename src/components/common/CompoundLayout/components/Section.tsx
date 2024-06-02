import { Container, VStack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type SectionProps = PropsWithChildren<{
  // image?: JSX.Element
  // imageUrl?: string
  // title?: JSX.Element | string
  // ogTitle?: string
  // ogDescription?: string
  // description?: JSX.Element
  // action?: ReactNode | undefined
  // background?: string
  // backgroundProps?: BoxProps
  // backgroundImage?: string
  // backgroundOffset?: number
  // backButton?: JSX.Element
  maxWidth?: string
  // showFooter?: boolean
}>

interface GenericSection extends SectionProps {
  variant: "main" | "header"
}

export function MainSection({ children, maxWidth = "container.lg" }: SectionProps) {
  return (
    <Container
      position="relative"
      maxW={maxWidth}
      // pt={{ base: 6, md: 9 }}
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

export function Section({ variant, ...rest }: GenericSection) {
  switch (variant) {
    case "header": {
      return <HeaderSection {...rest} />
    }
    case "main": {
      return <MainSection {...rest} />
    }
    default: {
      throw new Error("Unhandled case:", variant)
    }
  }
}
