import { VStack } from "@chakra-ui/react"
import { ReactNode } from "react"

export interface Props {
  children: ReactNode
}

const HeaderSection = ({ children }: Props) => (
  <VStack position="relative" alignItems={"center"} spacing={0}>
    {children}
  </VStack>
)

export default HeaderSection
