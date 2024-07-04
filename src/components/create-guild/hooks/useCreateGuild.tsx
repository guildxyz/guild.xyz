import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { Schemas } from "@guildxyz/types"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { Guild, GuildBase } from "types"
import fetcher from "utils/fetcher"
import getRandomInt from "utils/getRandomInt"
import slugify from "utils/slugify"
import { CreateGuildFormType } from "../CreateGuildForm"

const useCreateGuild = ({
  onError,
  onSuccess,
}: {
  onError?: (err: unknown) => void
  onSuccess?: () => void
} = {}) => {
  const { captureEvent } = usePostHogContext()

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

      captureEvent("Created guild", {
        $set: {
          createdGuild: true,
        },
      })

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
    /**
     * Temporarily creating a default Member role, later the users will be able to
     * pick from Guild Templates
     */
    onSubmit: (data: CreateGuildFormType) =>
      useSubmitResponse.onSubmit({
        ...data,
        urlName: slugify(data.name),
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
        roles: [
          {
            name: "Member",
            imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
            requirements: [
              {
                type: "FREE",
              },
            ],
          },
        ],
      } satisfies Schemas["GuildCreationPayload"]),
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
