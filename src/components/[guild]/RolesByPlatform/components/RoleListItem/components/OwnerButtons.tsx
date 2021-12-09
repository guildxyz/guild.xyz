import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import useDelete from "components/[guild]/EditForm/components/DeleteCard/hooks/useDelete"
import usePersonalSign from "hooks/usePersonalSign"
import { useRouter } from "next/router"
import { PencilSimple, TrashSimple } from "phosphor-react"
import { useRef } from "react"
import { Role } from "types"

type Props = {
  roleData: Role
}

const OwnerButtons = ({ roleData }: Props): JSX.Element => {
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })
  const { onSubmit, isLoading: isRoleDeleteLoading } = useDelete(
    "role",
    roleData?.id
  )
  const { isSigning } = usePersonalSign()

  return (
    <>
      <Stack direction={{ base: "row", md: "column" }}>
        <IconButton
          icon={<Icon as={PencilSimple} />}
          size="sm"
          rounded="full"
          aria-label="Edit role"
          onClick={() => router.push(`/${router.query.guild}/edit/${roleData.id}`)}
        />
        <IconButton
          icon={<Icon as={TrashSimple} color="red.500" />}
          size="sm"
          rounded="full"
          aria-label="Delete role"
          onClick={onOpen}
        />
      </Stack>

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Role</AlertDialogHeader>
            <AlertDialogBody>
              <Text>Are you sure? You can't undo this action afterwards.</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isLoading={isRoleDeleteLoading}
                loadingText={isSigning ? "Check your wallet" : "Deleting"}
                onClick={() => onSubmit()}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default OwnerButtons
