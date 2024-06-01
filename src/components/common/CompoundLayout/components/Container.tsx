import { Container as ChakraContainer } from "@chakra-ui/react"
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

export function Container({ children, maxWidth = "container.lg" }: Props) {
  return (
    <ChakraContainer
      // to be above the absolutely positioned background box
      position="relative"
      maxW={maxWidth}
      pt={{ base: 6, md: 9 }}
      px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    >
      {children}
    </ChakraContainer>
  )
}
