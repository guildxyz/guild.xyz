import { useWeb3React } from "@web3-react/core"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useUploadImage from "hooks/useUploadImage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { Guild, PlatformName, Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

type FormInputs = {
  addressSignedMessage?: string
  platform?: PlatformName
  DISCORD?: { platformId?: string }
  DISCORD_CUSTOM?: { platformId?: string }
  TELEGRAM?: { platformId?: string }
  channelId?: string
}
type RoleOrGuild = Role & Guild & FormInputs

const useCreate = () => {
  const { account } = useWeb3React()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()
  const [data, setData] = useState<RoleOrGuild>()

  const fetchData = (data_: RoleOrGuild): Promise<RoleOrGuild> =>
    fetcher(router.query.guild ? "/role" : "/guild", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        router.query.guild
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
                  requirements: preprocessRequirements(data_?.requirements || []),
                },
              ],
            },
        replacer
      ),
    })

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<
    RoleOrGuild,
    RoleOrGuild
  >(fetchData, {
    onError: (error_) => showErrorToast(error_),
    onSuccess: (response_) => {
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

  const {
    onSubmit: onSubmitImage,
    response: imageResponse,
    error: imageError,
    isLoading: isImageLoading,
  } = useUploadImage()

  useEffect(() => {
    if (imageResponse?.publicUrl)
      onSubmit({
        ...data,
        imageUrl: imageResponse.publicUrl,
      })
  }, [imageResponse])

  return {
    onSubmit: (_data) => {
      if (_data.customImage?.length) {
        setData(_data)
        onSubmitImage(_data.customImage)
      } else onSubmit(_data)
    },
    error: error || imageError,
    isImageLoading,
    isLoading,
    response,
  }
}

export default useCreate
