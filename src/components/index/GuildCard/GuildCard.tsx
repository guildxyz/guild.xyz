import {
  Flex,
  Img,
  Tag,
  TagLabel,
  Text,
  useColorMode,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Guild } from "temporaryData/types"
import shortenLongString from "./utils/shortenLongString"

type Props = {
  guildData: Guild
}

const GuildCard = ({ guildData }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  return (
    <Link
      href={`/${guildData.urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
    >
      <Card
        role="group"
        position="relative"
        px={{ base: 5, sm: 7 }}
        py="7"
        w="full"
        h="full"
        bg={colorMode === "light" ? "white" : "gray.700"}
        justifyContent="center"
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: "primary.300",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        _hover={{
          _before: {
            opacity: 0.1,
          },
        }}
        _active={{
          _before: {
            opacity: 0.17,
          },
        }}
      >
        <Flex alignItems="center">
          {guildData.imageUrl && <Img src={guildData.imageUrl} boxSize="6" mr={6} />}
          <VStack spacing={3} alignItems="start">
            <Text
              fontFamily="display"
              fontSize="xl"
              fontWeight="bold"
              letterSpacing="wide"
            >
              {guildData.name}
            </Text>
            <Wrap>
              {guildData.levels?.[0]?.requirements
                .filter((req) => req.type !== "POAP" && req.type !== "SNAPSHOT")
                .map((requirement, i) => (
                  // the array won't change during runtime so we can safely use index as a key
                  <Tag as="li" key={i}>
                    <TagLabel>
                      {`${shortenLongString(requirement.value)} ${
                        requirement.symbol ?? requirement.type
                      }`}
                    </TagLabel>
                  </Tag>
                ))}
              {(() => {
                const poapRequirementsCount =
                  guildData.levels?.[0]?.requirements.filter(
                    (req) => req.type === "POAP"
                  ).length
                if (poapRequirementsCount)
                  return (
                    <Tag as="li">
                      <TagLabel>{`${poapRequirementsCount} POAP${
                        poapRequirementsCount > 1 ? "s" : ""
                      }`}</TagLabel>
                    </Tag>
                  )
              })()}
              {(() => {
                const snapshotRequirementsCount =
                  guildData.levels?.[0]?.requirements.filter(
                    (req) => req.type === "SNAPSHOT"
                  ).length
                if (snapshotRequirementsCount)
                  return (
                    <Tag as="li">
                      <TagLabel>{`${snapshotRequirementsCount} SNAPSHOT${
                        snapshotRequirementsCount > 1 ? "s" : ""
                      }`}</TagLabel>
                    </Tag>
                  )
              })()}
            </Wrap>
          </VStack>
        </Flex>
      </Card>
    </Link>
  )
}

export default GuildCard
