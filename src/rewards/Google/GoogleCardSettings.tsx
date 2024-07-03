import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import PermissionSelection from "components/common/GoogleGuildSetup/components/PermissionSelection"
import { useController } from "react-hook-form"

const GoogleCardSettings = () => {
  const { guildPlatform } = useRolePlatform()

  useController({
    name: `platformRoleId`,
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
      fieldName={`platformRoleId`}
      mimeType={guildPlatform?.platformGuildData?.mimeType}
    />
  )
}

export default GoogleCardSettings
