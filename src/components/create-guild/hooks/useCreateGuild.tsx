import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { Guild, GuildBase, PlatformType } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

const useCreateGuild = ({
  onError,
  onSuccess,
}: {
  onError?: (err: unknown) => void
  onSuccess?: () => void
} = {}) => {
  const { captureEvent } = usePostHogContext()
  const { rewardCreated } = useCustomPosthogEvents()

  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const fetchData = async (signedValidation: SignedValidation): Promise<Guild> =>
    fetcher("/v2/guilds", signedValidation)

  const useSubmitResponse = useSubmitWithSign<Guild>(fetchData, {
    onError: (error_) => {
      showErrorToast({
        error: processConnectorError(error_.error) ?? error_.error,
        correlationId: error_.correlationId,
      })
      onError?.(error_)
    },
    onSuccess: (response_) => {
      triggerConfetti()

      captureEvent("guild creation flow > guild successfully created")

      if (response_.guildPlatforms?.length > 0) {
        response_.guildPlatforms.forEach((guildPlatform) => {
          rewardCreated(guildPlatform.platformId, response_?.urlName)
        })
      }

      if (response_.guildPlatforms?.[0]?.platformId === PlatformType.CONTRACT_CALL) {
        captureEvent("Created NFT reward", {
          hook: "useCreateGuild",
        })
      }

      mutateYourGuilds((prev) => mutateGuildsCache(prev, response_), {
        revalidate: false,
      })
      matchMutate<GuildBase[]>(
        /\/guilds\?order/,
        (prev) => mutateGuildsCache(prev, response_),
        { revalidate: false }
      )

      toast({
        title: `Guild successfully created!`,
        description: "You're being redirected to its page",
        status: "success",
      })
      onSuccess?.()
      router.push(`/${response_.urlName}`)
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer))),
  }
}

const mutateGuildsCache = (prev: GuildBase[], createdGuild: Guild) => [
  ...prev,
  {
    id: createdGuild.id,
    name: createdGuild.name,
    urlName: createdGuild.urlName,
    imageUrl: createdGuild.imageUrl,
    memberCount: 1,
    rolesCount: createdGuild.roles.length,
    tags: [],
    hideFromExplorer: false,
  },
]

export default useCreateGuild
