import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ControlledRelativeTimeInput } from "components/common/RelativeTimeInput"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormState, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  minAmountLabel?: string
  maxAmountLabel?: string
  type?: string
  timestamp?: boolean
}

const MinMaxAmountFormControls = ({
  baseFieldPath,
  minAmountLabel = "From",
  maxAmountLabel = "To",
  type = "ABSOLUTE",
  timestamp = true,
}: Props): JSX.Element => {
  const { errors } = useFormState()

  const minAmount = useWatch({
    name: `${baseFieldPath}.data.${timestamp ? "timestamps." : ""}minAmount`,
  })
  const maxAmount = useWatch({
    name: `${baseFieldPath}.data.${timestamp ? "timestamps." : ""}maxAmount`,
  })

  return (
    <>
      <FormControl
        isInvalid={
          timestamp
            ? !!parseFromObject(errors, baseFieldPath)?.data?.timestamps?.minAmount
            : !!parseFromObject(errors, baseFieldPath)?.data?.minAmount
        }
      >
        <FormLabel>{minAmountLabel}</FormLabel>
        {type === "ABSOLUTE" ? (
          <ControlledTimestampInput
            fieldName={`${baseFieldPath}.data.${
              timestamp ? "timestamps." : ""
            }minAmount`}
            max={
              maxAmount
                ? new Date(maxAmount).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
          />
        ) : (
          <ControlledRelativeTimeInput
            fieldName={`${baseFieldPath}.data.${
              timestamp ? "timestamps." : ""
            }minAmount`}
            min={maxAmount}
          />
        )}
        <FormErrorMessage>
          {timestamp
            ? parseFromObject(errors, baseFieldPath).data?.timestamps?.minAmount
                ?.message
            : parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={
          timestamp
            ? !!parseFromObject(errors, baseFieldPath)?.data?.timestamps?.maxAmount
            : !!parseFromObject(errors, baseFieldPath)?.data?.maxAmount
        }
      >
        <FormLabel>{maxAmountLabel}</FormLabel>

        {type === "ABSOLUTE" ? (
          <ControlledTimestampInput
            fieldName={`${baseFieldPath}.data.${
              timestamp ? "timestamps." : ""
            }maxAmount`}
            min={new Date(minAmount || null).toISOString().split("T")[0]}
          />
        ) : (
          <ControlledRelativeTimeInput
            fieldName={`${baseFieldPath}.data.${
              timestamp ? "timestamps." : ""
            }maxAmount`}
            max={minAmount}
          />
        )}

        <FormErrorMessage>
          {timestamp
            ? parseFromObject(errors, baseFieldPath).data?.timestamps?.maxAmount
                ?.message
            : parseFromObject(errors, baseFieldPath).data?.maxAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default MinMaxAmountFormControls
