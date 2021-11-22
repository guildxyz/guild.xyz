import { Flex, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinButton from "components/[guild]/JoinButton/JoinButton"
import { PropsWithChildren } from "react"
import { PlatformName } from "temporaryData/types"
import Platform from "./components/Platform"

type Props = {
  platformType: PlatformName
  platformName: string
  guildIds: Array<number>
}

const GuildsByPlatform = ({
  platformType,
  platformName,
  guildIds,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card width="full">
      <Flex
        px={{ base: 4, sm: 6 }}
        py={{ base: 3, sm: 4 }}
        alignItems="center"
        justifyContent="space-between"
        bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
        borderBottomWidth={colorMode === "light" ? 1 : 0}
        borderBottomColor={colorMode === "light" ? "gray.200" : undefined}
      >
        <Platform platformType={platformType} platformName={platformName} />
        <JoinButton guildIds={guildIds} />
      </Flex>

      {children}
    </Card>
  )
}

export default GuildsByPlatform
