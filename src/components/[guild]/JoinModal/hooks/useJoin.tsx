import { Text, ToastId, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useDatadog from "components/_app/Datadog/useDatadog"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
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
}

export type JoinData = {
  oauthData: any
}

const useJoin = (onSuccess?: () => void) => {
  const { addDatadogAction, addDatadogError } = useDatadog()

  const router = useRouter()
  const { account } = useWeb3React()

  const guild = useGuild()
  const user = useUser()

  const toast = useToast()
  const toastIdRef = useRef<ToastId>()
  const tweetButtonBackground = useColorModeValue("blackAlpha.100", undefined)

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

  const useSubmitResponse = useSubmitWithSign<Response>(submit, {
    onSuccess: (response) => {
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

      addDatadogAction(`Successfully joined a guild`)

      setTimeout(() => {
        mutateOptionalAuthSWRKey(`/user/membership/${account}`)
        // show user in guild's members
        mutateOptionalAuthSWRKey(`/guild/${router.query.guild}`)
      }, 800)

      toastIdRef.current = toast({
        title: `Successfully joined guild`,
        duration: 8000,
        description: (
          <>
            <Text>Let others know as well by sharing it on Twitter</Text>
            <Button
              as="a"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Just joined the ${guild.name} guild. Continuing my brave quest to explore all corners of web3!
guild.xyz/${guild.urlName} @guildxyz`
              )}`}
              target="_blank"
              bg={tweetButtonBackground}
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
    onError: (err) => {
      addDatadogError(`Guild join error`, { error: err })
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data?) =>
      useSubmitResponse.onSubmit({
        guildId: guild?.id,
        platforms:
          data &&
          Object.entries(data.platforms)
            .filter(([_, value]) => !!value)
            .map(([key, value]: any) => ({
              name: key,
              ...value,
            })),
      }),
  }
}

export default useJoin
