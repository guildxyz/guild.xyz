import { Button, Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { DotsThreeVertical, ListDashes, Plus } from "phosphor-react"

const SnapshotsMenu = () => {
  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        data-test="add-reward-button"
        onClick={() => {}}
        variant="ghost"
        size="sm"
        lineHeight={0}
      >
        <Icon as={DotsThreeVertical} boxSize={5} />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<Plus />}>Create snapshot</MenuItem>
        <MenuItem icon={<ListDashes />}>View snapshots</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default SnapshotsMenu
