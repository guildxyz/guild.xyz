import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useNftBalance from "hooks/useNftBalance"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { Chains } from "wagmiConfig/chains"

const useContractCallCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const { roles } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { chain, contractAddress } = guildPlatform.platformGuildData
  const { name, image } = useNftDetails(chain, contractAddress)

  const { data: nftBalance } = useNftBalance({
    nftAddress: contractAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = nftBalance > 0

  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  return {
    type: "CONTRACT_CALL" as PlatformName,
    name: name || guildPlatform.platformGuildData?.name,
    image: image || guildPlatform.platformGuildData?.imageUrl,
    info: rolePlatform && <AvailabilityTags rolePlatform={rolePlatform} mt={1} />,
    shouldHide: !isAdmin && alreadyCollected,
  }
}

export default useContractCallCardProps
