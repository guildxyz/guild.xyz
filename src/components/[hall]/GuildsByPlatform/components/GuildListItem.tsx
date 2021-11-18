import {
  Box,
  Button,
  Collapse,
  Flex,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  useColorMode,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import GuildLogo from "components/common/GuildLogo"
import useRequirementLabels from "components/index/GuildCard/hooks/useRequirementLabels" // TODO: move it to another folder
import useIsMember from "components/[guild]/JoinButton/hooks/useIsMember"
import useLevelsAccess from "components/[guild]/JoinButton/hooks/useLevelsAccess"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementCard from "components/[guild]/RequirementCard"
import { CaretDown, CaretUp, Check, CheckCircle, X } from "phosphor-react"
import React, { useState } from "react"
import { Guild } from "temporaryData/types"

type Props = {
  guildData: Guild
}

const GuildListItem = ({ guildData }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const {
    data: hasAccess,
    error,
    isLoading,
  } = useLevelsAccess("guild", guildData.id)
  const isMember = useIsMember("guild", guildData.id)

  const colorScheme = () => {
    if (isMember) return "green"
    if (hasAccess) return "blue"
    return "gray"
  }

  const { colorMode } = useColorMode()

  const requirements = useRequirementLabels(guildData.requirements)
  const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false)

  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={6} py={4} width="full">
      <SimpleGrid
        width="full"
        templateColumns={{ base: "1fr auto", md: "auto 1fr" }}
        columnGap={{ base: 4, sm: 6 }}
        rowGap={4}
        alignItems="start"
      >
        <GridItem order={{ md: 1 }}>
          <Wrap alignItems="center" spacing={2} mb={3}>
            <Heading size="md" fontFamily="display">
              {guildData.name}
            </Heading>
            <Text
              as="span"
              colorScheme="gray"
              fontSize="sm"
              position="relative"
              top={1}
            >{`${guildData.members?.length || 0} members`}</Text>
          </Wrap>

          <Wrap zIndex="1">
            {requirements?.split(", ").map((requirement) => (
              <Tag key={requirement} as="li">
                {requirement}
              </Tag>
            ))}
            <Button
              key="details"
              variant="outline"
              rightIcon={<Icon as={isRequirementsExpanded ? CaretUp : CaretDown} />}
              size="xs"
              rounded="md"
              onClick={() => setIsRequirementsExpanded(!isRequirementsExpanded)}
            >
              {isRequirementsExpanded ? "Close details" : "View details"}
            </Button>
          </Wrap>
        </GridItem>

        <GridItem order={{ md: 0 }}>
          {guildData.imageUrl ? (
            <GuildLogo imageUrl={guildData.imageUrl} size={14} iconSize={5} />
          ) : (
            <Box
              boxSize={14}
              bgColor={colorMode === "light" ? "gray.200" : "gray.800"}
              rounded="full"
            />
          )}
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={2}>
          {guildData.description && (
            <Text mb={4} fontSize="sm">
              {guildData.description}
            </Text>
          )}

          <Collapse in={isRequirementsExpanded} animateOpacity>
            <VStack maxW="md">
              {guildData.requirements?.map((requirement, i) => (
                <React.Fragment key={i}>
                  <RequirementCard requirement={requirement} boxShadow="none" />
                  {i < guildData.requirements.length - 1 && (
                    <LogicDivider logic={guildData.logic} />
                  )}
                </React.Fragment>
              ))}
            </VStack>
          </Collapse>
        </GridItem>
      </SimpleGrid>

      {/* TODO: maybe we could make a component for this, and use it here */}
      <Stack
        minWidth="max-content"
        direction={{ base: "row", md: "column" }}
        alignItems="center"
        justifyContent="start"
      >
        {!account && (
          <>
            <Flex
              boxSize={6}
              alignItems="center"
              justifyContent="center"
              bgColor={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
              rounded="full"
            >
              <Icon boxSize={4} as={X} />
            </Flex>
            <Text color={colorScheme()} fontSize="sm">
              Not connected
            </Text>
          </>
        )}
        {!error && (
          <>
            {isMember ? (
              <>
                <Flex
                  boxSize={6}
                  alignItems="center"
                  justifyContent="center"
                  bgColor={`${colorScheme()}.${
                    colorMode === "light" ? "200" : "500"
                  }`}
                  rounded="full"
                >
                  <Icon boxSize={4} as={CheckCircle} />
                </Flex>
                <Text color={colorScheme()} fontSize="sm">
                  You're in
                </Text>
              </>
            ) : isLoading ? (
              <>
                <Flex
                  boxSize={6}
                  alignItems="center"
                  justifyContent="center"
                  bgColor={`${colorScheme()}.${
                    colorMode === "light" ? "200" : "500"
                  }`}
                  rounded="full"
                >
                  <Icon boxSize={4} as={Spinner} />
                </Flex>
                <Text color={colorScheme()} fontSize="sm">
                  Checking access
                </Text>
              </>
            ) : hasAccess ? (
              <>
                <Flex
                  boxSize={6}
                  alignItems="center"
                  justifyContent="center"
                  bgColor={`${colorScheme()}.${
                    colorMode === "light" ? "200" : "500"
                  }`}
                  rounded="full"
                >
                  <Icon boxSize={4} as={Check} />
                </Flex>
                <Text color={colorScheme()} fontSize="sm">
                  You have access
                </Text>
              </>
            ) : (
              <>
                <Flex
                  boxSize={6}
                  alignItems="center"
                  justifyContent="center"
                  bgColor={`${colorScheme()}.${
                    colorMode === "light" ? "200" : "500"
                  }`}
                  rounded="full"
                >
                  <Icon boxSize={4} as={X} />
                </Flex>
                <Text color={colorScheme()} fontSize="sm">
                  No access
                </Text>
              </>
            )}
          </>
        )}
      </Stack>
    </Stack>
  )
}

export default GuildListItem
