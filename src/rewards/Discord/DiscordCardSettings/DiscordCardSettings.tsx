import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import { ShieldCheck, Sparkle } from "@phosphor-icons/react"
import RadioSelect from "components/common/RadioSelect"
import { useController, useFormContext, useFormState } from "react-hook-form"
import GuildifyExistingRole from "./components/GuildifyExistingRole"

const roleOptions = [
  {
    value: "NEW",
    defaultValue: "NEW",
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

  const { field } = useController({
    name: "roleType",
  })

  const handleChange = (value) => {
    field.onChange(value)
    if (value === "NEW") setValue("platformRoleId", "")
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
