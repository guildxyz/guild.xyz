import { Button, HStack, useBreakpointValue, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"
import { PlatformName } from "temporaryData/types"
import Platform from "./components/Platform"

type Props = {
  platformType: PlatformName
  platformName: string
}

const GuildsByPlatform = ({
  platformType,
  platformName,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()
  const buttonSize = useBreakpointValue({ base: "sm", sm: "md" })

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
        <Button
          size={buttonSize}
          colorScheme="green"
          ml="auto"
          maxH={10}
          rounded="xl"
        >
          Join
        </Button>
      </HStack>

      {children}
    </Card>
  )
}

export default GuildsByPlatform
