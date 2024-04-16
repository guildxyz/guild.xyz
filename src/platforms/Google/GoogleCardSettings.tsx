import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import PermissionSelection from "components/common/GoogleGuildSetup/components/PermissionSelection"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

const GoogleCardSettings = () => {
  const { guildPlatform, index } = useRolePlatform()
  const { register } = useFormContext()

  useEffect(() => {
    if (!register) return
    register(`rolePlatforms.${index}.platformRoleId`, {
      value:
        guildPlatform?.platformGuildData?.mimeType ===
        "application/vnd.google-apps.form"
          ? "writer"
          : "reader",
    })
  }, [register])

  return (
    <PermissionSelection
      fieldName={`rolePlatforms.${index}.platformRoleId`}
      mimeType={guildPlatform?.platformGuildData?.mimeType}
    />
  )
}

export default GoogleCardSettings
