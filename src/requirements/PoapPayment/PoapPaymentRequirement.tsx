import { Icon, Skeleton, Text, Tooltip } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import Button from "components/common/Button"
import Withdraw from "components/[guild]/CreatePoap/components/PoapRoleCard/components/Withdraw"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Requirement from "components/[guild]/Requirements/components/Requirement"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { Coin, Coins } from "phosphor-react"
import { GuildPoap, PoapContract } from "types"

type Props = { poap: GuildPoap; poapContract: PoapContract }

const PoapPaymentRequirement = ({ poap, poapContract, ...props }: Props) => {
  const { id, vaultId, chainId } = poapContract

  const { isAdmin } = useGuildPermission()

  const { isVaultLoading, vaultData } = usePoapVault(vaultId, chainId)

  const {
    data: { symbol, decimals },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], vaultData?.token)

  return (
    <Requirement
      image={<Icon as={Coins} boxSize={6} />}
      footer={isAdmin && <Withdraw poapId={poap?.id} />}
      rightElement={
        <Tooltip label="Soon" shouldWrapChildren>
          <Button
            colorScheme="blue"
            size="sm"
            leftIcon={<Coin />}
            borderRadius="lg"
            isDisabled
          >
            Pay
          </Button>
        </Tooltip>
      }
      {...props}
    >
      <Skeleton as="span" isLoaded={!isVaultLoading && !isTokenDataLoading}>
        <Text as="span">{`Pay ${formatUnits(
          vaultData?.fee ?? "0",
          decimals ?? 18
        )} ${symbol ?? RPC[Chains[chainId]]?.nativeCurrency?.symbol} on ${
          RPC[Chains[chainId]]?.chainName
        }`}</Text>
      </Skeleton>
    </Requirement>
  )
}

export default PoapPaymentRequirement
