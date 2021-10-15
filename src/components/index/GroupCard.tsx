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
import useGroupMembers from "hooks/useGroupMembers"
import { Users } from "phosphor-react"
import { Group } from "temporaryData/types"

type Props = {
  groupData: Group
}

const GroupCard = ({ groupData }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const members = useGroupMembers(groupData.guilds)

  return (
    <Link
      href={`/${groupData.urlName}`}
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
          {groupData.imageUrl && (
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
                src={groupData.imageUrl}
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
              {groupData.name}
            </Text>
            <Wrap>
              <Tag as="li">
                <TagLeftIcon as={Users} />
                <TagLabel>{members?.length || 0}</TagLabel>
              </Tag>
              {groupData.guilds?.length < 5 ? (
                groupData.guilds.map((guildData) => (
                  <Tag as="li" key={guildData.guild.id}>
                    <TagLabel>{guildData.guild.name}</TagLabel>
                  </Tag>
                ))
              ) : (
                <Tag as="li">
                  <TagLabel>{`${members?.length || 0} guild${
                    members?.length > 1 ? "s" : ""
                  }`}</TagLabel>
                </Tag>
              )}
            </Wrap>
          </VStack>
        </Flex>
      </Card>
    </Link>
  )
}

export default GroupCard
