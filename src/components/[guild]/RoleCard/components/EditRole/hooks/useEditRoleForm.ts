import useGuild from "components/[guild]/hooks/useGuild"
import { useForm } from "react-hook-form"
import { Logic, Visibility } from "types"

export type RoleEditFormData = {
  id: number
  name: string
  description: string
  imageUrl: string
  logic: Logic
  visibility: Visibility
  visibilityRoleId?: number
  anyOfNum?: number
  groupId?: number
}

const useEditRoleForm = (roleId: number) => {
  const { roles } = useGuild()
  const {
    id,
    name,
    description,
    imageUrl,
    logic,
    anyOfNum,
    visibility,
    visibilityRoleId,
    groupId,
  } = roles?.find((role) => role.id === roleId) ?? {}

  const defaultValues: RoleEditFormData = {
    id,
    name,
    description,
    imageUrl,
    logic,
    anyOfNum: anyOfNum ?? 1,
    visibility,
    visibilityRoleId,
    groupId,
  }

  const methods = useForm<RoleEditFormData>({
    mode: "all",
    defaultValues,
  })

  return { ...methods, defaultValues }
}

export default useEditRoleForm
