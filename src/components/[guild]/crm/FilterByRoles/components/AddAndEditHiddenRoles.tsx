import {
  ButtonGroup,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Link from "next/link"
import { ArrowRight, CaretDown, PencilSimple } from "phosphor-react"
import { useState } from "react"
import AddHiddenRoleButton from "./AddHiddenRoleButton"

const AddAndEditHiddenRoles = () => {
  const { urlName } = useGuild()
  const [hasClickedEdit, setHasClickedEdit] = useState(false)

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
          <MenuItem
            onClick={() => setHasClickedEdit(true)}
            as={Link}
            href={`/${urlName}#hiddenRoles`}
            icon={hasClickedEdit ? <Spinner size="xs" /> : <PencilSimple />}
            command={(<ArrowRight />) as any}
            isDisabled={hasClickedEdit}
            closeOnSelect={false}
          >
            {hasClickedEdit ? "Redirecting" : "Edit hidden roles"}
          </MenuItem>
        </MenuList>
      </Menu>
    </ButtonGroup>
  )
}

export default AddAndEditHiddenRoles
