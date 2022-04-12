import { Button, Text, ToastId } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { TwitterLogo } from "phosphor-react"
import { useRef } from "react"
import { useSWRConfig } from "swr"
import { Guild, PlatformName, Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

type FormInputs = {
  platform?: PlatformName
  DISCORD?: { platformId?: string }
  TELEGRAM?: { platformId?: string }
  channelId?: string
}
type RoleOrGuild = Role & Guild & FormInputs & { sign?: boolean }

const useCreate = (onSuccess?: () => void) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const toastIdRef = useRef<ToastId>()
  const { account } = useWeb3React()
  const { id } = useGuild()

  const { mutate } = useSWRConfig()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const isRoleCreate = router.query.guild || router.asPath.includes("guard")

  const fetchData = async ({
    validation,
    data,
  }: WithValidation<RoleOrGuild>): Promise<RoleOrGuild> =>
    fetcher(isRoleCreate ? "/role" : "/guild", {
      validation,
      body: data,
    })

  const useSubmitResponse = useSubmitWithSign<any, RoleOrGuild>(fetchData, {
    onError: (error_) => {
      addDatadogError(
        `${isRoleCreate ? "Role" : "Guild"} creation error`,
        { error: error_ },
        "custom"
      )
      showErrorToast(error_)
    },
    onSuccess: (response_) => {
      addDatadogAction(`Successful ${isRoleCreate ? "role" : "guild"} creation`)
      triggerConfetti()
      if (router.query.guild) {
        toastIdRef.current = toast({
          duration: 8000,
          title: "Role successfully created",
          description: (
            <>
              <Text>Let your guild know by sharing it on Twitter</Text>
              <Button
                as="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I've just added a new role to my guild. Check it out, maybe you have access 😉
guild.xyz/${router.query.guild} @guildxyz`)}`}
                target="_blank"
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
        mutate([`/guild/${router.query.guild}`, undefined])
        mutate(`/guild/access/${id}/${account}`)
      } else if (!router.asPath.includes("guard")) {
        toast({
          title: `Guild successfully created!`,
          description: "You're being redirected to it's page",
          status: "success",
        })
        router.push(`/${response_.urlName}`)
      }

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)

      onSuccess?.()
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data_) => {
      const data = isRoleCreate
        ? {
            ...data_,
            // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
            requirements: preprocessRequirements(data_?.requirements || []),
          }
        : {
            imageUrl: data_.imageUrl,
            name: data_.name,
            platform: data_.platform,
            // Handling TG group ID with and without "-"
            platformId: data_[data_.platform]?.platformId,
            channelId: data_.channelId,
            isGuarded: data_.isGuarded,
            grantAccessToExistingUsers: data_.grantAccessToExistingUsers,
            roles: [
              {
                imageUrl: data_.imageUrl,
                name: "Member",
                requirements: preprocessRequirements(data_?.requirements),
              },
            ],
          }

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreate
