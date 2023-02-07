import { FormControl, FormLabel, Stack, Textarea } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const UnlockForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    control,
    formState: { errors, touchedFields },
  } = useFormContext()

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Query:</FormLabel>

        <Controller
          control={control}
          name={`${baseFieldPath}.data.query` as const}
          render={({ field: { onChange, onBlur, value: textareaValue, ref } }) => (
            <Textarea
              ref={ref}
              resize="vertical"
              p={2}
              minH={64}
              className="custom-scrollbar"
              cols={42}
              wrap="off"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={textareaValue ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default UnlockForm
