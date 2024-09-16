import {
  Box,
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
import { reactMarkdownComponents } from "components/[guild]/collect/components/RichTextDescription"
import useGuild from "components/[guild]/hooks/useGuild"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { PropsWithChildren } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { useClaimedReward } from "../../../hooks/useClaimedReward"

type ClaimResponse = {
  uniqueValue: string
}

const useClaimText = (rolePlatformId: number) => {
  const { cache } = useSWRConfig()
  const { uniqueValue } = useClaimedReward(rolePlatformId)
  const { rewardClaimed } = useCustomPosthogEvents()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { id: guildId, roles, mutateGuild, guildPlatforms } = useGuild()
  const roleId = roles.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatformId)
  )?.id

  const guildPlatformId = roles
    .find((role) => role.id === roleId)
    ?.rolePlatforms?.find(({ id }) => id === rolePlatformId)?.guildPlatformId

  const guildPlatform = guildPlatforms.find(({ id }) => id === guildPlatformId)

  const triggerConfetti = useJsConfetti()
  const showErrorToast = useShowErrorToast()

  const endpoint = `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`
  const { data: responseFromCache, mutate: mutateCachedResponse } = useSWRImmutable(
    endpoint,
    () => cache.get(endpoint)?.data
  )

  const claimFetcher = (signedValidation: SignedValidation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  const { onSubmit: onClaimTextSubmit, ...claim } = useSubmitWithSign<ClaimResponse>(
    claimFetcher,
    {
      onSuccess: (response) => {
        if (guildPlatform) {
          rewardClaimed(guildPlatform.platformId)
        }
        triggerConfetti()
        /**
         * Saving in SWR cache so we don't need to re-claim the reward if the user
         * clicks on the claim button in the AccessHub, then on the RoleCard (or vice
         * versa)
         */
        mutateCachedResponse(response)
        mutateGuild((prevGuild) => ({
          ...prevGuild,
          roles: prevGuild?.roles.map((role) => {
            if (!role.rolePlatforms?.some((rp) => rp.id === rolePlatformId))
              return role

            return {
              ...role,
              rolePlatforms: role.rolePlatforms.map((rp) => {
                if (rp.id !== rolePlatformId) return rp

                return {
                  ...rp,
                  claimedCount: rp.claimedCount + 1,
                }
              }),
            }
          }),
        }))
      },
      onError: (error) => showErrorToast(error),
    }
  )

  return {
    error: claim.error,
    response: uniqueValue ? { uniqueValue } : (responseFromCache ?? claim.response),
    isLoading: claim.isLoading,
    onSubmit: onClaimTextSubmit,
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
  children,
}: PropsWithChildren<ModalProps>) => (
  <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />

      <ModalHeader pb={0}>{title}</ModalHeader>

      <ModalBody pt={8}>
        {isLoading ? (
          <HStack spacing="6">
            <Spinner />
            <Text>Getting your secret...</Text>
          </HStack>
        ) : response?.uniqueValue ? (
          <Box mb="-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              transformLinkUri={false}
              components={reactMarkdownComponents}
            >
              {response.uniqueValue}
            </ReactMarkdown>
          </Box>
        ) : (
          <ErrorAlert label={error?.error ?? "Something went wrong"} />
        )}
      </ModalBody>
      {children}
    </ModalContent>
  </Modal>
)

export default useClaimText
export { ClaimTextModal }
