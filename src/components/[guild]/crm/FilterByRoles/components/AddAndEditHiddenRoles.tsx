import {
  ButtonGroup,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkMenuItem from "components/common/LinkMenuItem"
import { CaretDown, PencilSimple } from "phosphor-react"
import AddHiddenRoleButton from "./AddHiddenRoleButton"

const AddAndEditHiddenRoles = () => {
  const { urlName } = useGuild()

  return (
    // not setting size and variant here, because the buttons inside AddHiddenRoleModal inherited them too
    <ButtonGroup isAttached>
      <AddHiddenRoleButton borderRadius="lg" size="xs" variant="ghost" />
      <Divider orientation="vertical" h="6" />
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          icon={<CaretDown />}
          borderRadius="lg"
          size="xs"
          variant="ghost"
        ></MenuButton>
        <MenuList>
          <LinkMenuItem href={`/${urlName}#hiddenRoles`} icon={<PencilSimple />}>
            Edit hidden roles
          </LinkMenuItem>
        </MenuList>
      </Menu>
    </ButtonGroup>
  )
}

export default AddAndEditHiddenRoles
