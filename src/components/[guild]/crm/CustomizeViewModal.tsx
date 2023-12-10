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
import useGuild from "../hooks/useGuild"
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
  const { roles } = useGuild()

  return (
    <Modal {...{ isOpen, onClose }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Customize shown columns</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            {table
              .getAllColumns()
              .slice(1)
              .map((col) => (
                <ColumnSelector
                  key={col.id}
                  column={col}
                  isDisabled={col.id === "identity"}
                />
              ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

type SelectorProps = { column: Column<Member>; isDisabled: boolean }

const ColumnSelector = ({ column, isDisabled }: SelectorProps) => {
  const bg = useColorModeValue("gray.100", "blackAlpha.300")

  return (
    <Box py="3" px="4" bg={bg} borderRadius="xl">
      <HStack justifyContent={"space-between"}>
        <Checkbox
          {...(column.columns.length
            ? {
                isIndeterminate:
                  column.columns.some((subColumn) => subColumn.getIsVisible()) &&
                  column.columns.some((subColumn) => !subColumn.getIsVisible()),
                isChecked: column.columns.every((subColumn) =>
                  subColumn.getIsVisible()
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
        {/* {!isDisabled && <DotsSixVertical />} */}
      </HStack>
      {!!column.columns.length && (
        <Stack pl="6" pt="1.5" spacing={1}>
          {column.columns.map((subColumn) => (
            <Checkbox
              key={subColumn.id}
              isChecked={subColumn.getIsVisible()}
              onChange={subColumn.getToggleVisibilityHandler()}
            >
              {COLUMN_NAMES[subColumn.id]}
            </Checkbox>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default CustomizeViewModal
