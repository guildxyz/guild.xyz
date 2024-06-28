import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { RequirementCreateResponseOutput } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

const useEditRequirement = (
  roleId: number,
  config?: {
    onSuccess?: (editedRequirement: RequirementCreateResponseOutput) => void
  }
) => {
  const { id: guildId } = useGuild()
  const { mutate: mutateRequirements } = useRequirements(roleId)

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const fetcherWithSign = useFetcherWithSign()
  const editRequirement = async (
    data?: Schemas["RequirementUpdatePayload"] & { id: number }
  ): Promise<RequirementCreateResponseOutput> =>
    fetcherWithSign([
      `/v2/guilds/${guildId}/roles/${roleId}/requirements/${data?.id}`,
      {
        method: "PUT",
        body: preprocessRequirement(data),
      },
    ])

  return useSubmit<
    Schemas["RequirementUpdatePayload"] & { id: number },
    RequirementCreateResponseOutput
  >(editRequirement, {
    onSuccess: (editedRequirement) => {
      if (
        (editedRequirement.type === "ALLOWLIST" ||
          editedRequirement.type === "ALLOWLIST_EMAIL") &&
        editedRequirement.data?.fileId
      ) {
        // TODO: add the "status" prop to the schema
        ;(editedRequirement.data as any).status = "IN-PROGRESS"
      }

      toast({
        status: "success",
        title: "Successfully updated requirement",
      })

      mutateRequirements(
        (prevRequirements) =>
          prevRequirements.map((requirement) => {
            if (requirement.id !== editedRequirement.id) return requirement
            // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
            const { deletedRequirements: _, ...req } = editedRequirement
            return req
          }),
        { revalidate: false }
      )

      config?.onSuccess?.(editedRequirement)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditRequirement
