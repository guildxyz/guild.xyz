import {
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

type Props = {
  fieldName: string
  mimeType: string
}

const PermissionSelection = ({ fieldName, mimeType }: Props) => {
  const { control } = useFormContext()

  const isFolder = mimeType === "application/vnd.google-apps.folder"
  const isForm = mimeType === "application/vnd.google-apps.form"

  return (
    <Stack spacing={8}>
      <FormControl>
        <FormLabel>Access type</FormLabel>
        <Controller
          name={fieldName}
          control={control}
          defaultValue={isForm ? "writer" : "reader"}
          render={({ field: { onChange, value, ref } }) => (
            <RadioGroup ref={ref} onChange={onChange} value={value}>
              <Stack>
                {!isForm && <Radio value="reader">Reader</Radio>}
                {!isFolder && !isForm && <Radio value="commenter">Commenter</Radio>}
                <Radio value="writer">Writer</Radio>
              </Stack>
            </RadioGroup>
          )}
        />
      </FormControl>

      {isForm && (
        <Alert status="info">
          <AlertIcon />
          <Text>
            Users will get <b>editor access</b> to this Google Form. Anyone with a
            link will be able to submit responses.
          </Text>
        </Alert>
      )}
    </Stack>
  )
}

export default PermissionSelection
