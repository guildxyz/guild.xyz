import {
  Box,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import dynamic from "next/dynamic"
import { memo } from "react"
import { Role } from "types"
import parseDescription from "utils/parseDescription"
import useGuildPermission from "../hooks/useGuildPermission"
import RoleRequirements from "../Requirements"
import AccessIndicator from "./components/AccessIndicator"
import MemberCount from "./components/MemberCount"
import Reward from "./components/Reward"

type Props = {
  role: Role
}

const DynamicEditRole = dynamic(() => import("./components/EditRole"))

const RoleCard = memo(({ role }: Props) => {
  const { isAdmin } = useGuildPermission()

  const { colorMode } = useColorMode()

  return (
    <Card
      id={`role-${role.id}`}
      scrollMarginTop={"calc(var(--chakra-space-12) + var(--chakra-space-6))"}
      // scrollMarginTop doesn't work with overflow="hidden"
      overflow="clip"
      sx={{
        ":target": {
          boxShadow: "var(--chakra-shadows-outline)",
        },
      }}
      onClick={() => {
        if (window.location.hash === `#role-${role.id}`) window.location.hash = "!"
      }}
    >
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Flex
          direction="column"
          p={5}
          borderRightWidth={{ base: 0, md: 1 }}
          borderRightColor={colorMode === "light" ? "gray.200" : "gray.600"}
        >
          <HStack justifyContent="space-between" mb={6} spacing={3}>
            <HStack spacing={4}>
              <GuildLogo
                imageUrl={role.imageUrl}
                size={{ base: "48px", md: "52px" }}
              />
              <Heading as="h3" fontSize="xl" fontFamily="display">
                {role.name}
              </Heading>
            </HStack>
            <MemberCount memberCount={role.memberCount} roleId={role.id} />
            {isAdmin && (
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
              <Reward
                key={platform.guildPlatformId}
                platform={platform}
                role={role}
              />
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
              noOfLines={1}
            >
              Requirements to qualify
            </Text>
            <Spacer />
            <AccessIndicator roleId={role.id} />
          </HStack>
          <RoleRequirements role={role} />
        </Flex>
      </SimpleGrid>
    </Card>
  )
})

export default RoleCard
