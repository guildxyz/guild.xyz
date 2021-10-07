import {
  Box,
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
import { Guild } from "temporaryData/types"
import RequirementsTags from "./components/RequirementsTags"

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
          {guildData.imageUrl && (
            <Box
              mr={6}
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
          )}
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
              <Tag colorScheme="alpha" as="li">
                <TagLeftIcon as={Users} />
                <TagLabel>{guildData.levels?.[0]?.members?.length || 0}</TagLabel>
              </Tag>
              <RequirementsTags
                requirements={guildData?.levels?.[0]?.requirements}
              />
            </Wrap>
          </VStack>
        </Flex>
      </Card>
    </Link>
  )
}

export default GuildCard
