import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"

export const useReorderRequirements = (onClose: () => void, roleId: number) => {
  const { id: guildId, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const submit = (requirementOrdering: Array<{ id: number; position: number }>) =>
    Promise.all(
      requirementOrdering.map(({ id: requirementId, position }) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/roles/${roleId}/requirements/${requirementId}`,
          { method: "PUT", body: { position } },
        ])
      )
    )

  const { onSubmit, isLoading } = useSubmit(submit, {
    onSuccess: (newRequirements) => {
      toast({
        status: "success",
        title: "Successfully edited requirement order",
      })
      onClose()
      mutateGuild(
        (oldData) =>
          oldData && {
            ...oldData,
            roles: oldData.roles.map((role) =>
              role.id === roleId
                ? {
                    ...role,
                    requirements: (role.requirements ?? []).map(
                      (prevRequirement) => ({
                        ...prevRequirement,
                        ...(newRequirements ?? []).find(
                          (newRequirement) =>
                            newRequirement.id === prevRequirement.id
                        ),
                      })
                    ),
                  }
                : role
            ),
          },
        {
          revalidate: false,
        }
      )
    },
    onError: (error) => showErrorToast(error),
  })
  return { onSubmit, isLoading }
}
