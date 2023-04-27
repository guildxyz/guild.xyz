import { HStack, Icon, Text } from "@chakra-ui/react"
import { StarHalf } from "phosphor-react"

const NoReward = () => (
  <HStack pt="3" spacing={0} alignItems={"flex-start"} opacity=".7">
    <Icon as={StarHalf} boxSize={5} overflow="hidden" />
    <Text px="2">
      No auto-managed rewards. The owner might add some in the future or reward you
      another way!
    </Text>
  </HStack>
)

export default NoReward
