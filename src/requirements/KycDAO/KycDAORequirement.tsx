import { Text } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import BlockExplorerUrl from "../../components/[guild]/Requirements/components/BlockExplorerUrl"
import useKycDAOContracts from "./hooks/useKycDAOContracts"

const KycDAORequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { isLoading, kycDAOContracts, error } = useKycDAOContracts()

  const contractData = kycDAOContracts?.find(
    (c) => c.value?.toLowerCase() === requirement.address.toLowerCase()
  )

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={
        <Text as="span" fontWeight="bold" fontSize="xx-small">
          KYC
        </Text>
      }
      footer={!error && <BlockExplorerUrl />}
      {...props}
    >
      <Text as="span">{`Get verified as `}</Text>
      <DataBlock
        isLoading={isLoading}
        error={error && "API error, pleaase contact KycDAO to report."}
      >
        {contractData?.label || requirement.address}
      </DataBlock>
    </Requirement>
  )
}

export default KycDAORequirement
