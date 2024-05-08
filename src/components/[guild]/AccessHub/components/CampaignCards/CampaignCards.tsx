import {
  Circle,
  HStack,
  Img,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ArrowRight, Plus } from "phosphor-react"

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

  return (
    <>
      {groups.map(({ id, imageUrl, name, urlName }) => {
        const groupHasRoles = roles.some((role) => role.groupId === id)
        if (!isAdmin && !groupHasRoles) return null

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
              {imageUrl?.length > 0 || guildImageUrl?.length > 0 ? (
                <Circle
                  overflow={"hidden"}
                  borderRadius="full"
                  size={10}
                  flexShrink={0}
                  position="relative"
                  bgColor={imageBgColor}
                >
                  {imageUrl?.match("guildLogos") ? (
                    <Img src={imageUrl} alt="Guild logo" boxSize="40%" />
                  ) : (
                    <Image
                      src={imageUrl || guildImageUrl}
                      alt={name}
                      fill
                      sizes="2.5rem"
                    />
                  )}
                </Circle>
              ) : (
                <SkeletonCircle size="10" />
              )}
              <Text fontWeight="bold">{name}</Text>
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
