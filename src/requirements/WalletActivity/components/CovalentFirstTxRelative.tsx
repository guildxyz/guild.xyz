import { Text } from "@chakra-ui/react"
import RelativeMinMaxTimeFormControls from "components/common/RelativeMinMaxTimeFormControls"
import { RequirementFormProps } from "requirements"

const CovalentFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <Text colorScheme="gray" fontSize="sm" mt={-2}>
      A wallet's age is determined by the time of its first transaction
    </Text>
    <RelativeMinMaxTimeFormControls
      minTimeFieldName={`${baseFieldPath}.data.timestamps.minAmount`}
      maxTimeFieldName={`${baseFieldPath}.data.timestamps.maxAmount`}
      minTimeLabel="Wallet younger than"
      maxTimeLabel="Wallet older than"
    />
  </>
)

export default CovalentFirstTxRelative
