import { useFieldArray } from "react-hook-form"
import { Requirement, RoleFormType } from "types"
import { uuidv7 } from "uuidv7"

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

  const append = (req: Requirement) => {
    const reqToAdd = { id: uuidv7(), ...req }
    if (freeEntry) {
      remove(0)
    }
    addRequirement(reqToAdd)
  }

  return { requirements, append, remove: removeReq, update, freeEntry }
}

export default useHandleRequirementState
