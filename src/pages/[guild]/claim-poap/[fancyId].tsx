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
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Footer from "components/common/Layout/components/Footer"
import Header from "components/common/Layout/components/Header"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useClaimPoap from "components/[guild]/claim-poap/hooks/useClaimPoap"
import useHasPaid from "components/[guild]/claim-poap/hooks/useHasPaid"
import usePayFee from "components/[guild]/claim-poap/hooks/usePayFee"
import useUsersTokenBalance from "components/[guild]/claim-poap/hooks/useUsersTokenBalance"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import useIsMember from "components/[guild]/RolesByPlatform/components/JoinButton/hooks/useIsMember"
import { Chains, RPC } from "connectors"
import useCoinBalance from "hooks/useCoinBalance"
import useTokenData from "hooks/useTokenData"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  ArrowSquareOut,
  Check,
  CurrencyCircleDollar,
  DownloadSimple,
} from "phosphor-react"

const Page = (): JSX.Element => {
  const router = useRouter()
  const { account, chainId } = useWeb3React()
  const coinBalance = useCoinBalance()

  const { theme, urlName, imageUrl, name, poaps } = useGuild()
  const guildPoap = poaps?.find(
    (p) => p.fancyId === router.query.fancyId?.toString()
  )

  const isMember = useIsMember()

  const { poap, isLoading } = usePoap(router.query.fancyId?.toString())
  const {
    poapLinks,
    isPoapLinksLoading,
    mutate: mutatePoapLinks,
  } = usePoapLinks(poap?.id)
  // Using chainId from useWeb3React here, to make sure that the user is on the correct chain when they pay for the POAP
  const { vaultData, isVaultLoading, vaultError } = usePoapVault(poap?.id, chainId)

  const {
    data: { symbol, decimals },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], vaultData?.token)

  const { balance, isBalanceLoading } = useUsersTokenBalance(vaultData?.token)

  const { hasPaid, hasPaidLoading } = useHasPaid()
  const { onSubmit: onPayFeeSubmit, isLoading: isPayFeeLoading } = usePayFee()

  const triggerConfetti = useJsConfetti()
  const handleSuccess = () => {
    mutatePoapLinks()
    onOpen()
    triggerConfetti()
  }

  const {
    onSubmit: onClaimPoapSubmit,
    isLoading: isClaimPoapLoading,
    response,
  } = useClaimPoap(handleSuccess)

  const correctPoap =
    poaps && !isLoading ? poaps.find((p) => p.fancyId === poap.fancy_id) : true

  const hasExpired =
    poaps?.length && poap
      ? Date.now() / 1000 >=
        (poaps?.find((p) => p.fancyId === poap?.fancy_id)?.expiryDate || 0)
      : false

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Head>
        <title>
          {correctPoap && name ? `${name} - claim your POAP` : "Claim your POAP"}
        </title>
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
                  <Box p={1} bgColor="gray.700" rounded="full">
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

                {guildPoap?.contract && guildPoap?.chainId !== chainId ? (
                  <Alert status="error">
                    <AlertIcon />
                    <Stack>
                      <AlertTitle>Wrong network</AlertTitle>
                      <AlertDescription>{`Please switch to ${
                        RPC[Chains[guildPoap?.chainId]]?.chainName
                      } in order to pay for this POAP!`}</AlertDescription>
                    </Stack>
                  </Alert>
                ) : (
                  <>
                    {isVaultLoading ? (
                      <Spinner />
                    ) : account && !isMember ? (
                      <Alert status="info">
                        <AlertIcon />
                        <Stack>
                          <AlertTitle>You're not a guild member</AlertTitle>
                          <AlertDescription>
                            {"Please join "}
                            <Link href={`/${urlName}`}>{name}</Link>
                            {" in order to claim this POAP."}
                          </AlertDescription>
                        </Stack>
                      </Alert>
                    ) : vaultError ? (
                      <Alert status="error">
                        <AlertIcon />
                        <Stack>
                          <AlertTitle>Contract error</AlertTitle>
                          <AlertDescription>
                            Uh-oh, swe couldn't fetch the vault data for this POAP.
                          </AlertDescription>
                        </Stack>
                      </Alert>
                    ) : (
                      <>
                        <HStack pt={8} spacing={2}>
                          {!isVaultLoading && typeof vaultData?.id === "number" && (
                            <Button
                              isDisabled={
                                !account ||
                                !isMember ||
                                hasExpired ||
                                hasPaid ||
                                hasPaidLoading ||
                                isVaultLoading ||
                                isPayFeeLoading ||
                                poapLinks?.claimed === poapLinks?.total
                              }
                              isLoading={
                                hasPaidLoading ||
                                isPayFeeLoading ||
                                isTokenDataLoading
                              }
                              loadingText={isPayFeeLoading ? "Paying" : undefined}
                              leftIcon={
                                hasPaid ? (
                                  <Icon
                                    as={Check}
                                    p={0.5}
                                    bgColor="green.500"
                                    rounded="full"
                                  />
                                ) : (
                                  <Icon as={CurrencyCircleDollar} />
                                )
                              }
                              onClick={onPayFeeSubmit}
                            >
                              {hasPaid
                                ? "Paid"
                                : `Pay ${formatUnits(
                                    vaultData?.fee ?? "0",
                                    decimals ?? 18
                                  )} ${symbol}`}
                            </Button>
                          )}

                          <Button
                            colorScheme="indigo"
                            isDisabled={
                              !account ||
                              !isMember ||
                              hasExpired ||
                              isLoading ||
                              isClaimPoapLoading ||
                              hasPaidLoading ||
                              (typeof vaultData?.id === "number" && !hasPaid) ||
                              vaultError
                            }
                            isLoading={isClaimPoapLoading}
                            loadingText="Claiming POAP"
                            leftIcon={<Icon as={DownloadSimple} />}
                            onClick={response ? handleSuccess : onClaimPoapSubmit}
                          >
                            Claim
                          </Button>
                        </HStack>

                        {!hasExpired &&
                          !isVaultLoading &&
                          typeof vaultData?.id === "number" &&
                          !hasPaid && (
                            <Skeleton isLoaded={symbol && !isBalanceLoading}>
                              <Text color="gray" fontSize="sm">
                                {`Your balance: ${parseFloat(
                                  formatUnits(
                                    (vaultData?.token ===
                                    "0x0000000000000000000000000000000000000000"
                                      ? coinBalance
                                      : balance) ?? "0",
                                    decimals ?? 18
                                  )
                                )?.toFixed(2)} ${symbol}`}
                              </Text>
                            </Skeleton>
                          )}

                        {!hasExpired && !account && (
                          <Skeleton isLoaded={!!urlName}>
                            <Text color="gray" fontSize="sm">
                              Please connect your wallet in order to claim this POAP.
                            </Text>
                          </Skeleton>
                        )}

                        {hasExpired && (
                          <Text color="gray" fontSize="sm">
                            This POAP has expired.
                          </Text>
                        )}
                      </>
                    )}
                  </>
                )}
              </Stack>
            </Card>

            <Modal {...{ isOpen, onOpen, onClose }}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Congratulations!</ModalHeader>

                <ModalBody>
                  <Text>
                    {`You're eligible to claim the ${poap?.name} POAP! Here's your claim link:`}
                  </Text>
                  <Link
                    mt={4}
                    maxW="full"
                    href={response ?? ""}
                    colorScheme="blue"
                    isExternal
                    fontWeight="semibold"
                  >
                    <Text as="span" isTruncated>
                      {response}
                    </Text>
                    <Icon as={ArrowSquareOut} mx={1} />
                  </Link>
                </ModalBody>

                <ModalFooter pt={0}>
                  <Button colorScheme="indigo" onClick={onClose}>
                    Dismiss
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
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
