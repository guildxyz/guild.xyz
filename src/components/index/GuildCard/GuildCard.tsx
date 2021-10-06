import {
  Flex,
  Img,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorMode,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Users } from "phosphor-react"
import { useMemo } from "react"
import { Guild } from "temporaryData/types"

type Props = {
  guildData: Guild
}

const GuildCard = ({ guildData }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const shoulRenderSymbols = useMemo(() => {
    if (!guildData.levels?.[0]?.requirements?.length) return false

    const requirementTypesSet = new Set(
      guildData.levels[0].requirements.map((requirement) => requirement.type)
    )
    if (requirementTypesSet.size > guildData.levels[0].requirements.length)
      return false

    // If there are multiple requirements with the same type, don't render symbols, just render e.g. "2 TOKENs"
    return true
  }, [guildData])

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
              <Tag as="li">
                <TagLeftIcon as={Users} />
                <TagLabel>{guildData.levels?.[0]?.members.length}</TagLabel>
              </Tag>
              {shoulRenderSymbols
                ? guildData.levels[0].requirements.map((requirement) => {
                    if (
                      [
                        "TOKEN",
                        "ETHER",
                        "NFT",
                        "OPENSEA",
                        "COOLCATS",
                        "LOOT",
                        "BAYC",
                        "MUTAGEN",
                        "CRYPTOPUNKS",
                      ].includes(requirement.type)
                    )
                      return (
                        <Tag as="li">
                          <TagLabel>
                            {["TOKEN", "ETHER"].includes(requirement.type)
                              ? `${requirement.value} ${requirement.symbol}`
                              : requirement.symbol}
                          </TagLabel>
                        </Tag>
                      )
                  })
                : [
                    "TOKEN",
                    "ETHER",
                    "NFT",
                    "OPENSEA",
                    "COOLCATS",
                    "LOOT",
                    "BAYC",
                    "MUTAGEN",
                    "CRYPTOPUNKS",
                  ].map((requirementType) => {
                    const count = guildData.levels[0].requirements.filter(
                      (r) => r.type === requirementType
                    ).length

                    if (count > 0)
                      return (
                        <Tag as="li" key={requirementType}>
                          <TagLabel>
                            {`${count} ${requirementType}${count > 1 ? "s" : ""}`}
                          </TagLabel>
                        </Tag>
                      )
                  })}

              {(() => {
                // We always display POAPs this way, because they have long names
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
                // We always display SNAPSHOTs this way, because they have long names
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
