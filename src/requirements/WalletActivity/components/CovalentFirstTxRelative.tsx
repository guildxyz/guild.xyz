import { Text } from "@chakra-ui/react"
import { RequirementFormProps } from "requirements"
import MinMaxAmountFormControls from "requirements/Github/components/MinMaxAmountFormControls"

const CovalentFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => (
  <>
    <Text colorScheme="gray" fontSize="sm" mt={-2} pl={3}>
      A wallet's age is determined by the time of its first transaction.
    </Text>
    <MinMaxAmountFormControls
      baseFieldPath={baseFieldPath}
      type="RELATIVE"
      minAmountLabel="Wallet younger than (period)"
      maxAmountLabel="Wallet older than (period)"
    />
  </>
)

export default CovalentFirstTxRelative
