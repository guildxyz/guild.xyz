import { Schemas, Visibility } from "@guildxyz/types"
import { RoleFormType } from "types"

export type AddRewardForm = {
  // TODO: we could simplify the form - we don't need a rolePlatforms array here, we only need one rolePlatform
  rolePlatforms: RoleFormType["rolePlatforms"][number][]
  // TODO: use proper types, e.g. name & symbol shouldn't be required on this type
  requirements?: Schemas["RequirementCreationPayload"][]
  roleIds?: number[]
  visibility: Visibility
  roleName?: string // Name for role, if new role is created with reward
}
