import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  CloseButton,
  FormLabel,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import ShouldKeepPlatformAccesses from "components/[guild]/ShouldKeepPlatformAccesses"
import platforms from "platforms"
import { useRef, useState } from "react"
import { GuildPlatform, PlatformType } from "types"
import useRemovePlatform from "./hooks/useRemovePlatform"

type Props = {
  removeButtonColor: string
  guildPlatform: GuildPlatform
}

const RemovePlatformButton = ({
  removeButtonColor,
  guildPlatform,
}: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useRemovePlatform(onClose)

  return (
    <>
      <Tooltip label={"Remove reward..."}>
        <CloseButton
          size="sm"
          color={removeButtonColor}
          rounded="full"
          aria-label="Remove reward"
          zIndex="1"
          onClick={onOpen}
        />
      </Tooltip>

      <RemovePlatformAlert
        guildPlatform={guildPlatform}
        keepAccessDescription="Everything on the platform will remain as is for existing members, but accesses by this role won’t be managed anymore"
        revokeAccessDescription="Existing members will lose their accesses on the platform granted by this role"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </>
  )
}

type RemovePlatformAlertProps = {
  guildPlatform: GuildPlatform
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, any>) => void
  keepAccessDescription: string
  revokeAccessDescription: string
  isLoading: boolean
}

const RemovePlatformAlert = ({
  guildPlatform,
  isOpen,
  onClose,
  onSubmit,
  keepAccessDescription,
  revokeAccessDescription,
  isLoading,
}: RemovePlatformAlertProps): JSX.Element => {
  const [removeAccess, setRemoveAccess] = useState(false)
  const cancelRef = useRef()

  return (
    <Alert
      leastDestructiveRef={cancelRef}
      {...{ isOpen, onClose }}
      size="xl"
      colorScheme={"dark"}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{`Remove reward: ${guildPlatform?.platformGuildName} (${
            platforms[PlatformType[guildPlatform?.platformId]]?.name
          })`}</AlertDialogHeader>
          <AlertDialogBody>
            <FormLabel mb="3">
              What to do with existing members on the platform?
            </FormLabel>
            <ShouldKeepPlatformAccesses
              {...{ keepAccessDescription, revokeAccessDescription }}
              onChange={(newValue) => setRemoveAccess(newValue === "true")}
              value={removeAccess as any}
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              isLoading={isLoading}
              loadingText="Removing"
              onClick={() => onSubmit({ removePlatformAccess: removeAccess })}
            >
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Alert>
  )
}

export default RemovePlatformButton
export { RemovePlatformAlert }
