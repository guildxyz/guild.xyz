import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { GuildPlatformWithOptionalId, PlatformName } from "types"

const fileTypeNames = {
  "application/vnd.google-apps.audio": "Audio",
  "application/vnd.google-apps.document": "Document",
  "application/vnd.google-apps.drive-sdk": "3rd party shortcut",
  "application/vnd.google-apps.drawing": "Google Drawing",
  "application/vnd.google-apps.file": "Google Drive file",
  "application/vnd.google-apps.folder": "Google Drive folder",
  "application/vnd.google-apps.form": "Google Forms",
  "application/vnd.google-apps.fusiontable": "Google Fusion Tables",
  "application/vnd.google-apps.jam": "Google Jamboard",
  "application/vnd.google-apps.map": "Google My Maps",
  "application/vnd.google-apps.photo": "Photo",
  "application/vnd.google-apps.presentation": "Google Slides",
  "application/vnd.google-apps.script": "Google Apps Scripts",
  "application/vnd.google-apps.shortcut": "Shortcut",
  "application/vnd.google-apps.site": "Google Sites",
  "application/vnd.google-apps.spreadsheet": "Google Sheets",
  "application/vnd.google-apps.unknown": "Unknown file type",
  "application/vnd.google-apps.video": "Video",
  "video/mp4": "Video",
}

const getFileTypeName = (fileType: string) => {
  const staticFileType = fileTypeNames[fileType]
  if (!staticFileType && fileType?.includes("video")) return "Video"
  return staticFileType
}

const useGoogleCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const rolePlatform = useRolePlatform()
  const imageBgColor = useColorModeValue("gray.100", "gray.800")

  const accessInfo = rolePlatform
    ? `, ${rolePlatform.platformRoleId || "reader"} access`
    : ""

  return {
    type: "GOOGLE" as PlatformName,
    image: guildPlatform.platformGuildData?.iconLink ? (
      <Circle size={10} bgColor={imageBgColor}>
        <Img
          src={guildPlatform.platformGuildData?.iconLink}
          alt={fileTypeNames[guildPlatform.platformGuildData?.mimeType]}
        />
      </Circle>
    ) : (
      "/platforms/google.png"
    ),
    name: guildPlatform.platformGuildName,
    info: `${getFileTypeName(
      guildPlatform.platformGuildData?.mimeType
    )}${accessInfo}`,
  }
}

export default useGoogleCardProps
export { fileTypeNames }
