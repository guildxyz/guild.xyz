import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import PermissionSelection from "components/common/GoogleGuildSetup/components/PermissionSelection"
import { useController } from "react-hook-form"

const GoogleCardSettings = () => {
  const { guildPlatform, index } = useRolePlatform()

  useController({
    name: `rolePlatforms.${index}.platformRoleId`,
    rules: {
      value:
        guildPlatform?.platformGuildData?.mimeType ===
        "application/vnd.google-apps.form"
          ? "writer"
          : "reader",
    },
  })

  return (
    <PermissionSelection
      fieldName={`rolePlatforms.${index}.platformRoleId`}
      mimeType={guildPlatform?.platformGuildData?.mimeType}
    />
  )
}

export default GoogleCardSettings
