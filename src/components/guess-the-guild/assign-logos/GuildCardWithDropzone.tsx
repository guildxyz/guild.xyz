import {
  HStack,
  Icon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { ArrowDown, Users } from "phosphor-react"
import { ReactNode } from "react"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"
import TargetDropzone from "./TargetDropzone"

const GuildCardWithDropzone = ({
  guild,
  avatarSize,
  children,
  isAnswerSubmitted,
  isLogoCorrect,
}: {
  guild: GuildBase
  avatarSize: number
  children: ReactNode
  isAnswerSubmitted: boolean
  isLogoCorrect: boolean
}) => {
  const bgColor = useColorModeValue("gray.100", "whiteAlpha.200")

  return (
    <>
      <Card w="100%" py="5" px="5" background={bgColor}>
        <HStack gap="6">
          <TargetDropzone id={`${guild.id}`} avatarSize={avatarSize}>
            {children}
          </TargetDropzone>
          <VStack alignItems="start">
            <Text
              as="span"
              fontFamily="display"
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
              wordBreak="break-all"
            >
              {guild.name}
            </Text>
            <Wrap zIndex="1">
              <Tag as="li">
                <TagLabel>{pluralize(guild.rolesCount, "role")}</TagLabel>
              </Tag>
              <Tag as="li">
                <TagLeftIcon as={Users} />
                <TagLabel>
                  {new Intl.NumberFormat("en", { notation: "compact" }).format(
                    guild.memberCount
                  )}
                </TagLabel>
              </Tag>
            </Wrap>
          </VStack>
        </HStack>
      </Card>
      {isAnswerSubmitted && !isLogoCorrect && (
        <>
          <Icon as={ArrowDown} mt="-2" opacity={0.3} mb="-1" />
          <VStack minW={"fit-content"} gap="2" mb="2">
            <GuildLogo
              h={avatarSize}
              w={avatarSize}
              imageUrl={guild.imageUrl}
            ></GuildLogo>
            <Text
              as="span"
              mt="1"
              fontSize="xs"
              fontWeight="bold"
              color="gray"
              textTransform="uppercase"
              noOfLines={1}
            >
              Correct Answer
            </Text>
          </VStack>
        </>
      )}
    </>
  )
}

export default GuildCardWithDropzone
