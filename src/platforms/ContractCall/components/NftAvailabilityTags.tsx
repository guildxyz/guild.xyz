import { Wrap, WrapProps } from "@chakra-ui/react"
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { PropsWithChildren } from "react"
import { GuildPlatform, RolePlatform } from "types"

type Props = { guildPlatform: GuildPlatform; rolePlatform: RolePlatform } & WrapProps

const NftAvailabilityTags = ({
  guildPlatform,
  rolePlatform,
  children,
  ...wrapProps
}: PropsWithChildren<Props>) => {
  const { maxSupply, totalCollectors } = useNftDetails(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.contractAddress
  )

  return (
    <Wrap spacing={1} {...wrapProps}>
      {!!maxSupply && typeof totalCollectors === "number" && (
        <CapacityTag capacity={maxSupply} claimedCount={totalCollectors} />
      )}

      {rolePlatform?.startTime && (
        <StartTimeTag startTime={rolePlatform.startTime} />
      )}

      {rolePlatform?.endTime && <EndTimeTag endTime={rolePlatform.endTime} />}

      {children}
    </Wrap>
  )
}

export default NftAvailabilityTags
