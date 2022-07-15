import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import RadioSelect from "components/common/RadioSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { Lock, LockSimpleOpen } from "phosphor-react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import KeepAccessInfoText from "./components/KeepAccessInfoText"

const options = [
  {
    value: 0,
    title: "Authenticate existing members",
    description: "Ensure that no bots can stay in your server",
    icon: Lock,
  },
  {
    value: 1,
    title: "Keep access for existing members",
    description: "Only guard for bots joining after now",
    icon: LockSimpleOpen,
    children: <KeepAccessInfoText />,
  },
]

const PickSecurityLevel = (): JSX.Element => {
  const { guildPlatforms } = useGuild()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const rolePlatforms = useWatch({ name: "rolePlatforms" })
  const discordGuildPlatformId = guildPlatforms?.find(
    (p) => p.platformId === PlatformType.DISCORD
  )?.id
  const discordRolePlatformIndex = rolePlatforms
    .map((p) => p.guildPlatformId)
    .indexOf(discordGuildPlatformId)

  const { field } = useController({
    control,
    name: `rolePlatforms.${discordRolePlatformIndex}.platformRoleData.grantAccessToExistingUsers`,
  })

  return (
    <FormControl isRequired isInvalid={!!errors?.platform}>
      <FormLabel>Security level</FormLabel>
      <RadioSelect
        options={options}
        name={`rolePlatforms.${discordRolePlatformIndex}.platformRoleData.grantAccessToExistingUsers`}
        onChange={(newValue) => field.onChange(Boolean(+newValue))}
        value={+field.value}
        defaultValue={0}
        colorScheme="DISCORD"
      />

      <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default PickSecurityLevel
