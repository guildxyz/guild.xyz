import { Box, FormControl, FormErrorMessage } from "@chakra-ui/react"
import Section from "components/common/Section"
import { useController, useFormState, useWatch } from "react-hook-form"
import ChannelsToGate from "../../RolesByPlatform/components/RoleListItem/components/EditRole/components/ChannelsToGate"
import ExistingRoleSettings from "./ExistingRoleSettings"

const roleOptions = [
  {
    value: "NEW",
    title: "Create a new role for me",
  },
  {
    value: "EXISTING",
    title: "Manage an existing role",
    children: <ExistingRoleSettings />,
  },
]

const DiscordSettings = () => {
  const { errors } = useFormState()

  const { field } = useController({
    name: "roleType",
  })
  const discordRoleId = useWatch({ name: "discordRoleId" })

  return (
    <Section title={"Discord settings"} spacing="6">
      <FormControl isRequired isInvalid={!!errors?.platform}>
        <ExistingRoleSettings />
        <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
      </FormControl>
      <Box>
        <ChannelsToGate roleId={field.value === "NEW" ? undefined : discordRoleId} />
      </Box>
    </Section>
  )
}

export default DiscordSettings
