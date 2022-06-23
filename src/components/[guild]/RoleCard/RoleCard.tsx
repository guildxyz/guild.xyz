import {
  Circle,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import dynamic from "next/dynamic"
import { DiscordLogo, TelegramLogo, Users } from "phosphor-react"
import { Role } from "types"
import useGuild from "../hooks/useGuild"
import Requirements from "../Requirements"
import AccessIndicator from "../RolesByPlatform/components/RoleListItem/components/AccessIndicator"

type Props = {
  role: Role
}

const DynamicEditRole = dynamic(
  () => import("../RolesByPlatform/components/RoleListItem/components/EditRole"),
  {
    ssr: false,
  }
)

const RoleCard = ({ role }: Props) => {
  const { platforms } = useGuild()
  const rolePlatformType = platforms?.find(
    (platform) => platform.id === role.platforms?.[0]?.platformId
  )?.type
  const rolePlatformName = platforms?.find(
    (platform) => platform.id === role.platforms?.[0]?.platformId
  )?.platformName

  return (
    <Card key={role.id}>
      <SimpleGrid columns={[1, null, 2]}>
        <Flex
          direction="column"
          p={5}
          borderRightWidth={{ base: 0, md: 1 }}
          borderRightColor="gray.600"
        >
          <Stack direction="row" justifyContent="space-between" mb={5}>
            <HStack spacing={4}>
              <GuildLogo imageUrl={role.imageUrl} size={52} iconSize={12} />
              <Heading as="h3" fontSize="xl" fontFamily="display">
                {role.name}
              </Heading>
            </HStack>

            <HStack>
              <Icon as={Users} textColor="gray" />
              <Text as="span" color="gray" fontSize="sm">
                {role.memberCount >= 1000
                  ? `${(role.memberCount / 1000).toFixed(1)}k`
                  : role.memberCount}
              </Text>
            </HStack>
          </Stack>

          {role.description && <Text mb={6}>{role.description}</Text>}

          {/* TODO for multiplatform: map role.platforms here */}
          <HStack mt="auto">
            <Circle
              size={6}
              bgColor={
                rolePlatformType === "DISCORD" ? "DISCORD.500" : "TELEGRAM.500"
              }
            >
              <Icon
                as={rolePlatformType === "DISCORD" ? DiscordLogo : TelegramLogo}
                boxSize={4}
              />
            </Circle>

            <Text as="span">
              Role in: <b>{rolePlatformName}</b>
            </Text>
          </HStack>
        </Flex>

        <Flex
          direction="column"
          p={5}
          pb={{ base: 14, md: 5 }}
          position="relative"
          bgColor="blackAlpha.300"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            <Text
              as="span"
              fontSize="xs"
              fontWeight="bold"
              color="gray"
              textTransform="uppercase"
            >
              Requirements to qualify
            </Text>

            <AccessIndicator roleId={role.id} />
          </Stack>

          <Requirements requirements={role.requirements} logic={role.logic} />
        </Flex>
      </SimpleGrid>
    </Card>
  )
}

export default RoleCard
