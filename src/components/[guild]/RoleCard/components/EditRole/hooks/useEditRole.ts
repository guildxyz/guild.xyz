import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import replacer from "utils/guildJsonReplacer"
import { RoleEditFormData } from "./useEditRoleForm"

const useEditRole = (roleId: number, onSuccess?: () => void) => {
  const { id, mutateGuild } = useGuild()
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const errorToast = useShowErrorToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const submit = async (data: RoleEditFormData) =>
    fetcherWithSign([
      `/v2/guilds/${id}/roles/${roleId}`,
      { method: "PUT", body: data },
    ])

  const useSubmitResponse = useSubmit(submit, {
    onSuccess: (updatedRole) => {
      if (!updatedRole?.error) {
        onSuccess?.()
      } else {
        if (updatedRole?.error) {
          errorToast({
            error: "Failed to update role",
            correlationId: updatedRole.correlationId,
          })
        }
      }

      mutateGuild(
        (prevGuild) => ({
          ...prevGuild,
          guildPlatforms: [...prevGuild.guildPlatforms],
          roles:
            prevGuild.roles?.map((prevRole) =>
              prevRole.id === roleId
                ? {
                    ...prevRole,
                    ...(updatedRole ?? {}),
                  }
                : prevRole
            ) ?? [],
        }),
        { revalidate: false }
      )

      triggerMembershipUpdate({ roleIds: [roleId] })
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      if (!!data.logic && data.logic !== "ANY_OF") delete data.anyOfNum
      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
    isSigning: null,
    signLoadingText: null,
  }
}

export default useEditRole
