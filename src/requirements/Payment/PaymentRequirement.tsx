import { Icon } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useTokenData from "hooks/useTokenData"
import { Coins } from "phosphor-react"
import useVault from "./hooks/useVault"

const PaymentRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const {
    data,
    isValidating: isVaultLoading,
    error: vaultError,
  } = useVault(requirement.data.id, requirement.chain)

  const {
    data: { symbol, decimals },
    error: tokenError,
    isValidating: isTokenDataLoading,
  } = useTokenData(requirement.chain, data?.token)
  const convertedFee =
    data?.fee && decimals ? formatUnits(data.fee, decimals) : undefined

  return (
    <Requirement image={<Icon as={Coins} boxSize={6} />} {...props}>
      <>
        {"Pay "}
        <DataBlock
          isLoading={isVaultLoading || isTokenDataLoading}
          error={
            vaultError
              ? "Couldn't fetch vault"
              : tokenError
              ? "Couldn't fetch token info"
              : undefined
          }
        >
          {convertedFee && symbol ? `${convertedFee} ${symbol}` : "-"}
        </DataBlock>
      </>
    </Requirement>
  )
}

export default PaymentRequirement
