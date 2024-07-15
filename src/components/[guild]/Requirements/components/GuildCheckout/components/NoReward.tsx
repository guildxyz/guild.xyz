import { HStack, Icon, Text } from "@chakra-ui/react"
import { PiStarHalf } from "react-icons/pi"

const NoReward = () => (
  <HStack pt="3" spacing={0} alignItems={"flex-start"} opacity=".7">
    <Icon as={PiStarHalf} boxSize={5} overflow="hidden" />
    <Text px="2">
      No auto-managed rewards. The owner might add some in the future or reward you
      another way!
    </Text>
  </HStack>
)

export default NoReward
