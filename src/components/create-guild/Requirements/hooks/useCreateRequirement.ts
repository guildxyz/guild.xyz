import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { useState } from "react"
import { Requirement } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

const useCreateRequirement = (
  roleId: number,
  config?: { onSuccess?: () => void }
) => {
  const { id: guildId } = useGuild()
  const { mutate: mutateRequirements } = useRequirements(roleId)
  const showErrorToast = useShowErrorToast()

  const fetcherWithSign = useFetcherWithSign()
  const createRequirement = async (body: Requirement): Promise<Requirement> =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
      {
        method: "POST",
        body: preprocessRequirement(body),
      },
    ])

  return useSubmit<
    Omit<Requirement, "id" | "roleId" | "name" | "symbol">,
    Requirement & { deletedRequirements?: number[] }
  >(createRequirement, {
    onSuccess: (response) => {
      mutateRequirements(
        (prevRequirements) => [
          ...prevRequirements.filter((req) =>
            Array.isArray(response.deletedRequirements)
              ? !response.deletedRequirements.includes(req.id)
              : true
          ),
          response,
        ],
        { revalidate: false }
      )

      config?.onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useCreateRequirement

const useCreateRequirementForRole = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()

  const fetcherWithSign = useFetcherWithSign()

  const onSubmit = async ({
    requirement,
    roleId,
    onSuccess,
    onError,
  }: {
    requirement: Requirement
    roleId: number
    onSuccess: (req: Requirement) => void
    onError: (error: any) => void
  }) => {
    setIsLoading(true)

    const submitCreate = async (): Promise<Requirement> =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
        {
          method: "POST",
          body: preprocessRequirement(requirement),
        },
      ])

    return submitCreate()
      .then((req) => {
        setIsLoading(false)
        onSuccess(req)
      })
      .catch((error) => {
        setIsLoading(false)
        showErrorToast(error)
        onError(error)
      })
      .finally(() => setIsLoading(false))
  }

  return { onSubmit, isLoading }
}

export { useCreateRequirementForRole }
