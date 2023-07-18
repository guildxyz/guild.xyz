import useGuild from "components/[guild]/hooks/useGuild"
import useGateables from "hooks/useGateables"
import useIsV2 from "hooks/useIsV2"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useFieldArray, useFormContext, useFormState } from "react-hook-form"
import fetcher from "utils/fetcher"
import { useRolePlatform } from "../../RolePlatformProvider"

const useRemovePlatform = ({ onSuccess }: any) => {
  const { id, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const {
    index,
    roleId,
    guildPlatform,
    id: rolePlatformId,
    guildPlatformId,
  } = useRolePlatform()
  const { dirtyFields } = useFormState()
  const { reset } = useFormContext()
  const { remove } = useFieldArray({
    name: "rolePlatforms",
  })
  const isV2 = useIsV2()
  const endpoint = isV2
    ? `/v2/guilds/${id}/roles/${roleId}/role-platforms/${rolePlatformId}`
    : `/role/${roleId}/platform/${guildPlatformId}`

  const { mutate: mutateGateables } = useGateables(guildPlatform?.platformId)

  const submit = async (signedValidation: SignedValdation) =>
    fetcher(endpoint, {
      method: "DELETE",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    forcePrompt: true,
    onSuccess: () => {
      toast({
        title: `Platform removed!`,
        status: "success",
      })
      remove(index)
      onSuccess?.()
      if (!Object.keys(dirtyFields).length) reset(undefined, { keepValues: true })

      if (isV2) {
        // Mutation filters out deleted rolePlatforms
        mutateGuild(
          (prevGuild) => ({
            ...prevGuild,
            roles:
              prevGuild.roles?.map((role) =>
                role.id === roleId
                  ? {
                      ...role,
                      rolePlatforms:
                        role.rolePlatforms?.filter(
                          (rolePlatform) => rolePlatform.id !== rolePlatformId
                        ) ?? [],
                    }
                  : role
              ) ?? [],
          }),
          { revalidate: false }
        )
      } else {
        mutateGuild()
      }
      mutateGateables()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useRemovePlatform
