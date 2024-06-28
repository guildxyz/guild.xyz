import { Logic, Visibility } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

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
    visibility: visibility ?? "PUBLIC",
    visibilityRoleId,
    groupId,
  }

  const methods = useForm<RoleEditFormData>({
    mode: "all",
    defaultValues,
  })

  useEffect(() => {
    const role = roles?.find((r) => r.id === roleId)
    if (!role) return

    methods.reset({
      ...role,
      anyOfNum: role.anyOfNum ?? 1,
    })
  }, [roles, roleId, methods])

  return { ...methods, defaultValues }
}

export default useEditRoleForm
