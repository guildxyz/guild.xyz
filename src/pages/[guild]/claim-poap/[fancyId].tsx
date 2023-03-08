import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Stack,
  Tag,
  TagLeftIcon,
  Text,
  Tooltip,
  useColorMode,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import LinkButton from "components/common/LinkButton"
import ConnectDiscordButton from "components/[guild]/claim-poap/components/ConnectDiscordButton"
import ConnectWalletButton from "components/[guild]/claim-poap/components/ConnectWalletButton"
import JoinAndMintPoapButton from "components/[guild]/claim-poap/components/JoinAndMintPoapButton"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import PoapRequiementAccessIndicator from "components/[guild]/CreatePoap/components/PoapRequirementAccessIndicator"
import PoapReward from "components/[guild]/CreatePoap/components/PoapReward"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import LogicDivider from "components/[guild]/LogicDivider"
import { RequirementSkeleton } from "components/[guild]/Requirements/components/Requirement"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import Head from "next/head"
import { useRouter } from "next/router"
import { ArrowLeft, Clock } from "phosphor-react"
import { useMemo } from "react"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import BuyPoapRequirement from "requirements/PoapPayment/components/BuyPoapRequirement"
import PoapPaymentRequirement from "requirements/PoapPayment/PoapPaymentRequirement"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import PoapVoiceRequirement from "requirements/PoapVoice/PoapVoiceRequirement"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import parseDescription from "utils/parseDescription"

