import { Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const RequirementText = ({ children }: PropsWithChildren<any>) => (
  <Text fontWeight="bold" letterSpacing="wide">
    {children}
  </Text>
)

export default RequirementText
