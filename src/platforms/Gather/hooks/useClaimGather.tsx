import { useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

type ClaimResponse = {
  uniqueValue: string
}

const useClaimGather = (rolePlatformId: number) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { id: guildId, roles } = useGuild()
  const roleId = roles.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatformId)
  )?.id

  const triggerConfetti = useJsConfetti()
  const showErrorToast = useShowErrorToast()

  const endpoint = `/v2/guilds/${guildId}/roles/${roleId}/role-platforms/${rolePlatformId}/claim`

  const claimFetcher = (signedValidation: SignedValidation) =>
    fetcher(endpoint, {
      method: "POST",
      ...signedValidation,
    })

  const { onSubmit: onClaimGatherSubmit, ...claim } =
    useSubmitWithSign<ClaimResponse>(claimFetcher, {
      onSuccess: () => triggerConfetti(),
      onError: (error) => showErrorToast(error),
    })

  return {
    error: claim.error,
    isLoading: claim.isLoading,
    onSubmit: () => onClaimGatherSubmit(),
    modalProps: {
      isOpen,
      onOpen,
      onClose,
    },
  }
}

export default useClaimGather
