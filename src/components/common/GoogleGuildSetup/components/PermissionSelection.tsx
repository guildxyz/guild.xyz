import { FormControl, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

type Props = {
  fieldName: string
  mimeType: string
  disabledRoles?: Array<"reader" | "commenter" | "writer">
}

const PermissionSelection = ({ fieldName, mimeType, disabledRoles = [] }: Props) => {
  const { control } = useFormContext()

  return (
    <FormControl>
      <FormLabel>Access type:</FormLabel>
      <Controller
        name={fieldName}
        control={control}
        defaultValue="reader"
        render={({ field: { onChange, value, ref } }) => (
          <RadioGroup ref={ref} onChange={onChange} value={value}>
            <Stack>
              <Radio value="reader" isDisabled={disabledRoles.includes("reader")}>
                {/* Maybe we don't want to have an isDisabled for reader */}
                Reader
              </Radio>
              {mimeType !== "application/vnd.google-apps.folder" && (
                <Radio
                  value="commenter"
                  isDisabled={disabledRoles.includes("commenter")}
                >
                  Commenter
                </Radio>
              )}
              <Radio value="writer" isDisabled={disabledRoles.includes("writer")}>
                Writer
              </Radio>
            </Stack>
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}

export default PermissionSelection
