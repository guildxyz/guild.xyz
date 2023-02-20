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
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import PoapReward from "components/[guild]/RoleCard/components/PoapReward"
import { ArrowSquareOut, PencilSimple } from "phosphor-react"
import { useMemo } from "react"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import PoapAccessIndicator from "requirements/PoapPayment/components/PoapAccessIndicator"
import PoapRequiementAccessIndicator from "requirements/PoapPayment/components/PoapRequirementAccessIndicator"
import PoapPaymentRequirement from "requirements/PoapPayment/PoapPaymentRequirement"
import { GuildPoap } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import parseDescription from "utils/parseDescription"
import usePoapLinks from "../../hooks/usePoapLinks"
import { useCreatePoapContext } from "../CreatePoapContext"

type Props = {
  poap: GuildPoap
}

const PoapRoleCard = ({ poap: guildPoap }: Props): JSX.Element => {
  const poapFancyId = guildPoap?.fancyId
  const { isAdmin } = useGuildPermission()

  const { urlName } = useGuild()

  const { poap, isLoading } = usePoap(poapFancyId)
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)

  const { setStep, setPoapData } = useCreatePoapContext()

  const isActive = useMemo(
    () => (!poap ? false : guildPoap?.activated),
    [poap, guildPoap]
  )
  const isReady = poapLinks && poapLinks?.total > 0

  const timeDiff = guildPoap?.expiryDate * 1000 - Date.now()

  const status =
    timeDiff < 0
      ? {
          label: `Claim ended ${formatRelativeTimeFromNow(timeDiff * -1)} ago`,
          color: "gray",
        }
      : isActive
      ? {
          label: `Claim ends in ${formatRelativeTimeFromNow(timeDiff)}`,
          color: "purple",
        }
      : {
          label: "Inactive",
          color: "gray",
        }

  const { colorMode } = useColorMode()

  const { data } = useUserPoapEligibility(poap?.id)
  // console.log(poap?.name, data, poap?.id)

  const requirementComponents = guildPoap && [
    ...(guildPoap.poapContracts ?? []).map((poapContract) => (
      <PoapPaymentRequirement
        key={poapContract.id}
        poapContract={poapContract}
        guildPoap={guildPoap}
        rightElement={<PoapRequiementAccessIndicator poapIdentifier={poap?.id} />}
      />
    )),
    ...(guildPoap.poapRequirements ?? []).map((requirement: any, i) => (
      <RequirementDisplayComponent
        key={requirement.id}
        requirement={{ ...requirement, id: requirement.requirementId }}
        rightElement={<PoapRequiementAccessIndicator poapIdentifier={poap?.id} />}
      />
    )),
  ]

  return (
    <Card
      sx={{
        ":target": {
          boxShadow: "var(--chakra-shadows-outline)",
        },
      }}
      borderWidth={2}
      borderColor={`${status.color}.500`}
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
                  {poap?.name}
                </Heading>
                <HStack spacing={0}>
                  <Tag colorScheme={status.color}>{status.label}</Tag>
                  {isReady && !guildPoap.poapRequirements.length && (
                    <Text as="span" fontSize="xs" colorScheme="gray" pl="4">
                      <Link
                        href={`/${urlName}/claim-poap/${poapFancyId}`}
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
                    onClick={() => {
                      setPoapData(poap)
                      setStep(0)
                    }}
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
            <PoapReward poap={poap} />
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
            {isActive && <PoapAccessIndicator poapIdentifier={poap?.id} />}
          </HStack>

          <Stack
            spacing="0"
            divider={
              <Box border="0">
                <LogicDivider logic={"AND"} />
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

          {/* <RoleRequirements role={role} /> */}
        </Flex>
      </SimpleGrid>
    </Card>
  )
}

export default PoapRoleCard
