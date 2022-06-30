import { HStack, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinButton from "components/[guild]/RolesByPlatform/components/JoinButton"
import { PropsWithChildren } from "react"
import {
  Platform as GuildPlatformType,
  Platform as PlatformObjectType,
  PlatformName,
  PlatformType,
} from "types"
import DiscordPlatform from "./components/DiscordPlatform"
import TelegramPlatform from "./components/TelegramPlatform"

type Props = {
  platform: GuildPlatformType
}

const platfromComponents: Record<
  Exclude<PlatformName, "">,
  (props: { platform: PlatformObjectType }) => JSX.Element
> = {
  DISCORD: DiscordPlatform,
  TELEGRAM: TelegramPlatform,
}

const RolesByPlatform = ({
  platform,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  const Platform = platfromComponents[PlatformType[platform.platformId]]

  return (
    <Card width="full">
      <HStack
        px={{ base: 4, sm: 6 }}
        py={{ base: 3, sm: 4 }}
        justifyContent={platform.platformId >= 0 ? "space-between" : "end"}
        bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
        borderBottomWidth={colorMode === "light" ? 1 : 0}
        borderBottomColor={colorMode === "light" ? "gray.200" : undefined}
      >
        {platform.platformId > 0 && <Platform platform={platform} />}
        <JoinButton platform={platform.platformId} />
      </HStack>

      {children}
    </Card>
  )
}

export default RolesByPlatform
