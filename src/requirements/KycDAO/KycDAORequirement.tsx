import { Text } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import BlockExplorerUrl from "../common/BlockExplorerUrl"
import Requirement from "../common/Requirement"
import useKycDAOContracts from "./hooks/useKycDAOContracts"

const KycDAORequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => {
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
      footer={!error && <BlockExplorerUrl requirement={requirement} />}
      {...rest}
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
