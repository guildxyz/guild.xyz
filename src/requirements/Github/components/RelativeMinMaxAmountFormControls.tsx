import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ControlledRelativeTimeInput } from "components/common/RelativeTimeInput"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  minAmountLabel: string
  maxAmountLabel: string
}

const RelativeMinMaxAmountFormControls = ({
  baseFieldPath,
  minAmountLabel,
  maxAmountLabel,
}: Props): JSX.Element => {
  const { errors } = useFormState()

  return (
    <>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>{minAmountLabel}</FormLabel>

        <ControlledRelativeTimeInput fieldName={`${baseFieldPath}.data.minAmount`} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.maxAmount}
      >
        <FormLabel>{maxAmountLabel}</FormLabel>

        <ControlledRelativeTimeInput fieldName={`${baseFieldPath}.data.maxAmount`} />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default RelativeMinMaxAmountFormControls
