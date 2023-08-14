import {
  HStack,
  Icon,
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
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import DisplayCard from "components/common/DisplayCard"
import GuildLogo from "components/common/GuildLogo"
import Link from "components/common/Link"
import VerifiedIcon from "components/common/VerifiedIcon"
import image from "next/image"
import { PushPin, Users } from "phosphor-react"
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
        templateColumns={image ? "3rem calc(100% - 5.25rem)" : "1fr"}
        gap={4}
        alignItems="center"
      >
        {image && <GuildLogo imageUrl={guildData.imageUrl} />}
        <VStack spacing={2} alignItems="start" w="full" maxW="full" mb="0.5" mt="-1">
          <HStack spacing={1}>
            <Text
              as="span"
              fontFamily="display"
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
            >
              {guildData.name}
            </Text>
            {guildData.tags?.includes("VERIFIED") && <VerifiedIcon size={5} />}
          </HStack>

          <Wrap zIndex="1">
            <Tag as="li">
              <TagLeftIcon as={Users} />
              <TagLabel>
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  guildData.memberCount ?? 0
                )}
              </TagLabel>
            </Tag>
            <Tag as="li">
              <TagLabel>{pluralize(guildData.rolesCount ?? 0, "role")}</TagLabel>
            </Tag>
          </Wrap>
        </VStack>
        {guildData.tags?.includes("FEATURED") && (
          <ColorCardLabel
            fallbackColor="white"
            backgroundColor={"purple.500"}
            label={
              <Tooltip label="Featured" hasArrow>
                <Icon
                  as={PushPin}
                  display={"flex"}
                  alignItems={"center"}
                  m={"2px"}
                />
              </Tooltip>
            }
            top="0"
            left="0"
            borderBottomRightRadius="xl"
            borderTopLeftRadius="2xl"
            labelSize="xs"
          />
        )}
      </SimpleGrid>
    </DisplayCard>
  </Link>
)

const GuildSkeletonCard = () => (
  <DisplayCard h="auto">
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
