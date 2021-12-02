import { Flex, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinButton from "components/[guild]/JoinButton"
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
        <Flex maxW={{ base: "55%", sm: "none" }}>
          <Platform type={platformType} name={platformName} />
        </Flex>
        <JoinButton guildIds={guildIds} />
      </Flex>

      {children}
    </Card>
  )
}

export default GuildsByPlatform
