import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const { id, mutateGuild } = useGuild()
  const { account } = useWeb3React()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = (signedValidation: SignedValdation) =>
    fetcher(`/role/${roleId}`, {
      method: "PATCH",
      ...signedValidation,
    })

  const useSubmitResponse = useSubmitWithSign<any>(submit, {
    onSuccess: () => {
      toast({
        title: `Role successfully updated!`,
        status: "success",
      })
      if (onSuccess) onSuccess()
      mutateGuild()
      mutateOptionalAuthSWRKey(`/guild/access/${id}/${account}`)
      mutate(`/statusUpdate/guild/${id}`)
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)

      if (data.logic !== "ANY_OF") delete data.anyOfNum

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useEditRole
