import { Schemas } from "@guildxyz/types"
import { useFieldArray } from "react-hook-form"
import { RequirementCreateResponseOutput, RoleFormType } from "types"

const useHandleRequirementState = (methods) => {
  const requirements = methods.watch("requirements")
  const {
    append: addRequirement,
    remove,
    update,
  } = useFieldArray<RoleFormType, "requirements">({
    name: "requirements",
    control: methods.control,
  })
  const freeEntry = !!methods
    .getValues("requirements")
    ?.some(({ type }) => type === "FREE")

  const removeReq = (index: number) => {
    if (requirements.length === 1) {
      remove(0)
      addRequirement({ type: "FREE" })
    } else {
      remove(index)
    }
  }

  const append = (
    req: Schemas["RequirementCreationPayload"]
  ): RequirementCreateResponseOutput => {
    const reqToAdd = { id: Date.now(), ...req }
    if (freeEntry) {
      remove(0)
    }
    addRequirement(reqToAdd)
    // TODO: find a better solution to avoid type casting
    return reqToAdd as RequirementCreateResponseOutput
  }

  return { requirements, append, remove: removeReq, update, freeEntry }
}

export default useHandleRequirementState
