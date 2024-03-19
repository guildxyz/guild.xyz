import { FormControl, FormLabel } from "@chakra-ui/react"
import { useFormState, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import FormErrorMessage from "./FormErrorMessage"
import { ControlledTimestampInput } from "./TimestampInput"

type Props = {
  minTimeFieldName: string
  maxTimeFieldName: string
  minTimeLabel?: string
  maxTimeLabel?: string
}

const AbsoluteMinMaxTimeFormControls = ({
  minTimeFieldName,
  maxTimeFieldName,
  minTimeLabel = "From",
  maxTimeLabel = "To",
}: Props): JSX.Element => {
  const { errors } = useFormState()
  const [minTime, maxTime] = useWatch({ name: [minTimeFieldName, maxTimeFieldName] })

  return (
    <>
      <FormControl isInvalid={!!parseFromObject(errors, minTimeFieldName)}>
        <FormLabel>{minTimeLabel}</FormLabel>
        <ControlledTimestampInput
          fieldName={minTimeFieldName}
          max={
            maxTime
              ? new Date(maxTime).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
        />
        <FormErrorMessage>
          {parseFromObject(errors, minTimeFieldName)?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!parseFromObject(errors, maxTimeFieldName)}>
        <FormLabel>{maxTimeLabel}</FormLabel>
        <ControlledTimestampInput
          fieldName={maxTimeFieldName}
          min={new Date(minTime || null).toISOString().split("T")[0]}
        />
        <FormErrorMessage>
          {parseFromObject(errors, maxTimeFieldName)?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default AbsoluteMinMaxTimeFormControls
