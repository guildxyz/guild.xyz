import { FormControl, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

type Props = {
  fieldName: string
  mimeType: string
}

const PermissionSelection = ({ fieldName, mimeType }: Props) => {
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
              <Radio value="reader">Reader</Radio>
              {mimeType !== "application/vnd.google-apps.folder" && (
                <Radio value="commenter">Commenter</Radio>
              )}
              <Radio value="writer">Writer</Radio>
            </Stack>
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}

export default PermissionSelection
