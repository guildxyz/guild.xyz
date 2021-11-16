import {
  Box,
  GridItem,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  useColorMode,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import GuildLogo from "components/common/GuildLogo"
import useRequirementLabels from "components/index/GuildCard/hooks/useRequirementLabels"
import useIsMember from "components/[guild]/JoinButton/hooks/useIsMember"
import useLevelsAccess from "components/[guild]/JoinButton/hooks/useLevelsAccess"
import { Check, CheckCircle, Users, X } from "phosphor-react"
import React from "react"
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

  const requirementLabels = useRequirementLabels(guildData.requirements)

  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={6} py={4} width="full">
      <SimpleGrid
        width="full"
        templateColumns={{ base: "1fr auto", md: "auto 1fr" }}
        columnGap={{ base: 4, sm: 6 }}
        rowGap={4}
        alignItems="center"
      >
        <GridItem order={{ md: 1 }}>
          <Heading size="md" mb="3" fontFamily="display">
            {guildData.name}
          </Heading>

          {/* TODO: extract it to a standalone component, and use that new component on GuildCard too */}
          <Wrap zIndex="1">
            <Tag as="li">
              <TagLeftIcon as={Users} />
              <TagLabel>{guildData.members?.length || 0}</TagLabel>
            </Tag>
            <Tooltip label={requirementLabels}>
              <Tag as="li">
                <TagLabel>
                  {(() => {
                    const reqCount = guildData.requirements?.length || 0
                    return `${reqCount} requirement${reqCount > 1 ? "s" : ""}`
                  })()}
                </TagLabel>
              </Tag>
            </Tooltip>
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

        {guildData.description && (
          <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={2}>
            <Text colorScheme="gray" fontSize="md">
              {guildData.description}
            </Text>
          </GridItem>
        )}
      </SimpleGrid>

      <Stack
        direction={{ base: "row", md: "column" }}
        alignItems={{ base: "center", md: "flex-end" }}
        justifyContent={{
          base: "space-between",
          md: "center",
        }}
      >
        {!account && (
          <Tag colorScheme={colorScheme()}>
            <TagLeftIcon boxSize={4} as={X} />
            <TagLabel>Not connected</TagLabel>
          </Tag>
        )}
        {!error && (
          <Tag colorScheme={colorScheme()}>
            {isMember ? (
              <>
                <TagLeftIcon boxSize={4} as={CheckCircle} />
                <TagLabel>You're in</TagLabel>
              </>
            ) : isLoading ? (
              <>
                <TagLeftIcon boxSize={3} as={Spinner} />
                <TagLabel>Checking access</TagLabel>
              </>
            ) : hasAccess ? (
              <>
                <TagLeftIcon boxSize={4} as={Check} />
                <TagLabel>You have access</TagLabel>
              </>
            ) : (
              <>
                <TagLeftIcon boxSize={4} as={X} />
                <TagLabel>No access</TagLabel>
              </>
            )}
          </Tag>
        )}
      </Stack>
    </Stack>
  )
}

export default GuildListItem
