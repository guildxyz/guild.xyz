import {
  Box,
  Flex,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react"
import GuildCard from "components/index/GuildCard"
import { GetStaticProps } from "next"
import { GuildBase } from "types"
import fetcher from "utils/fetcher"

type Props = {
  guilds: Array<GuildBase>
}

const LinkPreview = ({ guilds }: Props): JSX.Element => (
  <Box position="relative" bgColor="gray.800" h="100vh" overflow="hidden">
    <SimpleGrid
      position="absolute"
      top={0}
      right={"-5vw"}
      pt={12}
      width="50vw"
      gridTemplateColumns="repeat(2, 1fr)"
      gap={6}
      opacity={0.6}
      transform="scale(1.25)"
      transformOrigin="top"
    >
      {guilds?.slice(0, 12).map((guild) => (
        <GuildCard key={guild.urlName} guildData={guild} />
      ))}
    </SimpleGrid>

    <Box
      position="absolute"
      inset={0}
      bgGradient="linear-gradient(to right, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-800) 45%, transparent 65%, transparent)"
    />

    <Flex
      direction="column"
      position="relative"
      pt={28}
      pl={28}
      maxW="60vw"
      height="calc(100vh - 7rem)"
      alignItems="start"
    >
      <HStack mb={8} spacing={4}>
        <Img boxSize={24} src="/guildLogos/logo.svg" />
        <Heading textColor="white" fontFamily="display" fontSize="8xl" isTruncated>
          Guild
        </Heading>
      </HStack>
      <HStack mb={10} spacing={6}>
        <Tag
          height={16}
          fontSize="4xl"
          fontWeight="bold"
          px={8}
          bgColor="gray.600"
          textColor="white"
          rounded="xl"
        >
          {`${guilds?.length || 0} guilds`}
        </Tag>
      </HStack>
      <Text fontFamily="display" fontSize="5xl" fontWeight="bold">
        Manage roles
        <br />
        in your community
        <br />
        based on tokens &amp; NFTs
      </Text>
    </Flex>
  </Box>
)

export const getStaticProps: GetStaticProps = async () => {
  const guilds = await fetcher(`/guild?sort=members`).catch((_) => [])

  return {
    props: { guilds },
    revalidate: 10,
  }
}

export default LinkPreview
