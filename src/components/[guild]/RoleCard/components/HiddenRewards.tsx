import { Center, useColorModeValue } from "@chakra-ui/react"
import { Question } from "@phosphor-icons/react"
import { RewardDisplay } from "./RewardDisplay"

const HiddenRewards = () => {
  const rewardImageBgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  return (
    <RewardDisplay
      label={"Some secret rewards"}
      icon={
        <Center
          boxSize={25}
          backgroundColor={rewardImageBgColor}
          borderRadius={"full"}
        >
          <Question />
        </Center>
      }
    />
  )
}

export default HiddenRewards
