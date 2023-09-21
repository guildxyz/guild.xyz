import useMemberships from "components/explorer/hooks/useMemberships"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { useToastWithButton, useToastWithTweetButton } from "hooks/useToast"
import { useRouter } from "next/router"
import { CircleWavyCheck } from "phosphor-react"
import { PlatformName } from "types"
import fetcher from "utils/fetcher"

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

  const submit = (signedValidation: SignedValdation): Promise<Response> =>
    fetcher(`/user/join`, signedValidation).then((body) => {
      if (body === "rejected") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw "Something went wrong, join request rejected."
      }

      if (typeof body === "string") {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw body
      }

      return body
    })

  const mintGuildPinContext = useMintGuildPinContext()
  // Destructuring it separately, since we don't have a MintGuildPinContext on the POAP minting page
  const { onOpen } = mintGuildPinContext ?? {}
  const { pathname } = useRouter()

  const useSubmitResponse = useSubmitWithSign<Response>(submit, {
    onSuccess: (response) => {
      access?.mutate?.()
      // mutate user in case they connected new platforms during the join flow
      user?.mutate?.()

      onSuccess?.(response)

      if (!response.success) return

      setTimeout(() => {
        mutate(
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

      if (
        pathname === "/[guild]" &&
        guild.featureFlags.includes("GUILD_CREDENTIAL")
      ) {
        toastWithButton({
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
