import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { GuildPlatform, PlatformName } from "types"

const useContractCallCardProps = (guildPlatform: GuildPlatform) => {
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const { name, image, description } = useNftDetails(chain, contractAddress)

  return {
    type: "CONTRACT_CALL" as PlatformName,
    name: name || guildPlatform.platformGuildData?.name,
    image: image || guildPlatform.platformGuildData?.imageUrl,
    info: description,
  }
}

export default useContractCallCardProps
