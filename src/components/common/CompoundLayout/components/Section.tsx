import { Container, VStack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
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

interface GenericSection extends Props {
  variant: "main" | "header"
}

export function MainSection({ children, maxWidth = "container.lg" }: Props) {
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

export function HeaderSection({ children, maxWidth = "container.lg" }: Props) {
  return (
    <VStack
      position="relative"
      alignItems={"center"}
      spacing={0}
      // maxW={maxWidth}
      // pt={{ base: 6, md: 9 }}
      // px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    >
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
