import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import RadioSelect from "components/common/RadioSelect"
import { ShieldCheck, Sparkle } from "phosphor-react"
import { useController, useFormContext, useFormState } from "react-hook-form"
import GuildifyExistingRole from "./components/GuildifyExistingRole"

const roleOptions = [
  {
    value: "NEW",
    title: "Create a new Discord role for me",
    icon: Sparkle,
  },
  {
    value: "EXISTING",
    title: "Guildify an already existing role on my server",
    icon: ShieldCheck,
    children: <GuildifyExistingRole />,
  },
]

const DiscordCardSettings = (): JSX.Element => {
  const { errors } = useFormState()
  const { setValue } = useFormContext()
  const { index } = useRolePlatform()

  const { field } = useController({
    name: "roleType",
    defaultValue: "NEW",
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

export default DiscordCardSettings
