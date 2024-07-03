import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import { RequirementIdMap } from "hooks/useCreateRRR"
import useShowErrorToast from "hooks/useShowErrorToast"
import {
  RequirementCreateResponseOutput,
  RequirementCreationPayloadWithTempID,
} from "types"

import { useFetcherWithSign } from "hooks/useFetcherWithSign"
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
    // We can assign generated IDs to requirements on our frontend, so it's safe to extend this type with an ID
    requirements: RequirementCreationPayloadWithTempID[],
    roleIds: number[]
  ) => {
    const requirementIdMap: RequirementIdMap = {}
    const requirementsToCreate = requirements.filter((req) => req.type !== "FREE")

    const promises = roleIds.flatMap((roleId) =>
      requirementsToCreate.map((req) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
          {
            method: "POST",
            body: preprocessRequirement(req),
          },
        ])
          .then((res: RequirementCreateResponseOutput) => {
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
