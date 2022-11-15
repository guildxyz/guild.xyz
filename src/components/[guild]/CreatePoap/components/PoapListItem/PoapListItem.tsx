import {
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Img,
  Skeleton,
  SkeletonCircle,
  Spinner,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import Link from "components/common/Link"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains, RPC } from "connectors"
import {
  ArrowSquareOut,
  CircleWavyCheck,
  Gear,
  ShieldCheck,
  Upload,
} from "phosphor-react"
import { useMemo } from "react"
import { usePoap } from "requirements/formComponents/PoapForm/hooks/usePoaps"
import usePoapLinks from "../../hooks/usePoapLinks"
import usePoapVault from "../../hooks/usePoapVault"
import { useCreatePoapContext } from "../CreatePoapContext"
import ActionButton from "./components/ActionButton"
import Withdraw from "./components/Withdraw"

type Props = {
  poapFancyId: string
}

const PoapListItem = ({ poapFancyId }: Props): JSX.Element => {
  const borderColor = useColorModeValue("blackAlpha.300", "blackAlpha.600")

  const { chainId } = useWeb3React()
  const { urlName, poaps } = useGuild()
  const guildPoap = poaps?.find((p) => p.fancyId === poapFancyId)
  const guildPoapChainId = guildPoap?.poapContracts
    ?.map((poapContract) => poapContract.chainId)
    ?.includes(chainId)
    ? chainId
    : guildPoap?.poapContracts?.[0]?.chainId
  const { poap, isLoading } = usePoap(poapFancyId)
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)

  const vaultId = guildPoap?.poapContracts
    ?.map((poapContract) => poapContract.chainId)
    ?.includes(chainId)
    ? guildPoap?.poapContracts?.find(
        (poapContract) => poapContract?.chainId === chainId
      )?.vaultId
    : guildPoap?.poapContracts?.[0]?.vaultId
  const { vaultData, isVaultLoading, vaultError } = usePoapVault(
    vaultId,
    guildPoapChainId
  )

  const { setStep, setPoapData } = useCreatePoapContext()

  const isExpired = useMemo(() => {
    if (!poap) return false
    const currentTime = Date.now()

    // Hotfix so it works well in Firefox too
    const [day, month, year] = poap.expiry_date?.split("-")
    const convertedPoapExpiryDate = `${day}-${month}${year}`

    const expiryTime = new Date(convertedPoapExpiryDate)?.getTime()

    return currentTime >= expiryTime
  }, [poap])

  const isActive = useMemo(
    () =>
      !poap || !poaps
        ? false
        : poaps.find((p) => p.poapIdentifier === poap.id)?.activated,
    [poap, poaps]
  )
  const isReady = poapLinks && poapLinks?.total > 0

  const tooltipLabel = isExpired
    ? "Your POAP has expired."
    : isActive
    ? "Your poap is being distributed."
    : isReady
    ? "You can send the Discord claim button."
    : "You haven't uploaded the mint links for your POAP yet."

  const statusText = isExpired
    ? "Expired"
    : isActive
    ? "Active"
    : isReady
    ? "Pending"
    : "Setup required"

  const statusColor = isExpired
    ? "gray.500"
    : isActive
    ? "green.500"
    : isReady
    ? "yellow.500"
    : "gray.500"

  return (
    <Card>
      <HStack
        alignItems="start"
        spacing={{ base: 2, md: 3 }}
        p={4}
        borderRadius="xl"
      >
        <SkeletonCircle
          boxSize={{ base: 14, md: 16 }}
          isLoaded={!isLoading && !!poap?.image_url}
        >
          <Box position="relative" boxSize={{ base: 14, md: 16 }}>
            <Img
              src={poap?.image_url}
              alt={poap?.name}
              boxSize={{ base: 14, md: 16 }}
              rounded="full"
            />

            {guildPoapChainId && (
              <Tooltip label={RPC[Chains[guildPoapChainId]]?.chainName}>
                <Circle
                  position="absolute"
                  top={{ base: -1, md: 0 }}
                  left={{ base: -1, md: 0 }}
                  size={5}
                  bgColor={"gray.100"}
                  borderWidth={1}
                  borderColor={borderColor}
                >
                  <Img
                    src={RPC[Chains[guildPoapChainId]]?.iconUrls?.[0]}
                    alt={RPC[Chains[guildPoapChainId]]?.chainName}
                    boxSize={3}
                  />
                </Circle>
              </Tooltip>
            )}

            <Flex
              position="absolute"
              left={0}
              right={0}
              bottom={-2}
              justifyContent="center"
            >
              <Tag
                size="sm"
                w="full"
                justifyContent="center"
                m={0}
                py={0}
                px={1}
                textTransform="uppercase"
                fontSize="xx-small"
                bgColor={
                  vaultError ? "red.500" : vaultData?.fee ? "indigo.500" : "gray.500"
                }
                color="white"
                borderWidth={1}
                borderColor={borderColor}
              >
                {isVaultLoading ? (
                  <Spinner size="xs" />
                ) : (
                  <TagLabel noOfLines={1}>
                    {vaultError ? "Error" : vaultData?.fee ? "Monetized" : "Free"}
                  </TagLabel>
                )}
              </Tag>
            </Flex>
          </Box>
        </SkeletonCircle>
        <VStack
          pt={1}
          alignItems="start"
          spacing={0}
          maxW={{
            base: "calc(100% - var(--chakra-space-14))",
            md: "calc(100% - var(--chakra-space-20))",
          }}
        >
          <Skeleton isLoaded={!isLoading && !!poap?.name} maxW="full">
            <Text
              as="span"
              display="block"
              fontWeight="bold"
              fontSize={{ base: "sm", md: "md" }}
              w="full"
              noOfLines={1}
            >
              {poap?.name ?? "Loading POAP..."}
            </Text>
          </Skeleton>

          <Box py={0.5}>
            <Skeleton
              isLoaded={!isLoading && !!poap && !isPoapLinksLoading && !!poapLinks}
            >
              <HStack pb={2} spacing={1}>
                <HStack spacing={0}>
                  <Circle size={2.5} mr={1} bgColor={statusColor} />
                  <Tooltip label={tooltipLabel}>
                    <Text as="span" fontSize="xs" colorScheme="gray">
                      {statusText}
                    </Text>
                  </Tooltip>
                </HStack>

                {isActive && (
                  <Text as="span" fontSize="xs" colorScheme="gray">
                    {` • ${poapLinks?.claimed}/${poapLinks?.total} `}
                    <Text as="span" display={{ base: "none", md: "inline" }}>
                      claimed
                    </Text>
                  </Text>
                )}

                {isReady && (
                  <Text as="span" fontSize="xs" colorScheme="gray">
                    {` • `}
                    <Link href={`/${urlName}/claim-poap/${poapFancyId}`} isExternal>
                      <Text as="span">Claim page</Text>
                      <Icon ml={1} as={ArrowSquareOut} />
                    </Link>
                  </Text>
                )}
              </HStack>
            </Skeleton>
          </Box>

          <Wrap spacing={1}>
            <ActionButton
              leftIcon={Gear}
              onClick={() => {
                setPoapData(poap)
                setStep(0)
              }}
            >
              Manage
            </ActionButton>

            {!isExpired && (
              <ActionButton
                leftIcon={Upload}
                onClick={() => {
                  setPoapData(poap)
                  setStep(1)
                }}
              >
                Upload mint links
              </ActionButton>
            )}

            {!isExpired && !isActive && (
              <ActionButton
                leftIcon={ShieldCheck}
                onClick={() => {
                  setPoapData(poap)
                  setStep(2)
                }}
                disabled={isExpired}
              >
                Set requirements
              </ActionButton>
            )}

            {isActive && <Withdraw poapId={guildPoap?.id} />}

            {!isExpired && isReady && (
              <ActionButton
                leftIcon={CircleWavyCheck}
                onClick={() => {
                  setPoapData(poap)
                  setStep(3)
                }}
              >
                Distribute
              </ActionButton>
            )}
          </Wrap>
        </VStack>
      </HStack>
    </Card>
  )
}

export default PoapListItem
