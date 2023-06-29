import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { GuildPlatform, PlatformName } from "types"

const useContractCallCardProps = (guildPlatform: GuildPlatform) => {
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const { data } = useNftDetails(chain, contractAddress)

  return {
    type: "CONTRACT_CALL" as PlatformName,
    name: data?.name || "",
    image: data?.image || "",
    info: data?.description,
  }
}

export default useContractCallCardProps
