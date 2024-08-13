import { Icon } from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react"
import rewards from "rewards"
import { RewardCardButton } from "rewards/components/RewardCardButton"
import { GuildPlatform, PlatformType } from "types"
import usePlatformAccessButton from "./usePlatformAccessButton"

type Props = {
  platform: GuildPlatform
}

const PlatformAccessButton = ({ platform }: Props) => {
  const { label, ...buttonProps } = usePlatformAccessButton(platform)
  const { colorScheme, icon } = rewards[PlatformType[platform.platformId]]

  return (
    <RewardCardButton
      {...buttonProps}
      leftIcon={!buttonProps.href && <Icon as={icon} />}
      rightIcon={buttonProps.href && <ArrowSquareOut />}
      colorScheme={colorScheme}
    >
      {label}
    </RewardCardButton>
  )
}

export default PlatformAccessButton
