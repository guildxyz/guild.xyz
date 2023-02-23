import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Img,
  SimpleGrid,
  SkeletonCircle,
  Spacer,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import AccessIndicatorUI from "components/[guild]/RoleCard/components/AccessIndicator/components/AccessIndicatorUI"
import PoapReward from "components/[guild]/RoleCard/components/PoapReward"
import { ArrowSquareOut, Clock, EyeSlash, PencilSimple } from "phosphor-react"
import { useMemo } from "react"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import PoapPaymentRequirement from "requirements/PoapPayment/PoapPaymentRequirement"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import PoapVoiceRequirement from "requirements/PoapVoice/PoapVoiceRequirement"
import { GuildPoap } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import parseDescription from "utils/parseDescription"
import PoapAccessIndicator from "../PoapAccessIndicator"
import PoapRequiementAccessIndicator from "../PoapRequirementAccessIndicator"

type Props = {
  guildPoap: GuildPoap
}

const PoapRoleCard = ({ guildPoap }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { urlName } = useGuild()
  const { isAdmin } = useGuildPermission()

  const { poap, isLoading } = usePoap(guildPoap.fancyId)
  const { poapEventDetails } = usePoapEventDetails(poap?.id)

  const timeDiff = guildPoap.expiryDate * 1000 - Date.now()

  const isActive = useMemo(
    () => guildPoap.activated && timeDiff > 0,
    [guildPoap, timeDiff]
  )

  const status =
    timeDiff < 0
      ? {
          label: `Expired ${formatRelativeTimeFromNow(timeDiff * -1)} ago`,
          color: "gray",
        }
      : isActive
      ? {
          label: `Claim ends in ${formatRelativeTimeFromNow(timeDiff)}`,
          color: "purple",
        }
      : {
          label: `Temporary until ${new Date(
            guildPoap.expiryDate * 1000
          ).toLocaleDateString()}`,
          color: "gray",
        }

  const requirementRightElement = isActive ? (
    <PoapRequiementAccessIndicator poapIdentifier={guildPoap.poapIdentifier} />
  ) : null

  const requirementComponents = guildPoap && [
    ...(guildPoap.poapContracts ?? []).map((poapContract) => (
      <PoapPaymentRequirement
        key={poapContract.id}
        poapContract={poapContract}
        guildPoap={guildPoap}
        rightElement={requirementRightElement}
      />
    )),
    ...(guildPoap.poapRequirements ?? []).map((requirement: any, i) => (
      <RequirementDisplayComponent
        key={requirement.id}
        requirement={{ ...requirement, id: requirement.requirementId }}
        rightElement={requirementRightElement}
      />
    )),
    ...(poapEventDetails?.voiceChannelId
      ? [
          <PoapVoiceRequirement
            key="voice"
            guildPoap={guildPoap}
            rightElement={requirementRightElement}
          />,
        ]
      : []),
  ]

  return (
    <Card
      sx={{
        ":target": {
          boxShadow: "var(--chakra-shadows-outline)",
        },
      }}
      borderWidth={timeDiff > 0 && 2}
      borderStyle={!isActive && "dashed"}
      borderColor={`${status.color}.500`}
      opacity={timeDiff < 0 && 0.6}
      _hover={{ opacity: 1 }}
      transition={"opacity 0.2s"}
    >
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Flex
          direction="column"
          p={5}
          borderRightWidth={{ base: 0, md: 1 }}
          borderRightColor={colorMode === "light" ? "gray.200" : "gray.600"}
        >
          <HStack justifyContent="space-between" mb={6} spacing={3}>
            <HStack spacing={4} minW={0}>
              <SkeletonCircle
                boxSize={{ base: "48px", md: "52px" }}
                isLoaded={!isLoading && !!poap?.image_url}
                flexShrink={0}
              >
                <Img
                  src={poap?.image_url}
                  alt={poap?.name}
                  boxSize={{ base: "48px", md: "52px" }}
                  rounded="full"
                />
              </SkeletonCircle>
              <Stack>
                <Heading
                  as="h3"
                  fontSize="xl"
                  fontFamily="display"
                  minW={0}
                  overflowWrap={"break-word"}
                >
                  {poap?.name ?? guildPoap.fancyId}
                </Heading>
                <HStack spacing={0}>
                  <Tag colorScheme={status.color}>{status.label}</Tag>
                  {isActive && !guildPoap.poapRequirements?.length && (
                    <Text as="span" fontSize="xs" colorScheme="gray" pl="4">
                      <Link
                        href={`/${urlName}/claim-poap/${guildPoap.fancyId}`}
                        isExternal
                      >
                        <Text as="span">Mint page</Text>
                        <Icon ml={1} as={ArrowSquareOut} />
                      </Link>
                    </Text>
                  )}
                </HStack>
              </Stack>
            </HStack>
            {isAdmin && (
              <>
                <Spacer m="0 !important" />
                <Tooltip label="Soon">
                  <IconButton
                    icon={<Icon as={PencilSimple} />}
                    size="sm"
                    rounded="full"
                    aria-label="Edit role"
                    isDisabled
                  />
                </Tooltip>
              </>
            )}
          </HStack>

          {poap?.description && (
            <Box mb={6} wordBreak="break-word">
              {parseDescription(poap?.description)}
            </Box>
          )}

          <Box mt="auto">
            <PoapReward poap={poap} isExpired={timeDiff < 0} />
          </Box>
        </Flex>
        <Flex
          direction="column"
          p={5}
          pb={{ base: 14, md: 5 }}
          position="relative"
          bgColor={colorMode === "light" ? "gray.50" : "blackAlpha.300"}
        >
          <HStack mb={{ base: 4, md: 6 }}>
            <Text
              as="span"
              mt="1"
              mr="2"
              fontSize="xs"
              fontWeight="bold"
              color="gray"
              textTransform="uppercase"
              noOfLines={1}
            >
              Requirements to qualify
            </Text>
            <Spacer />
            {isActive ? (
              <PoapAccessIndicator poapIdentifier={poap?.id} />
            ) : timeDiff > 0 ? (
              <AccessIndicatorUI
                colorScheme="gray"
                label="Not active yet"
                icon={EyeSlash}
              />
            ) : (
              <AccessIndicatorUI colorScheme="gray" label="Expired" icon={Clock} />
            )}
          </HStack>

          <Stack
            spacing="0"
            divider={
              /* have to wrap in a Box, otherwise it looks broken */
              <Box border="0">
                {/* retrofit: show OR for previously made POAPs with multiple payment methods */}
                <LogicDivider
                  logic={guildPoap?.poapContracts?.length > 1 ? "OR" : "AND"}
                />
              </Box>
            }
          >
            {requirementComponents.length ? (
              requirementComponents?.map(
                (RequirementComponent, i) => RequirementComponent
              )
            ) : (
              <FreeRequirement />
            )}
          </Stack>
        </Flex>
      </SimpleGrid>
    </Card>
  )
}

export default PoapRoleCard
