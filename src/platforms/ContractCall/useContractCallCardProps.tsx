import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import EditRolePlatformCapacityTime from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTime"
import { GuildPlatform, PlatformName } from "types"

const useContractCallCardProps = (guildPlatform: GuildPlatform) => {
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const { data } = useNftDetails(chain, contractAddress)

  return {
    type: "CONTRACT_CALL" as PlatformName,
    name: data?.name || guildPlatform.platformGuildData?.name,
    image: data?.image || guildPlatform.platformGuildData?.imageUrl,
    info: data?.description,
    EditRolePlatformRow: EditRolePlatformCapacityTime,
  }
}

export default useContractCallCardProps
