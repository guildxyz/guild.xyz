import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormState, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  minAmountLabel: string
  maxAmountLabel: string
}

const MinMaxAmountFormControls = ({
  baseFieldPath,
  minAmountLabel,
  maxAmountLabel,
}: Props): JSX.Element => {
  const { errors } = useFormState()

  const minAmount = useWatch({ name: `${baseFieldPath}.data.minAmount` })
  const maxAmount = useWatch({ name: `${baseFieldPath}.data.maxAmount` })

  return (
    <>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>{minAmountLabel}</FormLabel>
        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.minAmount`}
          max={
            maxAmount
              ? new Date(maxAmount).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
      >
        <FormLabel>{maxAmountLabel}</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.maxAmount`}
          min={new Date(minAmount || null).toISOString().split("T")[0]}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default MinMaxAmountFormControls
