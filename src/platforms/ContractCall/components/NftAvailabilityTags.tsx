import { Wrap, WrapProps } from "@chakra-ui/react"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import AvailabilityTags, {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { PropsWithChildren } from "react"
import { GuildPlatform, RolePlatform } from "types"

type Props = {
  guildPlatform: GuildPlatform
  rolePlatform: Omit<RolePlatform, "id" | "guildPlatform">
} & WrapProps

const NftAvailabilityTags = ({
  guildPlatform,
  rolePlatform,
  children,
  ...wrapProps
}: PropsWithChildren<Props>) => {
  const { maxSupply, totalSupply } = useNftDetails(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.contractAddress
  )

  if (
    guildPlatform.platformGuildData.function ===
    ContractCallFunction.DEPRECATED_SIMPLE_CLAIM
  )
    return <AvailabilityTags rolePlatform={rolePlatform} {...wrapProps} />

  return (
    <Wrap spacing={1} {...wrapProps}>
      {!!maxSupply && typeof totalSupply === "bigint" && (
        <CapacityTag
          capacity={Number(maxSupply)}
          claimedCount={Number(totalSupply)}
        />
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
