import { RequirementType } from "requirements/types"

export type JumperRequirementType = Extract<RequirementType, `JUMPER_${string}`>
