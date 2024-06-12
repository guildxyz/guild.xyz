import { Container } from "@chakra-ui/react"
import { BoxProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<Omit<BoxProps, "title">>

const MainSection = ({ children, ...boxProps }: Props) => (
  <Container
    position="relative"
    maxW={"var(--layout-max-width)"}
    px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    {...boxProps}
  >
    {children}
  </Container>
)

export default MainSection
