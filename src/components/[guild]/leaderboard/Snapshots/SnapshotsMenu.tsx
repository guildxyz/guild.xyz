import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { DotsThreeVertical, ListDashes, Plus } from "phosphor-react"
import ViewSnapshotsModal from "./ViewSnapshotsModal"

const SnapshotsMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
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
          <MenuItem icon={<ListDashes />} onClick={onOpen}>
            View snapshots
          </MenuItem>
        </MenuList>
      </Menu>

      <ViewSnapshotsModal onClose={onClose} isOpen={isOpen} />
    </>
  )
}

export default SnapshotsMenu
