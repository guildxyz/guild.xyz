import { Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const RequirementText = ({ children }: PropsWithChildren<any>) => (
  <Text fontWeight="bold" letterSpacing="wide" wordBreak="break-word">
    {children}
  </Text>
)

export default RequirementText
