import { HStack, Img, Text } from "@chakra-ui/react"
import useServerData from "hooks/useServerData"
import { Platform, PlatformType } from "types"

type Props = {
  platform: Platform
}

const PlatformDetails = ({ platform }: Props): JSX.Element => {
  const {
    data: { serverIcon },
  } = useServerData(
    platform.platformId === PlatformType.DISCORD ? platform.platformGuildId : null
  )

  return (
    <HStack>
      {serverIcon && (
        <Img
          boxSize={8}
          rounded="full"
          src={serverIcon}
          alt={platform.platformGuildName}
        />
      )}

      <Text as="span">{platform.platformGuildName}</Text>
    </HStack>
  )
}

export default PlatformDetails
