import { Text } from "@chakra-ui/react"
import NoReward from "components/[guild]/Requirements/components/GuildCheckout/components/NoReward"
import TransactionStatusModal from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Reward from "components/[guild]/RoleCard/components/Reward"
import useGuild from "components/[guild]/hooks/useGuild"

const PaymentTransactionStatusModal = () => {
  const { name, roleId } = useRequirementContext()

  return (
    <TransactionStatusModal
      title={`Buy ${name} pass`}
      progressComponent={
        <>
          <Text fontWeight="bold" mb="2">
            Unlocking rewards...
          </Text>
          <UnlockingRewards roleId={roleId} />
        </>
      }
      successComponent={
        <>
          <Text fontWeight={"bold"} mb="2">
            Unlocked rewards:
          </Text>
          <UnlockingRewards roleId={roleId} />
        </>
      }
      errorComponent={<Text mb={4}>{`Couldn't buy pass`}</Text>}
    />
  )
}

export const UnlockingRewards = ({ roleId }: { roleId: number }) => {
  const { roles, guildPlatforms } = useGuild()
  const role = roles.find((r) => r.id === roleId)

  if (!role.rolePlatforms?.length) return <NoReward />

  return role.rolePlatforms.map((rp) => {
    const guildPlatform = guildPlatforms.find((gp) => gp.id === rp.guildPlatformId)

    return (
      <Reward
        key={rp.guildPlatformId}
        platform={{ ...rp, guildPlatform }}
        role={role}
        withLink
        isLinkColorful
      />
    )
  })
}

export default PaymentTransactionStatusModal
