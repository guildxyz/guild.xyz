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
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import Link from "components/common/Link"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import LogicDivider from "components/[guild]/LogicDivider"
import PoapReward from "components/[guild]/RoleCard/components/PoapReward"
import { ArrowSquareOut, PencilSimple } from "phosphor-react"
import { useMemo } from "react"
import FreeRequirement from "requirements/Free/FreeRequirement"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import PoapPaymentRequirement from "requirements/PoapPayment/PoapPaymentRequirement"
import { GuildPoap } from "types"
import parseDescription from "utils/parseDescription"
import usePoapLinks from "../../hooks/usePoapLinks"
import usePoapVault from "../../hooks/usePoapVault"
import { useCreatePoapContext } from "../CreatePoapContext"

type Props = {
  poap: GuildPoap
}

const PoapRoleCard = ({ poap: guildPoap }: Props): JSX.Element => {
  const poapFancyId = guildPoap?.fancyId
  const { isAdmin } = useGuildPermission()

  const { chainId } = useWeb3React()
  const { urlName } = useGuild()
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
    () => (!poap ? false : guildPoap?.activated),
    [poap, guildPoap]
  )
  const isReady = poapLinks && poapLinks?.total > 0

  const status = isExpired
    ? { label: "Expired", tooltip: "Your POAP has expired.", color: "gray" }
    : isActive
    ? { label: "Active", tooltip: "Your poap is being distributed.", color: "green" }
    : isReady
    ? {
        label: "Pending",
        tooltip: "You can send the Discord mint button.",
        color: "yellow",
      }
    : {
        label: "Setup required",
        tooltip: "You haven't uploaded the mint links for your POAP yet.",
        color: "gray",
      }

  const { colorMode } = useColorMode()

  return (
    <Card
      sx={{
        ":target": {
          boxShadow: "var(--chakra-shadows-outline)",
        },
      }}
      borderWidth={2}
      borderColor={status.color}
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
                  <Tooltip label={status.tooltip}>
                    <Tag colorScheme={status.color}>{status.label}</Tag>
                  </Tooltip>
                  {isReady && (
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
            {false && isAdmin && (
              <>
                <Spacer m="0 !important" />
                <IconButton
                  icon={<Icon as={PencilSimple} />}
                  size="sm"
                  rounded="full"
                  aria-label="Edit role"
                  onClick={() => {
                    setPoapData(poap)
                    setStep(0)
                  }}
                />
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
          </HStack>

          <Stack>
            {guildPoap?.poapContracts?.map((poapContract) => (
              <PoapPaymentRequirement
                key={poapContract.id}
                poapContract={poapContract}
                poap={guildPoap}
              />
            )) ?? <FreeRequirement />}
            {/* {poap?.poapContracts?.map() ? (
              <Tag>
                {isVaultLoading ? (
                  <Spinner size="xs" />
                ) : (
                  <PoapPaymentRequirement poap={guildPoap} />
                )}
              </Tag>
            ) : (
              <FreeRequirement />
            )} */}
            {false && <LogicDivider logic={"AND"} />}
          </Stack>

          {/* <RoleRequirements role={role} /> */}
        </Flex>
      </SimpleGrid>
    </Card>
  )
}

export default PoapRoleCard
