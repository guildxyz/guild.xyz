import { Text } from "@chakra-ui/react"
import PoapReward from "components/[guild]/CreatePoap/components/PoapReward"
import NoReward from "components/[guild]/Requirements/components/GuildCheckout/components/NoReward"
import TransactionStatusModal from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Reward from "components/[guild]/RoleCard/components/Reward"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePoap } from "requirements/Poap/hooks/usePoaps"

const PaymentTransactionStatusModal = () => {
  const { name, roleId, poapId } = useRequirementContext()
  const { roles, poaps } = useGuild()
  const role = roles?.find((r) => r.id === roleId)

  // temporary until POAPs are real roles
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapId)
  const { poap } = usePoap(guildPoap?.fancyId)

  return (
    <TransactionStatusModal
      title={`Buy ${name} pass`}
      progressComponent={
        <>
          <Text fontWeight={"bold"} mb="2">
            Unlocking rewards...
          </Text>
          {poap ? (
            <PoapReward poap={poap} />
          ) : (
            role?.rolePlatforms?.map((platform) => (
              <Reward
                key={platform.guildPlatformId}
                platform={platform}
                role={role}
                withLink
              />
            )) || <NoReward />
          )}
        </>
      }
      successComponent={
        <>
          <Text fontWeight={"bold"} mb="2">
            Unlocked rewards:
          </Text>
          {poap ? (
            <PoapReward poap={poap} isLinkColorful={true} />
          ) : (
            role?.rolePlatforms?.map((platform) => (
              <Reward
                key={platform.guildPlatformId}
                platform={platform}
                role={role}
                withLink
                isLinkColorful
              />
            )) || <NoReward />
          )}
        </>
      }
      errorComponent={<Text mb={4}>{`Couldn't buy pass`}</Text>}
    />
  )
}

export default PaymentTransactionStatusModal
