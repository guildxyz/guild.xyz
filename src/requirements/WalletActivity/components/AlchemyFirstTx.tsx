import { Stack, Text, useColorModeValue } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const borderColor = useColorModeValue("gray.200", "gray.600")

  const [minAmount, maxAmount] = useWatch({
    name: [
      `${baseFieldPath}.data.timestamps.minAmount`,
      `${baseFieldPath}.data.timestamps.maxAmount`,
    ],
  })

  const [addTimeframe, setAddTimeframe] = useState(minAmount || maxAmount)

  const { setValue } = useFormContext()

  useEffect(() => {
    if (!addTimeframe) {
      setValue(`${baseFieldPath}.data.timestamps.minAmount`, undefined)
      setValue(`${baseFieldPath}.data.timestamps.maxAmount`, undefined)
    }
  }, [addTimeframe])

  return (
    <>
      <Text colorScheme="gray" fontSize="sm" mt={-2} pl={3}>
        A wallet's age is determined by the time of its first transaction.
      </Text>
      <Stack
        borderRadius="lg"
        border="1px"
        p={3}
        borderColor={borderColor}
        w={"full"}
      >
        <Switch
          isChecked={addTimeframe}
          title="Apply timeframe"
          onChange={() => setAddTimeframe(!addTimeframe)}
        />
        {addTimeframe ? (
          <>
            <BlockNumberFormControl
              baseFieldPath={baseFieldPath}
              dataFieldName="minAmount"
              label="Wallet created later than (date)"
              formHelperText="The date of the wallet's first transaction"
              isInvalid={minAmount >= maxAmount}
              invalidText="You cannot set the start time to be after the end time!"
            />
            <BlockNumberFormControl
              baseFieldPath={baseFieldPath}
              dataFieldName="maxAmount"
              label="Wallet created earlier than (date)"
              formHelperText="The date of the wallet's first transaction"
              isInvalid={minAmount >= maxAmount}
              invalidText="You cannot set the end time to be before the start time!"
            />
          </>
        ) : (
          <>
            <Text colorScheme="gray" fontSize="sm">
              If no timeframe is set, only wallets with at least one transaction are
              allowed.
            </Text>
          </>
        )}
      </Stack>
    </>
  )
}

export default AlchemyFirstTx
