import type { AccessQueueJob } from "@guild.xyz/guild-queues"
import useMemberships from "components/explorer/hooks/useMemberships"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useFlow from "hooks/useFlow"
import { useToastWithButton, useToastWithTweetButton } from "hooks/useToast"
import { useRouter } from "next/router"
import { CircleWavyCheck } from "phosphor-react"
import { useEffect } from "react"
import { mutate } from "swr"
import { PlatformName } from "types"

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
  const guild = useGuild()
  const user = useUser()

  const poll = useFlow<AccessQueueJob>(
    `/v2/actions/join`,
    { guildId: guild.id },
    { guildId: `${guild.id}` },
    false
  )

  const response = poll.data?.done
    ? ({
        success: poll.data.roleAccesses?.some((ra) => ra.access),
        accessedRoleIds: poll.data.updateMembershipResult?.membershipRoleIds,
        platformResults: [{}], // TODO
      } as Response)
    : null

  const { mutate: mutateMemberships } = useMemberships()
  const { pathname } = useRouter()
  const toastWithTweetButton = useToastWithTweetButton()
  const toastWithButton = useToastWithButton()
  const mintGuildPinContext = useMintGuildPinContext()
  // Destructuring it separately, since we don't have a MintGuildPinContext on the POAP minting page
  const { onOpen } = mintGuildPinContext ?? {}
  const { captureEvent } = usePostHogContext()

  // onSuccess
  useEffect(() => {
    if (!response) return

    mutate(
      [
        `/v2/actions/access-check?${new URLSearchParams({
          guildId: `${guild?.id}`,
        }).toString()}`,
        { method: "GET" },
        user?.id,
      ],
      poll.data,
      { revalidate: false }
    )

    onSuccess?.(response)

    if (!response.success) return

    setTimeout(() => {
      mutateMemberships(
        (prev) => [
          ...prev,
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

    if (pathname === "/[guild]" && guild.featureFlags.includes("GUILD_CREDENTIAL")) {
      toastWithButton({
        title: "Successfully joined guild",
        description: "Let others know as well by minting it on-chain",
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
  }, [response])

  const a = (response && response) || response

  // onError
  useEffect(() => {
    if (!poll.error) return

    captureEvent(`Guild join error`, { error: poll.error })
  }, [poll.error])

  return {
    response,
    isLoading: poll.isLoading,
    error: poll.error,
    onSubmit: () => {
      poll.mutate()
    },
  }
}

export default useJoin
