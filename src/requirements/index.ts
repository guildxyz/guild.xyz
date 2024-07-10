import REQUIREMENTS_DATA from "./requirements"
import { RequirementData, RequirementType } from "./types"

// transform it to an object with types as keys so we don't have to use .find() every time
const REQUIREMENTS: Record<RequirementType, RequirementData> =
  REQUIREMENTS_DATA.reduce(
    (acc, curr) => (curr.types.map((type) => (acc[type] = curr)), acc),
    {} as any
  )

export default REQUIREMENTS
export { REQUIREMENTS_DATA }
