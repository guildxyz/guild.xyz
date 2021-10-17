import {
  Box,
  Flex,
  Img,
  SimpleGrid,
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
import { Guild } from "temporaryData/types"
import RequirementsTags from "./components/RequirementsTags"

type Props = {
  guildData: Guild
}

const GuildCard = ({ guildData }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Link
      href={`/guild/${guildData.urlName}`}
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
        <SimpleGrid
          templateColumns={
            guildData.imageUrl ? "2.5rem calc(100% - 3.25rem)" : "1fr"
          }
          gap={3}
        >
          {guildData.imageUrl && (
            <Flex alignItems="center">
              <Box
                padding={2}
                bgColor={colorMode === "light" ? "gray.700" : "transparent"}
                boxSize={10}
                minW={10}
                minH={10}
                rounded="full"
              >
                <Img
                  src={guildData.imageUrl}
                  htmlWidth="1.5rem"
                  htmlHeight="1.5rem"
                  boxSize={6}
                />
              </Box>
            </Flex>
          )}
          <VStack spacing={3} alignItems="start" w="full" maxW="full">
            <Text
              as="span"
              fontFamily="display"
              fontSize="xl"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              isTruncated
            >
              {guildData.name}
            </Text>
            <Wrap>
              <Tag as="li">
                <TagLeftIcon as={Users} />
                <TagLabel>{guildData.members?.length || 0}</TagLabel>
              </Tag>
              <RequirementsTags requirements={guildData.requirements} />
            </Wrap>
          </VStack>
        </SimpleGrid>
      </Card>
    </Link>
  )
}

export default GuildCard
