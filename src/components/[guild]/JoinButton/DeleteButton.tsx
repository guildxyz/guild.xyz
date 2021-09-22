import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ColorButton from "components/common/ColorButton"
import { TrashSimple } from "phosphor-react"
import { useMemo, useRef, useState } from "react"
import { useGuild } from "../Context"

type Props = {
  isLoading?: boolean
  onClick: () => void
}

const DeleteButton = ({ isLoading = false, onClick }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const { owner } = useGuild()

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const onClose = () => setIsAlertOpen(false)
  const cancelRef = useRef()

  const isOwner = useMemo(
    () =>
      owner?.addresses
        ?.map((user) => user.address)
        ?.includes(account?.toLowerCase()),
    [account, owner]
  )

  return (
    isOwner && (
      <>
        <ColorButton
          color="red.500"
          rounded="2xl"
          isLoading={isLoading}
          onClick={() => setIsAlertOpen(true)}
        >
          <Icon as={TrashSimple} />
        </ColorButton>

        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Guild
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={onClick} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  )
}

export default DeleteButton
