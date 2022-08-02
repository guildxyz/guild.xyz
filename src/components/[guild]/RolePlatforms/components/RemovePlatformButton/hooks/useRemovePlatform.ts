import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFieldArray } from "react-hook-form"
import { useSWRConfig } from "swr"
import fetcher from "utils/fetcher"
import { useRolePlatform } from "../../RolePlatformProvider"

type Data = {
  removePlatformAccess: boolean
}

const useRemovePlatform = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { index, guildPlatformId, roleId } = useRolePlatform()
  const { remove } = useFieldArray({
    name: "rolePlatforms",
  })

  const guild = useGuild()

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher(`/role/${roleId}/platform/${guildPlatformId}`, {
      method: "DELETE",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      // toast({
      //   title: `Platform removed!`,
      //   status: "success",
      // })
      remove(index)

      // mutate([`/guild/${guild?.urlName}`, undefined])
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemovePlatform
