import {
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import GuildLogo from "components/common/GuildLogo"
import Link from "components/common/Link"
import image from "next/image"
import { Users } from "phosphor-react"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"

type Props = {
  guildData: GuildBase
}

const GuildCard = ({ guildData }: Props): JSX.Element => (
  <Link
    href={`/${guildData.urlName}`}
    prefetch={false}
    _hover={{ textDecor: "none" }}
    borderRadius="2xl"
    w="full"
    h="full"
  >
    <DisplayCard>
      <SimpleGrid
        templateColumns={image ? "3rem calc(100% - 4.25rem)" : "1fr"}
        gap={4}
        alignItems="center"
      >
        {image && <GuildLogo imageUrl={guildData.imageUrl} />}
        <VStack spacing={2} alignItems="start" w="full" maxW="full" mb="1" mt="-1">
          <Text
            as="span"
            fontFamily="display"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
            noOfLines={1}
          >
            {guildData.name}
          </Text>
          <Wrap zIndex="1">
            <Tag as="li">
              <TagLeftIcon as={Users} />
              <TagLabel>
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  guildData.memberCount ?? 0
                )}
              </TagLabel>
            </Tag>
            <Tooltip label={guildData.roles.join(", ")}>
              <Tag as="li">
                <TagLabel>
                  {pluralize(guildData.roles?.length ?? 0, "role")}
                </TagLabel>
              </Tag>
            </Tooltip>
          </Wrap>
        </VStack>
      </SimpleGrid>
    </DisplayCard>
  </Link>
)

const GuildSkeletonCard = () => (
  <DisplayCard>
    <SimpleGrid
      templateColumns={image ? "3rem calc(100% - 4.25rem)" : "1fr"}
      gap={4}
      alignItems="center"
    >
      <SkeletonCircle size={"48px"} />
      <VStack spacing={3} alignItems="start" w="full" maxW="full">
        <Skeleton h="6" w="80%" />
        <HStack>
          <Skeleton h="5" w="12" />
          <Skeleton h="5" w="16" />
        </HStack>
      </VStack>
    </SimpleGrid>
  </DisplayCard>
)

export default GuildCard
export { GuildSkeletonCard }
