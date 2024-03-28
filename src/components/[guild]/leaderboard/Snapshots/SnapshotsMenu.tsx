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
import ViewSnapshotsModal from "./ViewSnapshotsModal"

const SnapshotsMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { textColor, buttonColorScheme } = useThemeContext()

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
