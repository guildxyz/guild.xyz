import { Text } from "@chakra-ui/react"
import { RequirementFormProps } from "requirements"
import MinMaxAmountFormControls from "requirements/Github/components/MinMaxAmountFormControls"

const CovalentFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => (
  <>
    <Text colorScheme="gray" fontSize="sm" mt={-2} pl={3}>
      A wallet's age is determined by the time of its first transaction.
    </Text>

    <MinMaxAmountFormControls
      baseFieldPath={baseFieldPath}
      minAmountLabel="Wallet created after (date)"
      maxAmountLabel="Wallet created before (date)"
    />
  </>
)

export default CovalentFirstTx
