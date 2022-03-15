import { HStack, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import JoinButton from "components/[guild]/RolesByPlatform/components/JoinButton"
import { PropsWithChildren } from "react"
import { PlatformName } from "types"
import Platform from "./components/Platform"

type Props = {
  platformType: PlatformName
  platformName: string
  roleIds: Array<number>
}

const RolesByPlatform = ({
  platformType,
  platformName,
  roleIds,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card width="full">
      <HStack
        px={{ base: 4, sm: 6 }}
        py={{ base: 3, sm: 4 }}
        justifyContent={platformType?.length > 0 ? "space-between" : "end"}
        bgColor={colorMode === "light" ? "white" : "blackAlpha.300"}
        borderBottomWidth={colorMode === "light" ? 1 : 0}
        borderBottomColor={colorMode === "light" ? "gray.200" : undefined}
      >
        {platformType?.length > 0 && (
          <Platform type={platformType as PlatformName} name={platformName} />
        )}
        <JoinButton platform={platformType} roleIds={roleIds} />
      </HStack>

      {children}
    </Card>
  )
}

export default RolesByPlatform
