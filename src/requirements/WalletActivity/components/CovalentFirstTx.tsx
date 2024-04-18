import { Text } from "@chakra-ui/react"
import AbsoluteMinMaxTimeFormControls from "components/common/AbsoluteMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"

const CovalentFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <Text colorScheme="gray" fontSize="sm" mt={-2}>
      A wallet's age is determined by the time of its first transaction
    </Text>

    <AbsoluteMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
      minTimeLabel="Wallet created after"
      maxTimeLabel="Wallet created before"
    />
  </>
)

export default CovalentFirstTx
