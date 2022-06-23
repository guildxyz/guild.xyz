import { Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const RequirementText = ({ children }: PropsWithChildren<any>) => (
  <Text wordBreak="break-word">{children}</Text>
)

export default RequirementText
