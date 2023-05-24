import { Text, ToastId, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import useMemberships from "components/explorer/hooks/useMemberships"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { CircleWavyCheck, TwitterLogo } from "phosphor-react"
import { useRef } from "react"
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

const useJoin = (onSuccess?: () => void) => {
  const { captureEvent } = usePostHogContext()

  const access = useAccess()
  const guild = useGuild()
  const user = useUser()

  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const toastButtonBackground = useColorModeValue("blackAlpha.100", undefined)

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

      onSuccess?.()

      if (!response.success) {
        toast({
          status: "error",
          title: "No access",
          description: "Seems like you don't have access to any roles in this guild",
        })
        return
      }

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

      toastIdRef.current = toast({
        title: `Successfully joined guild`,
        duration: 8000,
        description:
          pathname === "/[guild]" &&
          guild.featureFlags.includes("GUILD_CREDENTIAL") ? (
            <>
              <Text>Let others know as well by minting it on-chain</Text>
              <Button
                leftIcon={<CircleWavyCheck weight="fill" />}
                size="sm"
                mt={3}
                mb="1"
                bg={toastButtonBackground}
                borderRadius="lg"
                onClick={onOpen}
              >
                Mint Guild Pin
              </Button>
            </>
          ) : (
            <>
              <Text>Let others know as well by sharing it on Twitter</Text>
              <Button
                as="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Just joined the ${guild.name} guild. Continuing my brave quest to explore all corners of web3!
guild.xyz/${guild.urlName}`
                )}`}
                target="_blank"
                bg={toastButtonBackground}
                leftIcon={<TwitterLogo weight="fill" />}
                size="sm"
                onClick={() => toast.close(toastIdRef.current)}
                mt={3}
                mb="1"
                borderRadius="lg"
              >
                Share
              </Button>
            </>
          ),
        status: "success",
      })
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
