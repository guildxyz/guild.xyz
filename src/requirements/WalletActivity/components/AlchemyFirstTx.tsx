import { Text } from "@chakra-ui/react"
import { useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
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
        baseFieldPath={baseFieldPath}
        dataFieldName="minAmount"
        label="Wallet created after (date)"
        formHelperText="The date of the wallet's first transaction"
        isInvalid={minAmount >= maxAmount}
        invalidText="You cannot set the start time to be after the end time!"
      />
      <BlockNumberFormControl
        baseFieldPath={baseFieldPath}
        dataFieldName="maxAmount"
        label="Wallet created before (date)"
        formHelperText="The date of the wallet's first transaction"
        isInvalid={minAmount >= maxAmount}
        invalidText="You cannot set the end time to be before the start time!"
      />
    </>
  )
}

export default AlchemyFirstTx
