import {
  Center,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { reactMarkdownComponents } from "components/[guild]/collect/components/RichTextDescription"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import ReactMarkdown from "react-markdown"
import fetcher from "utils/fetcher"

type ClaimResponse = {
  uniqueValue: string
}

const joinFetcher = (signedValidation: SignedValdation) =>
  fetcher(`/user/join`, signedValidation)

const useClaimText = (rolePlatformId: number) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { id: guildId, roles } = useGuild()
  const roleId = roles.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatformId)
  )?.id

  const triggerConfetti = useJsConfetti()
  const showErrorToast = useShowErrorToast()

  const claimFetcher = (signedValidation: SignedValdation) =>
    fetcher(
      `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}1/claim`,
      {
        method: "POST",
        ...signedValidation,
      }
    )

  const { onSubmit: onClaimTextSubmit, ...claim } = useSubmitWithSign<ClaimResponse>(
    claimFetcher,
    {
      onSuccess: () => triggerConfetti(),
      onError: (error) => showErrorToast(error),
    }
  )

  const join = useSubmitWithSign(joinFetcher, {
    onSuccess: () => onClaimTextSubmit(),
    onError: (error) =>
      showErrorToast({
        error: "Couldn't check eligibility",
        correlationId: error.correlationId,
      }),
  })

  return {
    error: claim.error ?? join.error,
    response: claim.response,
    isLoading: claim.isLoading || join.isLoading,
    onSubmit: () => join.onSubmit({ guildId }),
    modalProps: {
      isOpen,
      onOpen,
      onClose,
    },
  }
}

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  response?: ClaimResponse
  error?: any
}

const ClaimTextModal = ({
  isOpen,
  onClose,
  isLoading,
  response,
  error,
}: ModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />

      {!response?.uniqueValue && <ModalHeader pb={0}>Reveal secret</ModalHeader>}

      <ModalBody pt={8}>
        {isLoading ? (
          <HStack spacing="6">
            <Center boxSize="16">
              <Spinner />
            </Center>
            <Text>Getting your secret...</Text>
          </HStack>
        ) : response?.uniqueValue ? (
          <ReactMarkdown components={reactMarkdownComponents}>
            {response.uniqueValue}
          </ReactMarkdown>
        ) : (
          <ErrorAlert label={error?.error ?? "Something went wrong"} />
        )}
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default useClaimText
export { ClaimTextModal }
