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
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

type ClaimResponse = {
  uniqueValue: string
}

const joinFetcher = (signedValidation: SignedValdation) =>
  fetcher(`/user/join`, signedValidation)

const useClaimText = (rolePlatformId: number) => {
  const { cache } = useSWRConfig()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { id: guildId, roles } = useGuild()
  const roleId = roles.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatformId)
  )?.id

  const triggerConfetti = useJsConfetti()
  const showErrorToast = useShowErrorToast()

  const endpoint = `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`
  const { data: responseFromCache, mutate: mutateCachedResponse } = useSWRImmutable(
    endpoint,
    () => cache.get(endpoint)?.data
  )

  const claimFetcher = (signedValidation: SignedValdation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  const { onSubmit: onClaimTextSubmit, ...claim } = useSubmitWithSign<ClaimResponse>(
    claimFetcher,
    {
      onSuccess: (response) => {
        triggerConfetti()
        /**
         * Saving in SWR cache so we don't need to re-claim the reward if the user
         * clicks on the claim button in the AccessHub, then on the RoleCard (or vice
         * versa)
         */
        mutateCachedResponse(response)
      },
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
    response: responseFromCache ?? claim.response,
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
  title: string
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  response?: ClaimResponse
  error?: any
}

const ClaimTextModal = ({
  title,
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

      <ModalHeader pb={0}>{title}</ModalHeader>

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
