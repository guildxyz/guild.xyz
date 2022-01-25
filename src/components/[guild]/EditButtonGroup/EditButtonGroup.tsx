import { Icon, IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { PencilSimple } from "phosphor-react"
import AddRoleButton from "./components/AddRoleButton"
import CustomizationButton from "./components/CustomizationButton"
import EditGuildButton from "./components/EditGuildButton"

const EditButtonGroup = (): JSX.Element => {
  const guild = useGuild()

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Settings"
        minW={"44px"}
        rounded="2xl"
        colorScheme="alpha"
      >
        <Icon width="1em" height="1em" as={PencilSimple} />
      </MenuButton>
      <MenuList border="none" shadow="md">
        <EditGuildButton />
        <CustomizationButton />
        {guild?.platforms?.[0]?.platformType !== "DISCORD" && <AddRoleButton />}
      </MenuList>
    </Menu>
  )
}

export default EditButtonGroup
