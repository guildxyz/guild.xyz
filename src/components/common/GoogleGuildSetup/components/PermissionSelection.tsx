import { FormControl, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

// const googleRoles: Array<"reader" | "commenter" | "writer"> = [
//   "reader",
//   "commenter",
//   "writer",
// ]

type Props = {
  fieldName: string
  mimeType: string
}

const PermissionSelection = ({ fieldName, mimeType }: Props) => {
  const { control } = useFormContext()
  // const rolePlatform = useRolePlatform()

  // const roleIndex = googleRoles.findIndex(
  //   (googleRole) => googleRole === platformRoleData.role
  // )
  // const disabledRoles = googleRoles.filter((_, i) => i > roleIndex)

  return (
    <FormControl>
      <FormLabel>Access type</FormLabel>
      <Controller
        name={fieldName}
        control={control}
        defaultValue="reader"
        render={({ field: { onChange, value, ref } }) => (
          <RadioGroup ref={ref} onChange={onChange} value={value}>
            <Stack>
              <Radio value="reader" /* isDisabled={!!rolePlatform} */>Reader</Radio>
              {mimeType !== "application/vnd.google-apps.folder" && (
                <Radio value="commenter" /* isDisabled={!!rolePlatform} */>
                  Commenter
                </Radio>
              )}
              <Radio value="writer" /* isDisabled={!!rolePlatform} */>Writer</Radio>
            </Stack>
          </RadioGroup>
        )}
      />
    </FormControl>
  )
}

export default PermissionSelection