const Page = (): JSX.Element => {
  const router = useRouter()
  const { colorMode } = useColorMode()

  const { account } = useWeb3React()
  const { theme, urlName, imageUrl, name, poaps } = useGuild()

  const rawPoapFancyIdFromUrl = router.query.fancyId?.toString()
  const poapFancyIdFromUrl =
    rawPoapFancyIdFromUrl === "daodenver-2023"
      ? "joseph-turner-2023"
      : rawPoapFancyIdFromUrl

  const guildPoap = poaps?.find((p) => p.fancyId === poapFancyIdFromUrl)

  const { poap, isLoading } = usePoap(poapFancyIdFromUrl)

  const { poapEventDetails } = usePoapEventDetails(poap?.id)
  const {
    data: { access, hasPaid },
  } = useUserPoapEligibility(poap?.id)

  const timeDiff = guildPoap?.expiryDate * 1000 - Date.now()

  const isActive = useMemo(
    () => guildPoap?.activated && timeDiff > 0,
    [guildPoap, timeDiff]
  )

  const { platformUsers } = useUser()
  const discordFromDb = platformUsers?.some(
    (platformAccount) => platformAccount.platformName === "DISCORD"
  )

  const correctPoap =
    poaps && !isLoading ? poaps.find((p) => p.fancyId === poap?.fancy_id) : true

  const status = !guildPoap
    ? {
        label: "Loading",
        color: "gray",
      }
    : timeDiff < 0
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
        label: `Not active`,
        color: "gray",
      }

  const requirementRightElement = isActive ? (
    account ? (
      <PoapRequiementAccessIndicator poapIdentifier={guildPoap?.poapIdentifier} />
    ) : (
      <ConnectWalletButton />
    )
  ) : (
    <></>
  )

  const requirementComponents = guildPoap
    ? [
        ...(guildPoap?.poapContracts ?? []).map((poapContract) => (
          <PoapPaymentRequirement
            key={poapContract.id}
            poapContract={poapContract}
            guildPoap={guildPoap}
            rightElement={
              isActive && !hasPaid ? (
                <BuyPoapRequirement
                  size="md"
                  borderRadius={"xl"}
                  h="10"
                  {...{ guildPoap: guildPoap, poapContract }}
                />
              ) : (
                requirementRightElement
              )
            }
          />
        )),
        ...(guildPoap?.poapRequirements ?? []).map((requirement: any, i) => (
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
                rightElement={
                  isActive && account && !discordFromDb ? (
                    <ConnectDiscordButton />
                  ) : (
                    requirementRightElement
                  )
                }
              />,
            ]
          : []),
      ]
    : [...Array(2)].map((i) => <RequirementSkeleton key={i} />)

  return (
    <>
      <Head>
        <title>
          {correctPoap && name ? `${name} - mint your POAP` : "Mint your POAP"}
        </title>
        <meta
          name="og:title"
          content={
            correctPoap && name ? `${name} - mint your POAP` : "Mint your POAP"
          }
        />
      </Head>

      <Layout
        title=""
        imageUrl={poap?.image_url}
        background={theme?.color ?? "gray.900"}
        backgroundImage={theme?.backgroundImage}
        maxWidth="container.xl"
      >
        {correctPoap ? (
          <>
            <LinkButton
              href={`/${urlName}`}
              variant="link"
              opacity={0.75}
              size="sm"
              leftIcon={<ArrowLeft />}
              alignSelf="flex-start"
              mb="6"
            >
              {`Go back to `}
              <Text as="span" fontFamily={"display"} fontWeight="bold">
                {name}
              </Text>
            </LinkButton>
            <Card
              sx={{
                ":target": {
                  boxShadow: "var(--chakra-shadows-outline)",
                },
              }}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }}>
                <Flex
                  direction="column"
                  p={{ base: 5, md: 8 }}
                  borderRightWidth={{ base: 0, md: 1 }}
                  borderRightColor={colorMode === "light" ? "gray.200" : "gray.600"}
                >
                  <HStack justifyContent="space-between" mb={8} spacing={3}>
                    <HStack spacing={4} minW={0}>
                      <SkeletonCircle
                        boxSize={{ base: "20", lg: "24" }}
                        isLoaded={!isLoading && !!poap?.image_url}
                        flexShrink={0}
                      >
                        <Img
                          src={poap?.image_url}
                          alt={poap?.name}
                          boxSize={{ base: "20", lg: "24" }}
                          rounded="full"
                        />
                      </SkeletonCircle>
                      <Stack spacing="3">
                        <Skeleton isLoaded={!!guildPoap || !!poap}>
                          <Heading
                            as="h3"
                            fontSize={{ base: "xl", lg: "2xl" }}
                            fontFamily="display"
                            minW={0}
                            overflowWrap={"break-word"}
                          >
                            {poap?.name ?? guildPoap?.fancyId ?? "Loading POAP..."}
                          </Heading>
                        </Skeleton>
                        <Wrap>
                          <Tag colorScheme={status.color}>
                            <TagLeftIcon as={Clock} mr="1.5" />
                            {status.label}
                          </Tag>
                        </Wrap>
                      </Stack>
                    </HStack>
                  </HStack>

                  <SkeletonText
                    noOfLines={3}
                    skeletonHeight={4}
                    isLoaded={!isLoading}
                    speed={0.8}
                    mb={{ base: 6, md: 8 }}
                    wordBreak="break-word"
                  >
                    {parseDescription(poap?.description)}
                  </SkeletonText>

                  <Box mt="auto">
                    <PoapReward
                      poap={poap}
                      isExpired={timeDiff < 0}
                      isInteractive={false}
                    />
                  </Box>
                </Flex>
                <Flex
                  direction="column"
                  p={{ base: 5, md: 8 }}
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
                      Requirements to claim
                    </Text>
                    <Spacer />
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
                    {requirementComponents?.length ? (
                      requirementComponents?.map(
                        (RequirementComponent, i) => RequirementComponent
                      )
                    ) : (
                      <FreeRequirement
                        rightElement={!account && <ConnectWalletButton />}
                      />
                    )}
                  </Stack>

                  <Flex mt="auto" pt="8">
                    <Tooltip
                      label="Satisfy requirements above to mint POAP"
                      hasArrow
                      isDisabled={!isActive || access}
                    >
                      <JoinAndMintPoapButton
                        poapId={guildPoap?.poapIdentifier}
                        colorScheme="purple"
                        w="full"
                        isDisabled={!isActive || !account || !access}
                      >
                        Mint POAP
                      </JoinAndMintPoapButton>
                    </Tooltip>
                  </Flex>
                </Flex>
              </SimpleGrid>
            </Card>
            {/* <HStack mt="6">
              <Text colorScheme="gray" fontWeight={"bold"}>
                by:
              </Text>
              <GuildLogo imageUrl={imageUrl} size="32px" />
              <Heading fontSize="md">{name}</Heading>
            </HStack> */}
          </>
        ) : (
          <Alert status="error">
            <AlertIcon />
            <Stack>
              <AlertTitle>Invalid POAP</AlertTitle>
              <AlertDescription>{`This POAP doesn't exist or it isn't linked to the ${name} guild.`}</AlertDescription>
            </Stack>
          </Alert>
        )}
      </Layout>
    </>
  )
}

export default Page
