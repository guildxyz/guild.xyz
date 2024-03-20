import { FormControl, FormLabel } from "@chakra-ui/react"
import { useFormState, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import FormErrorMessage from "./FormErrorMessage"
import { ControlledRelativeTimeInput } from "./RelativeTimeInput"

type Props = {
  minTimeFieldName: string
  maxTimeFieldName: string
  minTimeLabel?: string
  maxTimeLabel?: string
}

const RelativeMinMaxTimeFormControls = ({
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
        <ControlledRelativeTimeInput
          fieldName={minTimeFieldName}
          min={maxTime ? Math.max(maxTime, 0) : 0}
        />
        <FormErrorMessage>
          {parseFromObject(errors, minTimeFieldName)?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!parseFromObject(errors, maxTimeFieldName)}>
        <FormLabel>{maxTimeLabel}</FormLabel>
        <ControlledRelativeTimeInput
          fieldName={maxTimeFieldName}
          max={minTime ? minTime : undefined}
          min={0}
        />
        <FormErrorMessage>
          {parseFromObject(errors, maxTimeFieldName)?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default RelativeMinMaxTimeFormControls
