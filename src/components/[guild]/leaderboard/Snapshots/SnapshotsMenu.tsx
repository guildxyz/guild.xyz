import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
} from "@chakra-ui/react"
import { useIsTabsStuck } from "components/[guild]/Tabs"
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
  const {
    isOpen: createIsOpen,
    onOpen: createOnOpen,
    onClose: createOnClose,
  } = useDisclosure()

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <>
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          icon={<DotsThreeVertical size="1.2em" />}
          data-test="add-reward-button"
          variant="ghost"
          size="sm"
          {...(!isStuck && {
            color: textColor,
            colorScheme: buttonColorScheme,
          })}
        />
        <Portal>
          <MenuList zIndex={9999}>
            <MenuItem icon={<Plus />} onClick={createOnOpen}>
              Create snapshot
            </MenuItem>
            <MenuItem icon={<ListDashes />} onClick={viewOnOpen}>
              View snapshots
            </MenuItem>
          </MenuList>
        </Portal>
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
