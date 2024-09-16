import { useDisclosure } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { useClaimedReward } from "hooks/useClaimedReward"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useSWRConfig } from "swr"
import useSWRImmutable from "swr/immutable"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"

type ClaimResponse = {
  uniqueValue: string
}

const useClaimGather = (rolePlatformId: number) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { uniqueValue } = useClaimedReward(rolePlatformId)
  const { cache } = useSWRConfig()

  const { id: guildId, roles, mutateGuild } = useGuild()
  const roleId = roles.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatformId)
  )?.id

  const triggerConfetti = useJsConfetti()
  const showErrorToast = useShowErrorToast()
  const { rewardClaimed } = useCustomPosthogEvents()

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

  const { onSubmit: onClaimGatherSubmit, ...claim } =
    useSubmitWithSign<ClaimResponse>(claimFetcher, {
      onSuccess: (response) => {
        rewardClaimed(PlatformType.GATHER_TOWN)
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
    })

  return {
    error: claim.error,
    isLoading: claim.isLoading,
    response: uniqueValue ? { uniqueValue } : (responseFromCache ?? claim.response),
    onSubmit: () => onClaimGatherSubmit(),
    modalProps: {
      isOpen,
      onOpen,
      onClose,
    },
  }
}

export default useClaimGather
