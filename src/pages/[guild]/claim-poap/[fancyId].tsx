import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Circle,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Img,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Footer from "components/common/Layout/components/Footer"
import Header from "components/common/Layout/components/Header"
import Link from "components/common/Link"
import { usePoap } from "components/create-guild/Requirements/components/PoapForm/hooks/usePoaps"
import ClaimModal from "components/[guild]/claim-poap/components/ClaimModal"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains, RPC } from "connectors"
import Head from "next/head"
import { useRouter } from "next/router"
import { DownloadSimple } from "phosphor-react"

const Page = (): JSX.Element => {
  const router = useRouter()
  const { chainId } = useWeb3React()

  const { theme, urlName, imageUrl, name, poaps } = useGuild()

  const guildPoap = poaps?.find(
    (p) => p.fancyId === router.query.fancyId?.toString()
  )

  const guildPoapChainId = guildPoap?.poapContracts
    ?.map((poapContract) => poapContract.chainId)
    ?.includes(chainId)
    ? chainId
    : guildPoap?.poapContracts?.[0]?.chainId

  const { poap, isLoading } = usePoap(router.query.fancyId?.toString())

  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)

  const guildPoapVaultId = guildPoap?.poapContracts
    ?.map((poapContract) => poapContract.chainId)
    ?.includes(chainId)
    ? guildPoap?.poapContracts?.find(
        (poapContract) => poapContract?.chainId === chainId
      )?.vaultId
    : guildPoap?.poapContracts?.[0]?.vaultId
  const { isVaultLoading, vaultError, vaultData } = usePoapVault(
    guildPoapVaultId,
    guildPoapChainId
  )
  const {
    data: { hasPaid },
  } = useUserPoapEligibility(vaultData ? poap?.id : null)

  const correctPoap =
    poaps && !isLoading ? poaps.find((p) => p.fancyId === poap?.fancy_id) : true

  const hasExpired =
    poaps?.length && poap
      ? Date.now() / 1000 >=
        (poaps?.find((p) => p.fancyId === poap?.fancy_id)?.expiryDate || 0)
      : false

  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Head>
        <title>
          {correctPoap && name ? `${name} - claim your POAP` : "Claim your POAP"}
        </title>
        <meta
          name="og:title"
          content={
            correctPoap && name ? `${name} - claim your POAP` : "Claim your POAP"
          }
        />
      </Head>

      <Header showBackButton={true} />
      <Container maxW="xl" pt={{ base: 16, md: 24 }} pb={12}>
        {correctPoap ? (
          <>
            <Card overflow="hidden">
              <Box
                position="relative"
                h={48}
                bgColor={theme?.color ?? "gray.900"}
                bgImage={
                  theme?.backgroundImage
                    ? `url('${theme?.backgroundImage}')`
                    : undefined
                }
                bgSize="cover"
                bgPosition="center center"
              >
                <Flex
                  position="absolute"
                  left={0}
                  right={0}
                  bottom={-8}
                  justifyContent="center"
                >
                  <Box position="relative" p={1} bgColor="gray.700" rounded="full">
                    {guildPoapChainId && (
                      <Tooltip
                        label={`Monetized on ${
                          RPC[Chains[guildPoapChainId]]?.chainName
                        }`}
                      >
                        <Circle
                          position="absolute"
                          bottom={2}
                          right={2}
                          size={8}
                          bgColor={colorMode === "light" ? "white" : "gray.100"}
                          borderColor={colorMode === "light" ? "white" : "gray.700"}
                          borderWidth={3}
                        >
                          <Img
                            src={RPC[Chains[guildPoapChainId]]?.iconUrls?.[0]}
                            alt={RPC[Chains[guildPoapChainId]]?.chainName}
                            boxSize={5}
                          />
                        </Circle>
                      </Tooltip>
                    )}
                    <SkeletonCircle boxSize={36} isLoaded={poap && !isLoading}>
                      <Img boxSize={36} rounded="full" src={poap?.image_url} />
                    </SkeletonCircle>
                  </Box>
                </Flex>
              </Box>
              <Stack
                px={{ base: 6, sm: 12 }}
                pt={12}
                pb={7}
                alignItems="center"
                spacing={4}
              >
                <Skeleton isLoaded={poap && !isLoading}>
                  <Heading
                    as="h2"
                    fontSize={{ base: "2xl", sm: "3xl" }}
                    fontFamily="display"
                    textAlign="center"
                  >
                    Claim your
                    <br />
                    {` ${poap?.name} POAP`}
                  </Heading>
                </Skeleton>

                <HStack>
                  <Circle bgColor="gray.800" size={6} overflow="hidden">
                    <Img
                      src={imageUrl}
                      alt={name}
                      boxSize={imageUrl?.includes("guildLogos") ? 3 : 6}
                    />
                  </Circle>
                  <Text
                    color="gray"
                    textTransform="uppercase"
                    fontWeight="bold"
                    fontSize="xs"
                  >
                    {`created by `}
                    <Link href={`/${urlName}`}>{name}</Link>
                  </Text>
                </HStack>

                <Skeleton isLoaded={poapLinks && !isPoapLinksLoading}>
                  <Tag
                    fontWeight="bold"
                    textTransform="uppercase"
                    size="sm"
                  >{`${poapLinks?.claimed}/${poapLinks?.total} claimed`}</Tag>
                </Skeleton>

                <SkeletonText isLoaded={poap && !isLoading}>
                  <Text py={2} color="gray" textAlign="center">
                    {poap?.description}
                  </Text>
                </SkeletonText>

                {vaultError ? (
                  <Alert status="error">
                    <AlertIcon />
                    <Stack>
                      <AlertTitle>Contract error</AlertTitle>
                      <AlertDescription>
                        Uh-oh, we couldn't fetch the vault data for this POAP.
                      </AlertDescription>
                    </Stack>
                  </Alert>
                ) : (vaultData ? !hasPaid : poapLinks?.claimed > 0) &&
                  poapLinks?.claimed === poapLinks?.total ? (
                  <Alert status="info">
                    <AlertIcon />
                    <Stack>
                      <AlertTitle>Maybe next time...</AlertTitle>
                      <AlertDescription>
                        We're sorry, but it seems like all available POAPs have been
                        claimed.
                      </AlertDescription>
                    </Stack>
                  </Alert>
                ) : (
                  <>
                    <Flex pt={8} w="full" justifyContent="center">
                      <Button
                        minW={{ base: "full", md: "50%" }}
                        colorScheme="indigo"
                        isDisabled={hasExpired || isLoading || isVaultLoading}
                        isLoading={isLoading || isVaultLoading}
                        leftIcon={!hasExpired && <Icon as={DownloadSimple} />}
                        onClick={onOpen}
                      >
                        {hasExpired ? "This POAP has expired" : "Claim"}
                      </Button>
                    </Flex>
                  </>
                )}
              </Stack>
            </Card>

            <ClaimModal
              isOpen={isOpen}
              onClose={onClose}
              poap={poap}
              guildPoap={guildPoap}
            />
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
      </Container>
      <Footer />
    </>
  )
}

export default Page
