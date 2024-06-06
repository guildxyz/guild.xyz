import { Container } from "@chakra-ui/react"
import { ReactNode } from "react"

export interface Props {
  children: ReactNode
}

const MainSection = ({ children }: Props) => (
  <Container
    position="relative"
    maxW={"var(--layout-max-width)"}
    px={{ base: 4, sm: 6, md: 8, lg: 10 }}
  >
    {children}
  </Container>
)

export default MainSection
