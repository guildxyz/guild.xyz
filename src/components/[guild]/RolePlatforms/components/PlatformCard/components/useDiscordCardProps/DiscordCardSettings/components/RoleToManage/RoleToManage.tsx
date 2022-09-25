import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import RadioSelect from "components/common/RadioSelect"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { useController, useFormContext, useFormState } from "react-hook-form"
import ExistingRoleIcon from "./components/ExistingRoleIcon"
import ExistingRoleSettings from "./components/ExistingRoleSettings"
import NewRoleIcon from "./components/NewRoleIcon"

const roleOptions = [
  {
    value: "NEW",
    title: "Create a new Discord role for me",
    icon: NewRoleIcon,
  },
  {
    value: "EXISTING",
    title: "Guildify an already existing role on my server",
    icon: ExistingRoleIcon,
    children: <ExistingRoleSettings />,
  },
]

const RoleToManage = () => {
  const { errors } = useFormState()
  const { setValue } = useFormContext()
  const { index } = useRolePlatform()

  const { field } = useController({
    name: "roleType",
  })

  const handleChange = (value) => {
    field.onChange(value)
    if (value === "NEW") setValue(`rolePlatforms.${index}.platformRoleId`, null)
  }

  return (
    <FormControl isInvalid={!!errors?.platform}>
      <FormLabel>Role to manage</FormLabel>
      <RadioSelect
        options={roleOptions}
        colorScheme="DISCORD"
        name="roleType"
        onChange={handleChange}
        value={field.value}
      />
      <FormErrorMessage>{errors?.platform?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default RoleToManage
