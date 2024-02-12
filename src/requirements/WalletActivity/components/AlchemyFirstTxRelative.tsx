import { Text } from "@chakra-ui/react"
import { useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTxRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const [minAmount, maxAmount] = useWatch({
    name: [
      `${baseFieldPath}.data.timestamps.minAmount`,
      `${baseFieldPath}.data.timestamps.maxAmount`,
    ],
  })

  return (
    <>
      <Text colorScheme="gray" fontSize="sm" mt={-2} pl={3}>
        A wallet's age is determined by the time of its first transaction.
      </Text>
      <BlockNumberFormControl
        type="RELATIVE"
        baseFieldPath={baseFieldPath}
        dataFieldName="maxAmount"
        label="Wallet older than (period)"
        isInvalid={minAmount <= maxAmount}
        invalidText="You cannot set the minimum age to be larger than the maximum age!"
        formHelperText="The date of the wallet's first transaction"
      />
      <BlockNumberFormControl
        type="RELATIVE"
        baseFieldPath={baseFieldPath}
        dataFieldName="minAmount"
        label="Wallet younger than (period)"
        isInvalid={minAmount <= maxAmount}
        invalidText="You cannot set the maximum age to be smaller than the minimum age!"
        formHelperText="The date of the wallet's first transaction"
      />
    </>
  )
}

export default AlchemyFirstTxRelative
