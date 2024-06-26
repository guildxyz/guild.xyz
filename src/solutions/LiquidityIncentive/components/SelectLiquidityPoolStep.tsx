import { Input, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useFormContext, useWatch } from "react-hook-form"

let renderCount = 0

const SelectLiquidityPoolStep = ({ onContinue }: { onContinue: () => void }) => {
  const methods = useFormContext()

  const { register, control } = methods

  const wat = useWatch({ name: "wat", control })
  console.log(wat)

  const na = useWatch({ name: "na", control })
  console.log(na)

  console.log(renderCount++)

  return (
    <Stack gap={5}>
      <Text colorScheme="gray">
        Set the token you want to distribute as a reward.
      </Text>

      <Input {...register("na")} />

      <Button onClick={onContinue}>Continue</Button>
    </Stack>
  )
}

export default SelectLiquidityPoolStep
