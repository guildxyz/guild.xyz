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
import useToast from "hooks/useToast"
import { /* CaretDown, */ Export, Sliders } from "phosphor-react"
import { useIsTabsStuck } from "../Tabs/Tabs"
import CustomizeViewModal from "./CustomizeViewModal"
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
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const selectedAddresses = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.addresses[0])

  const csvContent = encodeURI("data:text/csv;charset=utf-8," + selectedAddresses)

  const isExportDisabled = !(
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
  )

  const exportButtonProps = {
    as: "a",
    download: "members",
    href: !isExportDisabled ? csvContent : undefined,
    onClick: () =>
      // beeing disabled doesn't prevent onClick automatically, because of being an anchor instead of a button
      !isExportDisabled &&
      toast({
        status: "success",
        title: "Successful export",
        description: "Check your downloads folder",
        duration: 2000,
      }),
    leftIcon: <Export />,
    icon: <Export />,
    isDisabled: isExportDisabled,
    children: `Export ${selectedAddresses.length || ""} selected`,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const customizeButtonProps = {
    leftIcon: <Sliders />,
    icon: <Sliders />,
    onClick: onOpen,
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
      <CustomizeViewModal {...{ isOpen, onClose, table }} />
    </>
  )
}

export default CrmMenu
