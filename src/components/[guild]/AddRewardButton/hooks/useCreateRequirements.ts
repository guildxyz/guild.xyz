import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { RequirementIdMap } from "hooks/useCreateRRR"
import useShowErrorToast from "hooks/useShowErrorToast"

import { Requirement } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

const useCreateRequirements = () => {
  const { id: guildId } = useGuild()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()
  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    hook: "useCreateRequirements",
  }

  const createRequirements = async (
    requirements: Partial<Requirement>[],
    roleIds: number[]
  ) => {
    const requirementIdMap: RequirementIdMap = {}

    const promises = roleIds.flatMap((roleId) =>
      requirements.map((req) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
          {
            method: "POST",
            body: preprocessRequirement(req),
          },
        ])
          .then((res) => {
            if (!requirementIdMap[req.id]) requirementIdMap[req.id] = {}
            requirementIdMap[req.id][roleId] = res.id
            return { status: "fulfilled", result: res }
          })
          .catch((error) => {
            showErrorToast(`Failed to create a requirement (${req.type})`)
            captureEvent("Failed to create requirement", {
              ...postHogOptions,
              requirement: req,
              roleId,
              error,
            })
            console.error(error)
            return { status: "rejected", result: error }
          })
      )
    )

    const results = await Promise.all(promises)
    const createdRequirements = results
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.result)

    return { createdRequirements, requirementIdMap }
  }

  return {
    createRequirements,
  }
}

export default useCreateRequirements
