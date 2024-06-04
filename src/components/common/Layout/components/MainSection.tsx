import { Container } from "@chakra-ui/react"
import { ReactNode } from "react"
import { wrapInCssVar } from "../../../../utils/callCssVariable"
import { LAYOUT_MAX_WIDTH_CSS_VAR } from "../constants"

export interface Props {
  children: ReactNode
}

const MainSection = ({ children }: Props) => (
  <Container
    position="relative"
    maxW={wrapInCssVar(LAYOUT_MAX_WIDTH_CSS_VAR)}
    px={{ base: 4, sm: 6, md: 8, lg: 10 }}
  >
    {children}
  </Container>
)

export default MainSection
