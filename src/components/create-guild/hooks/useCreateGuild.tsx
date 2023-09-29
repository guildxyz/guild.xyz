import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { Guild, PlatformType } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

const useCreateGuild = () => {
  const { captureEvent } = usePostHogContext()

  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const fetcherWithSign = useFetcherWithSign()

  const fetchData = async (signedValidation: SignedValdation): Promise<Guild> =>
    fetcher("/v2/guilds", signedValidation)

  const useSubmitResponse = useSubmitWithSign<Guild>(fetchData, {
    onError: (error_) =>
      showErrorToast({
        error: processConnectorError(error_.error) ?? error_.error,
        correlationId: error_.correlationId,
      }),
    onSuccess: (response_) => {
      triggerConfetti()

      toast({
        title: `Guild successfully created!`,
        description: "You're being redirected to its page",
        status: "success",
      })
      router.push(`/${response_.urlName}`)

      if (response_.guildPlatforms[0]?.platformId === PlatformType.DISCORD)
        fetcherWithSign([
          `/statusUpdate/guildify/${response_.id}?force=true`,
          {
            body: {
              notifyUsers: false,
            },
          },
        ])

      if (response_.guildPlatforms[0]?.platformId === PlatformType.CONTRACT_CALL) {
        captureEvent("Created NFT reward", {
          hook: "useCreateGuild",
        })
      }

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer))),
  }
}

export default useCreateGuild
