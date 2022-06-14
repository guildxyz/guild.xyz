import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
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
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
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
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
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
  const { theme, name, poaps } = useGuild()
  const { poap, isLoading } = usePoap(router.query.fancyId?.toString())
  const {
    poapLinks,
    isPoapLinksLoading,
    mutate: mutatePoapLinks,
  } = usePoapLinks(poap?.id)

  const { account } = useWeb3React()
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

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Head>
        <title>
          {correctPoap && name ? `${name} - claim your POAP` : "Claim your POAP"}
        </title>
      </Head>

      <Header showBackButton={true} />
      <Container maxW="container.sm" pt={{ base: 16, md: 24 }} pb={12}>
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
                px={{ base: 5, sm: 6 }}
                pt={12}
                pb={7}
                alignItems="center"
                spacing={4}
              >
                <Skeleton isLoaded={poap && !isLoading}>
                  <Heading
                    as="h2"
                    fontSize="lg"
                    fontFamily="display"
                    textAlign="center"
                  >
                    Claim your
                    <br />
                    <Text as="span" fontSize="2xl">{` ${poap?.name} `}</Text>
                  </Heading>
                </Skeleton>

                <Skeleton isLoaded={poapLinks && !isPoapLinksLoading}>
                  <Text
                    color="gray"
                    fontWeight="bold"
                    fontSize="sm"
                    textTransform="uppercase"
                  >
                    {`${poapLinks?.claimed}/${poapLinks?.total} claimed`}
                  </Text>
                </Skeleton>

                <SkeletonText isLoaded={poap && !isLoading}>
                  <Text color="gray" textAlign="center">
                    {poap?.description}
                  </Text>
                </SkeletonText>

                <HStack pt={8} spacing={2}>
                  <Button
                    isDisabled={
                      !account || hasPaid || hasPaidLoading || isPayFeeLoading
                    }
                    isLoading={hasPaidLoading || isPayFeeLoading}
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
                    {hasPaid ? "Paid" : "Pay"}
                  </Button>
                  <Button
                    colorScheme="indigo"
                    isDisabled={
                      isLoading || isClaimPoapLoading || !account || !hasPaid
                    }
                    isLoading={isClaimPoapLoading}
                    loadingText="Claiming POAP"
                    leftIcon={<Icon as={DownloadSimple} />}
                    onClick={response ? handleSuccess : onClaimPoapSubmit}
                  >
                    Claim
                  </Button>
                </HStack>
                {!account && (
                  <Text color="gray" fontSize="sm">
                    Please connect your wallet in order to claim this POAP.
                  </Text>
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
