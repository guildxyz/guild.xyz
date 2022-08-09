import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import { PlatformCardProps } from ".."
import PlatformCard from "../PlatformCard"

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
}

const GoogleCard = ({
  guildPlatform,
  cornerButton,
  children,
}: PlatformCardProps): JSX.Element => {
  const imageBgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <PlatformCard
      type="GOOGLE"
      image={
        guildPlatform.platformGuildData?.iconLink ? (
          <Circle size={10} bgColor={imageBgColor}>
            <Img
              src={guildPlatform.platformGuildData?.iconLink}
              alt={fileTypeNames[guildPlatform.platformGuildData?.mimeType]}
            />
          </Circle>
        ) : (
          "/platforms/google.png"
        )
      }
      name={guildPlatform.platformGuildName}
      info={fileTypeNames[guildPlatform.platformGuildData?.mimeType]}
      cornerButton={cornerButton}
    >
      {children}
    </PlatformCard>
  )
}

export default GoogleCard
export { fileTypeNames }
