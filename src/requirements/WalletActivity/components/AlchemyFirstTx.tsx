import { Stack, Text, useColorModeValue } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useState } from "react"
import { RequirementFormProps } from "requirements"
import BlockNumberFormControl from "./BlockNumberFormControl"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const [addTimeframe, setAddTimeframe] = useState(false)
  const borderColor = useColorModeValue("gray.200", "gray.600")

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
            />
            <BlockNumberFormControl
              baseFieldPath={baseFieldPath}
              dataFieldName="maxAmount"
              label="Wallet created earlier than (date)"
              formHelperText="The date of the wallet's first transaction"
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
