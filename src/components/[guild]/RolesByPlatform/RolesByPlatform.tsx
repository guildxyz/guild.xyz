// legacy, will delete

import { HStack, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinButton from "components/[guild]/RolesByPlatform/components/JoinButton"
import { PropsWithChildren } from "react"
import { PlatformType } from "types"

type Props = {
  platformId: number
  platformType: PlatformType
  platformName: string
}

const RolesByPlatform = ({
  platformId,
  platformType,
  platformName,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card width="full">
      <HStack
        px={{ base: 4, sm: 6 }}
        py={{ base: 3, sm: 4 }}
        justifyContent={platformType ? "space-between" : "end"}
        bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
        borderBottomWidth={colorMode === "light" ? 1 : 0}
        borderBottomColor={colorMode === "light" ? "gray.200" : undefined}
      >
        <JoinButton platform={platformType} />
      </HStack>

      {children}
    </Card>
  )
}

export default RolesByPlatform
