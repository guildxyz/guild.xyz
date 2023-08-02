import useGuild from "components/[guild]/hooks/useGuild"
import useIsV2 from "hooks/useIsV2"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useFetcherWithSign } from "utils/fetcher"

const useReorderRoles = (onClose) => {
  const { id, mutateGuild } = useGuild()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const isV2 = useIsV2()

  const submit = (roleOrdering: Array<{ id: number; position: number }>) => {
    if (!isV2) {
      return fetcherWithSign([
        `/guild/${id}/roles`,
        {
          method: "PATCH",
          body: roleOrdering,
        },
      ])
    }
    return Promise.all(
      roleOrdering.map(({ id: roleId, position }) =>
        fetcherWithSign([
          `/v2/guilds/${id}/roles/${roleId}`,
          { method: "PUT", body: { position } },
        ])
      )
    )
  }

  const { onSubmit, isLoading } = useSubmit(submit, {
    onSuccess: (newRoles) => {
      toast({
        status: "success",
        title: "Successfully edited role order",
      })
      onClose()
      mutateGuild(
        (oldData) => ({
          ...oldData,
          // requirements, and rolePlatforms are not returned, so we need to spread older data too
          // Plus, we don't update all the roles, only the ones that changed, so this also retains those that weren't updated
          roles: (oldData?.roles ?? []).map((prevRole) => ({
            ...prevRole,
            ...(newRoles ?? []).find((newRole) => newRole.id === prevRole.id),
          })),
        }),
        {
          revalidate: false,
        }
      )
    },
    onError: (err) => showErrorToast(err),
  })
  return { onSubmit, isLoading }
}

export default useReorderRoles
