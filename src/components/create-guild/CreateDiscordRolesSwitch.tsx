import { FormControl } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useCreateGuildContext } from "./CreateGuildContext"

const CreateDiscordRolesSwitch = (): JSX.Element => {
  const { createDiscordRoles, setCreateDiscordRoles } = useCreateGuildContext()

  return (
    <FormControl>
      <Switch
        colorScheme="DISCORD"
        title="Create equivalent roles on Discord"
        isChecked={createDiscordRoles}
        onChange={(e) => setCreateDiscordRoles(e.target.checked)}
      />
    </FormControl>
  )
}

export default CreateDiscordRolesSwitch
