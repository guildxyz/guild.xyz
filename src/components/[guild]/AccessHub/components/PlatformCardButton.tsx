import { Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import platforms from "platforms"
import { GuildPlatform, PlatformType } from "types"
import usePlatformAccessButton from "./usePlatformAccessButton"

type Props = {
  platform: GuildPlatform
}

const PlatformCardButton = ({ platform }: Props) => {
  const { label, ...buttonProps } = usePlatformAccessButton(platform)
  const { colorScheme, icon } = platforms[PlatformType[platform.platformId]]

  return (
    <Button
      {...buttonProps}
      leftIcon={!buttonProps.href && <Icon as={icon} />}
      rightIcon={buttonProps.href && <ArrowSquareOut />}
      colorScheme={colorScheme}
    >
      {label}
    </Button>
  )
}

export default PlatformCardButton
