import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  MenuItem,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { PencilSimple, TrashSimple } from "@phosphor-icons/react"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import { useRef } from "react"
import useDeleteRoleGroup from "../hooks/useDeleteRoleGroup"
import EditCampaignModal from "./EditCampaignModal"

type Props = {
  groupId: number
}

const CampaignCardMenu = ({ groupId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  const removeMenuItemColor = useColorModeValue("red.600", "red.300")

  return (
    <Box position="absolute" top={2} right={2}>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Customize page
        </MenuItem>
        <MenuItem
          icon={<TrashSimple />}
          color={removeMenuItemColor}
          onClick={onDeleteOpen}
        >
          Delete page
        </MenuItem>
      </PlatformCardMenu>

      <DeleteCampaignAlert
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        groupId={groupId}
      />
      <EditCampaignModal
        isOpen={isOpen}
        onClose={onClose}
        groupId={groupId}
        onSuccess={onClose}
      />
    </Box>
  )
}

const DeleteCampaignAlert = ({ groupId, isOpen, onClose }) => {
  const { onSubmit: onDeleteRoleGroup, isLoading } = useDeleteRoleGroup(groupId)
  const cancelRef = useRef(null)

  return (
    <Alert isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader pb="6">Delete page</AlertDialogHeader>
        <AlertDialogBody>
          Are you sure to delete this page and all roles in it?
        </AlertDialogBody>
        <AlertDialogFooter display={"flex"} gap={2}>
          <Button ref={cancelRef} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => onDeleteRoleGroup()}
            isLoading={isLoading}
            colorScheme="red"
          >
            Delete page
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Alert>
  )
}

export default CampaignCardMenu
