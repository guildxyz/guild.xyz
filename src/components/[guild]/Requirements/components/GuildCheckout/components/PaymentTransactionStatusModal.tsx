import { Text } from "@chakra-ui/react"
import NoReward from "components/[guild]/Requirements/components/GuildCheckout/components/NoReward"
import TransactionStatusModal from "components/[guild]/Requirements/components/GuildCheckout/components/TransactionStatusModal"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Reward from "components/[guild]/RoleCard/components/Reward"
import useGuild from "components/[guild]/hooks/useGuild"

const PaymentTransactionStatusModal = () => {
  const { name, roleId } = useRequirementContext()
  const { roles } = useGuild()
  const role = roles?.find((r) => r.id === roleId)

  return (
    <TransactionStatusModal
      title={`Buy ${name} pass`}
      progressComponent={
        <>
          <Text fontWeight={"bold"} mb="2">
            Unlocking rewards...
          </Text>
          {role?.rolePlatforms?.map((platform) => (
            <Reward
              key={platform.guildPlatformId}
              platform={platform}
              role={role}
              withLink
            />
          )) || <NoReward />}
        </>
      }
      successComponent={
        <>
          <Text fontWeight={"bold"} mb="2">
            Unlocked rewards:
          </Text>
          {role?.rolePlatforms?.map((platform) => (
            <Reward
              key={platform.guildPlatformId}
              platform={platform}
              role={role}
              withLink
              isLinkColorful
            />
          )) || <NoReward />}
        </>
      }
      errorComponent={<Text mb={4}>{`Couldn't buy pass`}</Text>}
    />
  )
}

export default PaymentTransactionStatusModal
