import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  FormLabel,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Alert } from "components/common/Modal"
import ShouldKeepPlatformAccesses from "components/[guild]/ShouldKeepPlatformAccesses"
import platforms from "platforms/platforms"
import { useRef, useState } from "react"
import { GuildPlatform, PlatformType } from "types"

type Props = {
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
}: Props): JSX.Element => {
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

export default RemovePlatformAlert
