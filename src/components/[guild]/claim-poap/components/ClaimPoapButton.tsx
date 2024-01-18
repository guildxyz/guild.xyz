import {
  ButtonProps,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import useClaimText from "platforms/SecretText/hooks/useClaimText"

type Props = {
  rolePlatformId: number
} & ButtonProps

const ClaimPoapButton = ({ rolePlatformId, ...rest }: Props) => {
  const { captureEvent } = usePostHogContext()

  const { urlName, roles } = useGuild()

  const roleId = roles?.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatformId)
  )?.id
  const { isLoading: isAccessLoading, hasAccess } = useAccess(roleId)

  // TODO: we'll be able to fetch this from our API once PR#1011 is merged
  const alreadyClaimed = false

  const {
    onSubmit,
    isLoading: isClaimLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatformId)

  const isLoading = isAccessLoading || isClaimLoading
  const isDisabled = !hasAccess || !!alreadyClaimed

  return (
    <>
      <Button
        size="lg"
        w="full"
        isLoading={isLoading}
        loadingText={isAccessLoading ? "Checking access" : "Claiming POAP"}
        colorScheme={!isDisabled ? "green" : "gray"}
        onClick={() => {
          captureEvent("Click: ClaimPoapButton", {
            guild: urlName,
          })
          /**
           * We're always sending a join request here, because if the user joined the
           * role before the admins added the reward to it, they won't have the
           * UserReward in our backend and then they wouldn't be able to claim the
           * NFT. This way, we can make sure that this won't happen
           */
          onOpen()
          if (!response) onSubmit()
        }}
        {...rest}
        isDisabled={isDisabled || rest?.isDisabled}
      >
        {alreadyClaimed
          ? "Already claimed"
          : !hasAccess
          ? "Satisfy requirements"
          : "Claim now"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <ModalHeader pb={0}>Claim POAP</ModalHeader>

          <ModalBody pt={8}>
            {isLoading ? (
              <HStack spacing="6">
                <Spinner />
                <Text>Getting your mint link...</Text>
              </HStack>
            ) : (
              response?.uniqueValue ?? (
                <ErrorAlert label={error?.error ?? "Something went wrong"} />
              )
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default ClaimPoapButton
