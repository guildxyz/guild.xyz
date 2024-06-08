import useGuild from "components/[guild]/hooks/useGuild"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import fetcher from "utils/fetcher"

const useExportMembers = (mutate) => {
  const { id } = useGuild()
  const toast = useToast()
  const router = useRouter()

  const { onSubmit, isLoading, ...rest } = useSubmitWithSign(
    (signedValidation: SignedValidation) =>
      fetcher(`/v2/crm/guilds/${id}/exports`, {
        method: "POST",
        ...signedValidation,
      }),
    {
      onSuccess: (res) => {
        toast({
          status: "success",
          title: "Export started",
          description:
            "It might take some time to finish based on the number of members",
        })
        mutate((prevExports) => (!prevExports ? [res] : [res, ...prevExports]))
      },
      onError: (err) => {
        toast({
          status: "error",
          title: "Couldn't start export",
        })
      },
    }
  )

  return {
    startExport: () =>
      onSubmit({ ...router.query, roleIds: stringsToNumber(router.query.roleIds) }),
    isStartExportLoading: isLoading,
    ...rest,
  }
}

const stringsToNumber = (strings: string | string[]) => {
  if (!strings) return undefined
  if (Array.isArray(strings)) return strings.map((string) => parseInt(string))
  return parseInt(strings)
}

export default useExportMembers
