import {
  Box,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Role } from "types"
import parseDescription from "utils/parseDescription"
import useGuildPermission from "../hooks/useGuildPermission"
import Requirements from "../Requirements"
import AccessIndicator from "./components/AccessIndicator"
import MemberCount from "./components/MemberCount"
import Reward from "./components/Reward"

type Props = {
  role: Role
}

const RoleCard = ({ role }: Props) => {
  const { isAdmin } = useGuildPermission()

  const [DynamicEditRole, setDynamicEditRole] = useState(null)

  useEffect(() => {
    if (isAdmin) {
      const EditRole = dynamic(() => import("./components/EditRole"))
      setDynamicEditRole(EditRole)
    } else {
      setDynamicEditRole(null)
    }
  }, [isAdmin])

  const { colorMode } = useColorMode()
  const iconSize = useBreakpointValue({ base: 48, md: 52 })

  return (
    <Card>
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Flex
          direction="column"
          p={5}
          borderRightWidth={{ base: 0, md: 1 }}
          borderRightColor={colorMode === "light" ? "gray.200" : "gray.600"}
        >
          <HStack justifyContent="space-between" mb={6} spacing={4}>
            <HStack spacing={4}>
              <GuildLogo imageUrl={role.imageUrl} size={iconSize} iconSize={12} />
              <Heading as="h3" fontSize="xl" fontFamily="display">
                {role.name}
              </Heading>
            </HStack>

            <MemberCount memberCount={role.memberCount} />

            {DynamicEditRole && (
              <>
                <Spacer />
                <DynamicEditRole roleId={role.id} />
              </>
            )}
          </HStack>

          {role.description && (
            <Text mb={6} wordBreak="break-word">
              {parseDescription(role.description)}
            </Text>
          )}

          <Box mt="auto">
            {role.rolePlatforms?.map((platform) => (
              <Reward key={platform.guildPlatformId} platform={platform} />
            ))}
          </Box>
        </Flex>

        <Flex
          direction="column"
          p={5}
          pb={{ base: 14, md: 5 }}
          position="relative"
          bgColor={colorMode === "light" ? "gray.50" : "blackAlpha.300"}
        >
          <HStack mb={{ base: 4, md: 6 }}>
            <Text
              as="span"
              mt="1"
              mr="2"
              fontSize="xs"
              fontWeight="bold"
              color="gray"
              textTransform="uppercase"
              isTruncated
            >
              Requirements to qualify
            </Text>
            <Spacer />
            <AccessIndicator roleId={role.id} />
          </HStack>

          <Requirements requirements={role.requirements} logic={role.logic} />
        </Flex>
      </SimpleGrid>
    </Card>
  )
}

export default RoleCard
