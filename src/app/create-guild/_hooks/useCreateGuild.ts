import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { useToast } from "@/components/ui/hooks/useToast"
import { useYourGuilds } from "@/hooks/useYourGuilds"
import { Schemas } from "@guildxyz/types"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/navigation"
import { Guild, GuildBase } from "types"
import fetcher from "utils/fetcher"
import getRandomInt from "utils/getRandomInt"
import slugify from "utils/slugify"
import { CreateGuildFormType } from "../types"

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

  const { toast } = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti() // TODO: use the new confetti?
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
        title: "Guild successfully created!",
        description: "You're being redirected to its page",
        variant: "success",
      })
      onSuccess?.()
      router.push(`/${response_.urlName}`)
    },
  })

  return {
    ...useSubmitResponse,

    onSubmit: (data: CreateGuildFormType) =>
      useSubmitResponse.onSubmit({
        ...data,
        urlName: slugify(data.name),
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
      } satisfies Schemas["GuildCreationPayload"]),
  }
}

const mutateGuildsCache = (prev: GuildBase[] | undefined, createdGuild: Guild) => [
  ...(prev ?? []),
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

export { useCreateGuild }
