import CollectNft from "components/[guild]/Requirements/components/GuildCheckout/CollectNft"
import { CollectNftProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/CollectNftContext"
import { GuildCheckoutProvider } from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import useMemberships from "components/explorer/hooks/useMemberships"
import { GuildPlatform } from "types"

type Props = {
  platform: GuildPlatform
}

const ContractCallRewardCardButton = ({ platform }: Props) => {
  const { id, urlName, roles } = useGuild()
  const { chain, contractAddress } = platform.platformGuildData

  const role = roles.find((r) =>
    r.rolePlatforms?.find((rp) => rp.guildPlatformId === platform.id)
  )
  const rolePlatformId = role?.rolePlatforms?.find(
    (rp) => rp.guildPlatformId === platform.id
  )?.id

  const { data: roleAccess } = useAccess(role?.id)
  const hasAccessToRole = roleAccess?.access

  const { memberships } = useMemberships()
  const isMemberOfRole = !!memberships
    ?.find((membership) => membership.guildId === id)
    ?.roleIds.find((roleId) => roleId === role?.id)

  const isEligible = hasAccessToRole || isMemberOfRole

  if (!isEligible)
    return (
      <LinkButton
        colorScheme="cyan"
        href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
      >
        Collect NFT
      </LinkButton>
    )

  return (
    <GuildCheckoutProvider>
      <CollectNftProvider
        roleId={role?.id}
        rolePlatformId={rolePlatformId}
        guildPlatform={platform}
        chain={platform.platformGuildData.chain}
        address={platform.platformGuildData.contractAddress}
      >
        <CollectNft />
      </CollectNftProvider>
    </GuildCheckoutProvider>
  )
}

export default ContractCallRewardCardButton
