import { Box, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import RadioSelect from "components/common/RadioSelect"
import Section from "components/common/Section"
import Guard from "components/[guild]/EditGuild/components/Guard"
import useGuild from "components/[guild]/hooks/useGuild"
import { useController, useFormState, useWatch } from "react-hook-form"
import ChannelsToGate from "../../RolesByPlatform/components/RoleListItem/components/EditRole/components/ChannelsToGate"
import ExistingRoleIcon from "./ExistingRoleIcon"
import ExistingRoleSettings from "./ExistingRoleSettings"
import NewRoleIcon from "./NewRoleIcon"

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

const DiscordSettings = () => {
  const { errors } = useFormState()
  const { guildPlatforms } = useGuild()

  const { field } = useController({
    name: "roleType",
  })
  const discordRoleId = useWatch({ name: "discordRoleId" })

  return (
    <Section title={"Discord settings"} spacing="6">
      <FormControl isInvalid={!!errors?.platform}>
        <FormLabel>Role to manage</FormLabel>
        <RadioSelect
          options={roleOptions}
          colorScheme="DISCORD"
          name="roleType"
          onChange={field.onChange}
          value={field.value}
        />
        <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
      </FormControl>
      <Box>
        <ChannelsToGate roleId={field.value === "NEW" ? undefined : discordRoleId} />
      </Box>

      <Guard
        isOn={false}
        isDisabled={!guildPlatforms?.[0]?.platformGuildData?.inviteChannel}
      />
    </Section>
  )
}

export default DiscordSettings
