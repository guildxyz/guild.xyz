import {
  Box,
  Checkbox,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Column, Table } from "@tanstack/react-table"
import { Modal } from "components/common/Modal"
import { Reorder } from "framer-motion"
import { DotsSixVertical } from "phosphor-react"
import { useState } from "react"
import { Member } from "./useMembers"

type Props = {
  isOpen: boolean
  onClose: () => void
  table: Table<Member>
}

const COLUMN_NAMES = {
  identity: "Identity",
  roles: "All roles",
  hiddenRoles: "Hidden roles",
  publicRoles: "Public roles",
  joinedAt: "Joined at",
}

const CustomizeViewModal = ({ isOpen, onClose, table }: Props) => {
  const columns = table.getAllColumns()
  const [localOrder, setLocalOrder] = useState(() => transformToLocalOrder(table))

  const setTableOrder = () => {
    const newOrder = transformToTableOrder(localOrder)
    /**
     * Waiting for the animation to finish so the rerender doesn't cause a visible
     * freeze (onAnimationComplete doesn't work on Reorder.Item)
     */
    setTimeout(() => {
      table.setColumnOrder(newOrder)
    }, 1000)
  }

  return (
    <Modal {...{ isOpen, onClose }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Customize shown columns</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ColumnSelector
            column={columns.find((col) => col.id === "identity")}
            isDisabled={true}
          />
          <Reorder.Group axis="y" values={localOrder} onReorder={setLocalOrder}>
            {localOrder.map((colId) => (
              <Reorder.Item
                key={colId}
                value={colId}
                onDragEnd={setTableOrder}
                style={{ position: "relative" }} // needed for the auto-applied zIndex to work
              >
                <ColumnSelector column={columns.find((col) => col.id === colId)} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type SelectorProps = { column: Column<Member>; isDisabled?: boolean }

const ColumnSelector = ({ column, isDisabled }: SelectorProps) => {
  const bg = useColorModeValue("gray.100", "#3A3A40")

  return (
    <Box
      py="3"
      px="4"
      mb="2"
      bg={bg}
      borderRadius="xl"
      cursor={!isDisabled && "grab"}
    >
      <HStack justifyContent={"space-between"}>
        <Checkbox
          {...(column.columns.length
            ? {
                isIndeterminate:
                  column.columns.some((subColumn) => subColumn.getIsVisible()) &&
                  column.columns.some(
                    (subColumn) =>
                      subColumn.getCanHide() && !subColumn.getIsVisible()
                  ),
                isChecked: column.columns.every(
                  (subColumn) => subColumn.getIsVisible() || !subColumn.getCanHide()
                ),
                onChange: (e) =>
                  column.columns.forEach((subColumn) =>
                    subColumn.toggleVisibility(e.target.checked)
                  ),
              }
            : {
                isChecked: column.getIsVisible(),
                onChange: column.getToggleVisibilityHandler(),
              })}
          isDisabled={isDisabled}
        >
          {COLUMN_NAMES[column.id]}
        </Checkbox>
        {!isDisabled && <DotsSixVertical />}
      </HStack>
      {!!column.columns.length && (
        <Stack pl="6" pt="1.5" spacing={1}>
          {column.columns.map((subColumn) => (
            <Checkbox
              key={subColumn.id}
              isChecked={subColumn.getIsVisible()}
              onChange={subColumn.getToggleVisibilityHandler()}
              isDisabled={!subColumn.getCanHide()}
            >
              {COLUMN_NAMES[subColumn.id]}
            </Checkbox>
          ))}
        </Stack>
      )}
    </Box>
  )
}

const transformToLocalOrder = (table) => {
  const columnOrder = table.getState().columnOrder
  const columnIds = table.getAllLeafColumns().map((col) => col.id)
  const res = columnOrder.length ? columnOrder : columnIds

  // remove 'select' and 'identity'
  res.splice(0, 2)

  // transform 'hiddenRoles' + 'publicRoles' to 'roles' (parent column)
  const rolesIndex = res.indexOf("hiddenRoles")
  res.splice(rolesIndex, 2, "roles")

  return res
}

const transformToTableOrder = (localOrder) => {
  const res = [...localOrder]

  res.unshift("select", "identity")

  // transform 'roles' to 'hiddenRoles' + 'publicRoles' (leaf columns)
  const rolesIndex = res.indexOf("roles")
  res.splice(rolesIndex, 1, "hiddenRoles", "publicRoles")

  return res
}

export default CustomizeViewModal
