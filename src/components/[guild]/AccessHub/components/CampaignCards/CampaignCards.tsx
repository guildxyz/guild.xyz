import {
  Circle,
  HStack,
  Img,
  SkeletonCircle,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { ArrowRight, EyeSlash, Plus } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

const DynamicCampaignCardMenu = dynamic(
  () => import("./components/CampaignCardMenu")
)

const CampaignCards = () => {
  const { isAdmin } = useGuildPermission()

  const {
    groups,
    roles,
    imageUrl: guildImageUrl,
    urlName: guildUrlName,
  } = useGuild()
  const { query } = useRouter()

  const imageBgColor = useColorModeValue("gray.700", "gray.600")

  if (!groups?.length || !!query.group) return null

  const renderedGroups = isAdmin
    ? groups
    : groups.filter((group) => !group.hideFromGuildPage)

  return (
    <>
      {renderedGroups.map(({ id, imageUrl, name, urlName, hideFromGuildPage }) => {
        const groupHasRoles = roles?.some((role) => role.groupId === id)
        if (!isAdmin && !groupHasRoles) return null

        let campaignImage = ""
        if (typeof imageUrl === "string" && imageUrl.length > 0)
          campaignImage = imageUrl
        else if (typeof guildImageUrl === "string" && guildImageUrl.length > 0)
          campaignImage = guildImageUrl

        return (
          <ColorCard
            key={id}
            color={groupHasRoles ? "primary.500" : "gray.500"}
            borderStyle={groupHasRoles ? "solid" : "dashed"}
            pt={{ base: 10, sm: 11 }}
            display="flex"
            flexDir="column"
            justifyContent="space-between"
          >
            {isAdmin && <DynamicCampaignCardMenu groupId={id} />}

            <HStack spacing={3} minHeight={10} mb={5}>
              {campaignImage.length > 0 ? (
                <Circle
                  overflow={"hidden"}
                  borderRadius="full"
                  size={10}
                  flexShrink={0}
                  position="relative"
                  bgColor={imageBgColor}
                >
                  {campaignImage.match("guildLogos") ? (
                    <Img src={campaignImage} alt="Guild logo" boxSize="40%" />
                  ) : (
                    <Image src={campaignImage} alt={name} fill sizes="2.5rem" />
                  )}
                </Circle>
              ) : (
                <SkeletonCircle size="10" />
              )}

              <VStack alignItems="start">
                <Text fontWeight="bold">{name}</Text>
                {hideFromGuildPage && (
                  <Tooltip
                    label="Members don't see this, they can only access this page by visiting it's link directly"
                    hasArrow
                    placement="bottom"
                  >
                    <Tag>
                      <TagLeftIcon as={EyeSlash} />
                      <TagLabel>Hidden</TagLabel>
                    </Tag>
                  </Tooltip>
                )}
              </VStack>
            </HStack>

            {groupHasRoles ? (
              <Button
                as={Link}
                colorScheme="primary"
                href={`/${guildUrlName}/${urlName}`}
                rightIcon={<ArrowRight />}
                prefetch={false}
              >
                View page
              </Button>
            ) : (
              <Button
                as={Link}
                variant="outline"
                href={`/${guildUrlName}/${urlName}`}
                leftIcon={<Plus />}
                prefetch={false}
              >
                Add roles
              </Button>
            )}

            <ColorCardLabel
              fallbackColor="white"
              backgroundColor={groupHasRoles ? "primary.500" : "gray.500"}
              label="Page"
              top="-2px"
              left="-2px"
              borderBottomRightRadius="xl"
              borderTopLeftRadius="2xl"
            />
          </ColorCard>
        )
      })}
    </>
  )
}

export default CampaignCards
