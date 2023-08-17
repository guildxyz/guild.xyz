import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import useGateables from "hooks/useGateables"
import { useWatch } from "react-hook-form"
import { PlatformType } from "types"
import PlatformPreview from "./PlatformPreview"

const GooglePreview = (): JSX.Element => {
  const circleBg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const documentId = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildId",
  })

  const { gateables, isLoading } = useGateables(PlatformType.GOOGLE)

  const doc = gateables?.find((r) => r.platformGuildId === documentId)

  useSetRoleImageAndNameFromPlatformData("/platforms/google.png", doc?.name)

  return (
    <PlatformPreview
      type="GOOGLE"
      isLoading={isLoading}
      name={doc?.name}
      image={
        doc?.iconLink && (
          <Circle
            size={12}
            bgColor={circleBg}
            alignItems="center"
            justifyContent="center"
          >
            <Img boxSize={5} src={doc.iconLink} alt={doc?.name} />
          </Circle>
        )
      }
    />
  )
}

export default GooglePreview
