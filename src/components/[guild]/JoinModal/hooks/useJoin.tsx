import type { JoinJob } from "@guildxyz/types"
import useMemberships from "components/explorer/hooks/useMemberships"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useSubmit from "hooks/useSubmit"
import { useToastWithButton, useToastWithTweetButton } from "hooks/useToast"
import { useRouter } from "next/router"
import { CircleWavyCheck } from "phosphor-react"
import { PlatformName } from "types"
import createAndAwaitJob from "utils/createAndAwaitJob"
import { useFetcherWithSign } from "utils/fetcher"

// as any is only needed until the feature flag is created
export const QUEUE_FEATURE_FLAG: any = "GUILD_QUEUES"

type PlatformResult = {
  platformId: number
  platformName: PlatformName
} & (
  | { success: true }
  | {
      success: false
      errorMsg: "Unknown Member"
      invite: string
    }
)

type Response = {
  success: boolean
  platformResults: PlatformResult[]
  accessedRoleIds: number[]
}

export type JoinData = {
  oauthData: any
}

const useJoin = (onSuccess?: (response: Response) => void) => {
  const { captureEvent } = usePostHogContext()

  const access = useAccess()
  const guild = useGuild()
  const user = useUser()

  const toastWithTweetButton = useToastWithTweetButton()
  const toastWithButton = useToastWithButton()

  const { mutate } = useMemberships()

  const fetcherWithSign = useFetcherWithSign()

  const submit = async (data: {
    guildId: number
    shareSocials: boolean
    platforms: any[]
  }): Promise<Response> => {
    if (guild.featureFlags.includes(QUEUE_FEATURE_FLAG)) {
      const result = await createAndAwaitJob<JoinJob>(
        fetcherWithSign,
        "/v2/actions/join",
        { guildId: data?.guildId },
        { guildId: `${data?.guildId}` }
      )

      const accessedRoleIds = (result?.roleAccesses ?? [])
        .filter((roleAccess) => !!roleAccess?.access)
        .map(({ roleId }) => roleId)

      if ((result as any)?.failed) {
        throw new Error((result as any)?.failedErrorMsg)
      }

      return {
        success: true,
        accessedRoleIds,
        platformResults: [],
      }
    }

    return fetcherWithSign([`/user/join`, { method: "POST", body: data }]).then(
      (body) => {
        if (body === "rejected") {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw "Something went wrong, join request rejected."
        }

        if (typeof body === "string") {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw body
        }

        return body
      }
    )
  }

  const mintGuildPinContext = useMintGuildPinContext()
  // Destructuring it separately, since we don't have a MintGuildPinContext on the POAP minting page
  const { onOpen } = mintGuildPinContext ?? {}
  const { pathname } = useRouter()

  const useSubmitResponse = useSubmit(submit, {
    onSuccess: (response: Response) => {
      access?.mutate?.()
      // mutate user in case they connected new platforms during the join flow
      user?.mutate?.()

      onSuccess?.(response)

      if (!response.success) return

      setTimeout(() => {
        mutate(
          (prev) => [
            ...(prev ?? []),
            {
              guildId: guild.id,
              isAdmin: false,
              roleIds: response.accessedRoleIds,
              joinedAt: new Date().toISOString(),
            },
          ],
          { revalidate: false }
        )
        // show user in guild's members
        guild.mutateGuild()
      }, 800)

      if (
        pathname === "/[guild]" &&
        guild.featureFlags.includes("GUILD_CREDENTIAL")
      ) {
        toastWithButton({
          status: "success",
          title: "Successfully joined guild",
          description: "Let others know as well by minting it onchain",
          buttonProps: {
            leftIcon: <CircleWavyCheck weight="fill" />,
            children: "Mint Guild Pin",
            onClick: onOpen,
          },
        })
      } else {
        toastWithTweetButton({
          title: "Successfully joined guild",
          tweetText: `Just joined the ${guild.name} guild. Continuing my brave quest to explore all corners of web3!
          guild.xyz/${guild.urlName}`,
        })
      }
    },
    onError: (error) => {
      captureEvent(`Guild join error`, { error })
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data?) =>
      useSubmitResponse.onSubmit({
        guildId: guild?.id,
        shareSocials: data?.shareSocials,
        platforms:
          data &&
          Object.entries(data.platforms ?? {})
            .filter(([_, value]) => !!value)
            .map(([key, value]: any) => ({
              name: key,
              ...value,
            })),
      }),
  }
}

export default useJoin
