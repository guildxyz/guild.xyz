import { Icon } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { Coins } from "phosphor-react"

const PaymentRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={<Icon as={Coins} boxSize={6} />}
      {...props}
    >
      <>
        {"Pay "}
        <DataBlock isLoading={false} error={undefined}>
          1.8 USDC
        </DataBlock>
        {` (vault: #${requirement?.data?.id})`}
      </>
    </Requirement>
  )
}

export default PaymentRequirement
