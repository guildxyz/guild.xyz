import {
  HStack,
  Heading,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react"
import { Role as RoleType } from "@guildxyz/types"
import GuildLogo from "components/common/GuildLogo"
import { Users } from "phosphor-react"
import { Item } from "../types"

type Props = {
  guildId: number
  roleId: number
}

// const getRole = async (guildId: number, roleId: number): Promise<RoleType> =>
//   fetch(
//     `${process.env.NEXT_PUBLIC_API.replace(
//       "v1",
//       "v2"
//     )}/guilds/${guildId}/roles/${roleId}`,
//   ).then((res) => res.json())

/**
 * Seems like we can't really use container queries in Chakra UI, so we'll just use
 * the width/height from the props
 */

const role: Omit<RoleType, "createdAt" | "updatedAt"> = {
  id: 90516,
  name: "Verified Coinbase User",
  description:
    "Verify your wallet through Coinbase Verifications - https://www.coinbase.com/onchain-verify",
  imageUrl:
    "https://guild-xyz.mypinata.cloud/ipfs/QmSCgK9QStzHw7nEanQwkmnY4do6HFPUVLhVXy1M1fWHXF",
  logic: "AND",
  memberCount: 7545,
  visibility: "PUBLIC",
  hideFromEyes: false,
  position: 0,
  anyOfNum: null,
}

const Role = ({
  desktop: { width, height: rawHeight },
  data: {},
}: Omit<Item, "id" | "type">) => {
  const height = typeof rawHeight === "number" ? rawHeight : 1
  const roleHeaderStackDirection: StackProps["direction"] =
    width < 3 || height < 2 ? "column" : "row"

  return (
    <Stack p={4} h="full">
      <Stack spacing={4} h="full">
        <Stack
          direction={roleHeaderStackDirection}
          spacing={2}
          justifyContent={height < 2 ? "space-between" : "start"}
          h={height < 2 ? "full" : "auto"}
        >
          <GuildLogo imageUrl={role.imageUrl} size={12} />
          <Stack spacing={0}>
            <HStack>
              <Text colorScheme="gray" fontSize="sm" fontWeight="semibold">
                Role
              </Text>
              <HStack
                color="GrayText"
                fontSize="xs"
                fontWeight="semibold"
                spacing={0.5}
              >
                <Icon as={Users} weight="bold" />
                <Text as="span">
                  {new Intl.NumberFormat("en", { notation: "compact" }).format(
                    role.memberCount
                  )}
                </Text>
              </HStack>
            </HStack>
            <Heading as="h3" fontSize="md" fontWeight="extrabold" noOfLines={2}>
              {role.name}
            </Heading>
          </Stack>
        </Stack>

        {height > 1 && (
          <Text noOfLines={4} wordBreak="break-word">
            {role.description}
          </Text>
        )}
      </Stack>
    </Stack>
  )
}

const RoleSkeleton = ({
  desktop: { width, height: rawHeight },
}: Omit<Item, "id" | "type" | "data">) => {
  const height = typeof rawHeight === "number" ? rawHeight : 1
  const roleHeaderStackDirection: StackProps["direction"] =
    width < 3 || height < 2 ? "column" : "row"

  return (
    <Stack p={4} h="full">
      <Stack spacing={4} h="full">
        <Stack
          direction={roleHeaderStackDirection}
          spacing={2}
          justifyContent={height < 2 ? "space-between" : "start"}
          h={height < 2 ? "full" : "auto"}
        >
          <SkeletonCircle boxSize={12} />
          <Stack spacing={1}>
            <HStack>
              <Skeleton h={4} w={12} />
              <HStack
                color="GrayText"
                fontSize="xs"
                fontWeight="semibold"
                spacing={0.5}
              >
                <Skeleton h={4} w={16} />
              </HStack>
            </HStack>
            <Skeleton h={5} w="80%" />
          </Stack>
        </Stack>

        {height > 1 && <SkeletonText noOfLines={4} skeletonHeight={4} />}
      </Stack>
    </Stack>
  )
}

export default Role
export { RoleSkeleton }
