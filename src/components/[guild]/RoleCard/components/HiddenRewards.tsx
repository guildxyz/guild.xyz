import { Circle, useColorModeValue } from "@chakra-ui/react"
import { Question } from "@phosphor-icons/react"
import RewardCard from "components/common/RewardCard"

const HiddenRewards = () => {
  const rewardImageBgColor = useColorModeValue("gray.700", "gray.600")

  return (
    <RewardCard
      colorScheme="gray"
      title="Some secret rewards"
      image={
        <Circle size={10} bgColor={rewardImageBgColor}>
          <Question color="white" />
        </Circle>
      }
      p={4}
      pt={4}
    />
  )
}

export default HiddenRewards
