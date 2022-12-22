import { Divider, Flex, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const ChainInfo = ({ children }: PropsWithChildren<any>) => (
  <>
    <Flex direction="column">
      <Text as="label" fontWeight={"medium"} mb={2}>
        Chain
      </Text>
      <Text fontSize="sm">{children}</Text>
    </Flex>
    <Divider />
  </>
)

export default ChainInfo
