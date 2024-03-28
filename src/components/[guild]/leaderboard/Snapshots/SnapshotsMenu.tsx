import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { DotsThreeVertical, ListDashes, Plus } from "phosphor-react"
import CreateSnapshotModal from "./CreateSnapshotModal"
import ViewSnapshotsModal from "./ViewSnapshotsModal"

const SnapshotsMenu = () => {
  const {
    isOpen: viewIsOpen,
    onOpen: viewOnOpen,
    onClose: viewOnClose,
  } = useDisclosure()
  const { textColor, buttonColorScheme } = useThemeContext()

  const {
    isOpen: createIsOpen,
    onOpen: createOnOpen,
    onClose: createOnClose,
  } = useDisclosure()

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
          textAlign={"center"}
          justifyContent={"center"}
          sx={{ "*": { justifyContent: "center", display: "flex" } }}
          color={textColor}
          colorScheme={buttonColorScheme}
        >
          <Icon
            as={DotsThreeVertical}
            boxSize={5}
            display={"flex"}
            justifyContent={"center"}
          />
        </MenuButton>
        <MenuList>
          <MenuItem icon={<Plus />} onClick={createOnOpen}>
            Create snapshot
          </MenuItem>
          <MenuItem icon={<ListDashes />} onClick={viewOnOpen}>
            View snapshots
          </MenuItem>
        </MenuList>
      </Menu>

      <ViewSnapshotsModal
        onClose={viewOnClose}
        isOpen={viewIsOpen}
        onCreate={() => {
          viewOnClose()
          setTimeout(createOnOpen, 100)
        }}
      />
      <CreateSnapshotModal onClose={createOnClose} isOpen={createIsOpen} />
    </>
  )
}

export default SnapshotsMenu
