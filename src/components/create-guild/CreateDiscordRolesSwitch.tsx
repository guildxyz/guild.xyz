import { FormControl } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useCreateGuildContext } from "./CreateGuildContext"

const CreateDiscordRolesSwitch = (): JSX.Element => {
  const { createDiscordRoles, setCreateDiscordRoles } = useCreateGuildContext()

  return (
    <FormControl pt={{ base: 0, md: 4, lg: 6 }} maxW="max-content">
      <Switch
        colorScheme="DISCORD"
        title="Create roles on Discord"
        isChecked={createDiscordRoles}
        onChange={(e) => setCreateDiscordRoles(e.target.checked)}
      />
    </FormControl>
  )
}

export default CreateDiscordRolesSwitch
