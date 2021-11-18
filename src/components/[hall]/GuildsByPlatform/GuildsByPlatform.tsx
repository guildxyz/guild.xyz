import {
  Box,
  Button,
  HStack,
  Tooltip,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import useServerAccess from "components/[guild]/hooks/useServerAccess"
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
  const { active } = useWeb3React()
  const { colorMode } = useColorMode()
  const buttonSize = useBreakpointValue({ base: "sm", sm: "md" })

  const { data: hasAccess, isLoading: isServerAccessLoading } =
    useServerAccess(guildIds)

  return (
    <Card width="full">
      <HStack
        px={{ base: 4, sm: 6 }}
        py={{ base: 2, sm: 4 }}
        alignItems="center"
        justifyContent="space-between"
        bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
        borderBottomWidth={colorMode === "light" ? 1 : 0}
        borderBottomColor={colorMode === "light" ? "gray.200" : undefined}
      >
        <Platform platformType={platformType} platformName={platformName} />
        {!active ? (
          <Tooltip label="Wallet not connected">
            <Box>
              <Button isDisabled size={buttonSize} ml="auto" maxH={10} rounded="xl">
                Join
              </Button>
            </Box>
          </Tooltip>
        ) : (
          <Button
            size={buttonSize}
            colorScheme={hasAccess ? "green" : "gray"}
            ml="auto"
            maxH={10}
            rounded="xl"
            isLoading={isServerAccessLoading}
            isDisabled={!hasAccess}
            loadingText="Checking access"
            isTruncated
          >
            {/* TODO: isMember */}
            {hasAccess ? "Join" : "No access"}
          </Button>
        )}
      </HStack>

      {children}
    </Card>
  )
}

export default GuildsByPlatform
