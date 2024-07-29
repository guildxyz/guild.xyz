import { Circle, Icon, Img, useColorModeValue } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useState } from "react"
import rewards from "rewards"
import { PlatformType } from "types"
import { RewardIconProps } from "./types"

const MotionImg = motion(Img)
const MotionCircle = motion(Circle)

export const RewardIcon = ({
  rolePlatformId,
  guildPlatform,
  withMotionImg = true,
  transition,
}: RewardIconProps) => {
  const [doIconFallback, setDoIconFallback] = useState(false)
  const reward = rewards[PlatformType[guildPlatform.platformId]]
  const props = {
    src: guildPlatform.platformGuildData?.imageUrl ?? reward.imageUrl,
    alt: guildPlatform.platformGuildName,
    boxSize: 6,
    rounded: "full",
    onError: () => {
      setDoIconFallback(true)
    },
  }

  const motionElementProps = {
    layoutId: `${rolePlatformId}_reward_img`,
    transition: { type: "spring", duration: 0.5, ...transition },
  }
  const circleBgColor = useColorModeValue("gray.700", "gray.600")
  const circleProps = {
    bgColor: circleBgColor,
    boxSize: 6,
  }

  if (doIconFallback || !props.src) {
    if (withMotionImg) {
      return (
        <MotionCircle {...motionElementProps} {...circleProps}>
          <Icon as={reward.icon} color="white" boxSize={3} />
        </MotionCircle>
      )
    }
    return (
      <Circle {...circleProps}>
        <Icon as={reward.icon} color="white" boxSize={3} />
      </Circle>
    )
  }

  return (
    <Circle as="picture">
      <source srcSet={reward.imageUrl} />
      {withMotionImg ? (
        <MotionImg {...motionElementProps} {...props} />
      ) : (
        <Img {...props} />
      )}
    </Circle>
  )
}
