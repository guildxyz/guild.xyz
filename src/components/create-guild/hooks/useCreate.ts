import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"
import { Guild, PlatformName, Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

type FormInputs = {
  addressSignedMessage?: string
  platform?: PlatformName
  DISCORD?: { platformId?: string }
  TELEGRAM?: { platformId?: string }
  channelId?: string
}
type RoleOrGuild = Role & Guild & FormInputs

const useCreate = () => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const { account } = useWeb3React()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const fetchData = (data_: RoleOrGuild): Promise<RoleOrGuild> =>
    fetcher(router.query.guild ? "/role" : "/guild", {
      body: router.query.guild
        ? {
            ...data_,
            // Mapping requirements in order to properly send "interval-like" NFT attribute values to the API
            requirements: preprocessRequirements(data_?.requirements || []),
          }
        : {
            // Doing it this way for now, but maybe we should register `roles.0.requirements.*` inputs in the forms later
            addressSignedMessage: data_.addressSignedMessage,
            imageUrl: data_.imageUrl,
            name: data_.name,
            urlName: data_.urlName,
            description: data_.description,
            platform: data_.platform,
            // Handling TG group ID with and without "-"
            platformId: data_[data_.platform]?.platformId,
            channelId: data_.channelId,
            roles: [
              {
                ...data_,
                name: `Member`,
                requirements: preprocessRequirements(data_?.requirements || []),
              },
            ],
          },
      replacer,
    })

  return useSubmitWithSign<any, RoleOrGuild>(fetchData, {
    onError: (error_) => {
      addDatadogError(
        `${router.query.guild ? "Role" : "Guild"} creation error`,
        { error: error_ },
        "custom"
      )
      showErrorToast(error_)
    },
    onSuccess: (response_) => {
      addDatadogAction(
        `Successful ${router.query.guild ? "role" : "guild"} creation`
      )
      triggerConfetti()
      if (router.query.guild) {
        toast({
          title: `Role successfully created!`,
          status: "success",
        })
        mutate(`/guild/urlName/${router.query.guild}`)
      } else {
        toast({
          title: `Guild successfully created!`,
          description: "You're being redirected to it's page",
          status: "success",
        })
        router.push(`/${response_.urlName}`)
      }
      // refetch guilds to include the new one / new role on the home page
      // the query will be the default one, which is ?order=member
      mutate(`/guild/address/${account}?order=members`)
      mutate(`/guild?order=members`)
    },
  })
}

export default useCreate
