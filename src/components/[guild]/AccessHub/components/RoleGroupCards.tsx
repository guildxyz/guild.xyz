import { Box, HStack, SkeletonCircle, Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import LinkButton from "components/common/LinkButton"
import useGuild from "components/[guild]/hooks/useGuild"
import Image from "next/image"
import { useRouter } from "next/router"
import { ArrowRight } from "phosphor-react"

const RoleGroupCards = () => {
  const { groups, imageUrl: guildImageUrl, urlName: guildUrlName } = useGuild()
  const { query } = useRouter()

  if (!groups?.length || !!query.group) return null

  return (
    <>
      {groups.map(({ id, imageUrl, name, urlName }) => (
        <ColorCard
          key={id}
          color="primary.500"
          pt={{ base: 10, sm: 11 }}
          display="flex"
          flexDir="column"
          justifyContent="space-between"
        >
          <HStack spacing={3} minHeight={10} mb={5}>
            {imageUrl?.length > 0 || guildImageUrl?.length > 0 ? (
              <Box
                overflow={"hidden"}
                borderRadius="full"
                boxSize={10}
                flexShrink={0}
                position="relative"
              >
                <Image src={imageUrl || guildImageUrl} alt={name} layout="fill" />
              </Box>
            ) : (
              <SkeletonCircle size="10" />
            )}
            <Text fontWeight="bold">{name}</Text>
          </HStack>

          <LinkButton
            href={`/${guildUrlName}/${urlName}`}
            rightIcon={<ArrowRight />}
          >
            View campaign
          </LinkButton>

          <ColorCardLabel
            fallbackColor="white"
            backgroundColor={"primary.500"}
            label="Campaign"
            top="-2px"
            left="-2px"
            borderBottomRightRadius="xl"
            borderTopLeftRadius="2xl"
          />
        </ColorCard>
      ))}
    </>
  )
}

export default RoleGroupCards
