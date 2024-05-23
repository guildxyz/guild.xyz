import {
  ButtonGroup,
  // Divider,
  // IconButton,
  // Menu,
  // MenuButton,
  // MenuItem,
  // MenuList,
  // Portal,
  useDisclosure,
} from "@chakra-ui/react"
import { Table } from "@tanstack/react-table"
import Button from "components/common/Button"
import { /* CaretDown, */ Export, Sliders } from "phosphor-react"
import { useIsTabsStuck } from "../Tabs/Tabs"
import CustomizeViewModal from "./CustomizeViewModal"
import ExportMembersModal from "./ExportMembersModal"
import { Member } from "./useMembers"

type Props = {
  table: Table<Member>
}

/**
 * CustomizeViewModal related stuff is disabled yet, we'll release it together with
 * the 'add roles as columns' feature
 */

const CrmMenu = ({ table }: Props) => {
  const { isStuck } = useIsTabsStuck()
  const {
    isOpen: isCustomizeOpen,
    onOpen: onCustomizeOpen,
    onClose: onCustomizeClose,
  } = useDisclosure()
  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure()

  const exportButtonProps = {
    onClick: onExportOpen,
    leftIcon: <Export />,
    icon: <Export />,
    children: `Export members`,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const customizeButtonProps = {
    leftIcon: <Sliders />,
    icon: <Sliders />,
    onClick: onCustomizeOpen,
    children: "Customize view",
  }

  return (
    <>
      <ButtonGroup isAttached size="sm" variant="ghost">
        <Button
          flexShrink={0}
          colorScheme={isStuck ? "gray" : "whiteAlpha"}
          // borderRightRadius={0}
          {
            /* isExportDisabled ? customizeButtonProps :  */ ...exportButtonProps
          }
        />
        {/* <Divider orientation="vertical" h="8" />
        <Menu placement="bottom-end" strategy="fixed">
          <MenuButton
            as={IconButton}
            icon={<CaretDown />}
            colorScheme={isStuck ? "gray" : "whiteAlpha"}
            borderTopLeftRadius="0"
            borderBottomLeftRadius="0"
          ></MenuButton>
          <Portal>
            <MenuList zIndex="popover">
              <MenuItem
                {...(isExportDisabled ? exportButtonProps : customizeButtonProps)}
              />
            </MenuList>
          </Portal>
        </Menu> */}
      </ButtonGroup>
      <CustomizeViewModal
        isOpen={isCustomizeOpen}
        onClose={onCustomizeClose}
        table={table}
      />
      <ExportMembersModal isOpen={isExportOpen} onClose={onExportClose} />
    </>
  )
}

export default CrmMenu
