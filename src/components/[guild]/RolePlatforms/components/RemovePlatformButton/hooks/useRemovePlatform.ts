import useGuild from "components/[guild]/hooks/useGuild"
import useGateables from "hooks/useGateables"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFieldArray, useFormContext, useFormState } from "react-hook-form"
import fetcher from "utils/fetcher"
import { useRolePlatform } from "../../RolePlatformProvider"

type Data = {
  removePlatformAccess: boolean
}

const useRemovePlatform = () => {
  const { mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { index, guildPlatformId, roleId, guildPlatform } = useRolePlatform()
  const { dirtyFields } = useFormState()
  const { reset } = useFormContext()
  const { remove } = useFieldArray({
    name: "rolePlatforms",
  })

  const { mutate: mutateGateables } = useGateables(guildPlatform?.platformName)

  const submit = async ({ validation, data }: WithValidation<Data>) =>
    fetcher(`/role/${roleId}/platform/${guildPlatformId}`, {
      method: "DELETE",
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Platform removed!`,
        status: "success",
      })
      remove(index)
      if (!Object.keys(dirtyFields).length) reset(undefined, { keepValues: true })

      mutateGuild()
      mutateGateables()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemovePlatform
