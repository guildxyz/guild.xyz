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
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import Button from "components/common/Button"
import Link from "components/common/Link"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import useTokenData from "hooks/useTokenData"
import { CoinVertical, DiscordLogo, Plus, Upload, Wallet } from "phosphor-react"
import { useEffect, useMemo } from "react"
import getRandomInt from "utils/getRandomInt"
import usePoapLinks from "../../hooks/usePoapLinks"
import usePoapVault from "../../hooks/usePoapVault"
import { useCreatePoapContext } from "../CreatePoapContext"
import useWithDraw from "./hooks/useWithdraw"

type Props = {
  isDisabled?: boolean
  setStep: (step: number) => void
  poapFancyId: string
  onClose: () => void
}

const PoapListItem = ({
  isDisabled,
  setStep,
  poapFancyId,
  onClose,
}: Props): JSX.Element => {
  const { id, urlName, poaps, roles, platforms } = useGuild()
  const { poap, isLoading } = usePoap(poapFancyId)
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)
  const { vaultData, isVaultLoading } = usePoapVault(poap?.id)

  // TODO: dynamic chain
  const {
    data: { symbol },
    isValidating: isTokenDataLoading,
  } = useTokenData("GOERLI", vaultData?.token)

  const { setPoapData } = useCreatePoapContext()

  const isExpired = useMemo(() => {
    if (!poap) return false
    const currentTime = Date.now()
    const expiryTime = new Date(poap.expiry_date)?.getTime()
    return currentTime >= expiryTime
  }, [poap])

  const isActive = useMemo(
    () =>
      !poap || !poaps
        ? false
        : poaps.find((p) => p.poapIdentifier === poap.id)?.activated,
    [poap, poaps]
  )
  const isReady = useMemo(() => poapLinks && poapLinks?.total > 0, [poapLinks])

  const tooltipLabel = isActive
    ? "Your poap is being distributed."
    : isReady && !isExpired
    ? "You can send the Discord claim button."
    : isExpired
    ? "Your POAP has expired."
    : "You haven't uploaded the mint links for your POAP yet."

  const statusText = isActive
    ? "Active"
    : isReady && !isExpired
    ? "Pending"
    : isExpired
    ? "Expired"
    : "Setup required"

  const statusColor = isActive
    ? "green.500"
    : isReady && !isExpired
    ? "yellow.500"
    : "gray.500"

  const isTagLoading = isVaultLoading || !vaultData || isTokenDataLoading

  const roleExistsWithThisPoap = useMemo(
    () =>
      !!roles
        ?.map((role) => role.requirements)
        ?.flat()
        ?.find(
          (requirement) =>
            requirement.type === "POAP" && requirement.data?.id === poapFancyId
        ),
    [roles, poapFancyId]
  )

  const { onSubmit, isLoading: isCreateRoleLoading, response } = useCreateRole()

  const createRoleWithPoap = () =>
    onSubmit({
      guildId: id,
      ...(platforms?.[0]
        ? {
            platform: platforms[0].type,
            platformId: platforms[0].platformId,
          }
        : {}),
      logic: "AND",
      name: `${poap?.name ?? "POAP"} owner`,
      imageUrl: poap?.image_url ?? `/guildLogos/${getRandomInt(286)}.svg`,
      requirements: [
        {
          type: "POAP",
          data: {
            id: poapFancyId,
          },
        },
      ],
    })

  useEffect(() => {
    if (!response) return
    onClose()
  }, [response])

  const sendClaimButtonText = useBreakpointValue({
    base: "Send",
    md: isActive ? "Send claim button" : "Set up Discord claim",
  })

  const { onSubmit: onWithdrawSubmit, isLoading: isWithdrawLoading } = useWithDraw()

  return (
    <HStack
      alignItems="start"
      spacing={{ base: 2, md: 3 }}
      py={1}
      opacity={isDisabled ? 0.5 : 1}
    >
      <SkeletonCircle
        boxSize={{ base: 10, md: 14 }}
        isLoaded={!isLoading && !!poap?.image_url}
      >
        <Box position="relative" boxSize={{ base: 10, md: 14 }}>
          <Img
            src={poap?.image_url}
            alt={poap?.name}
            boxSize={{ base: 10, md: 14 }}
            rounded="full"
          />

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
              bgColor={vaultData?.fee ? "indigo.500" : "gray.600"}
              color="white"
              borderColor="gray.800"
              borderWidth={2}
              colorScheme={vaultData?.fee ? "indigo" : "green"}
            >
              {isTagLoading ? (
                <Spinner size="xs" />
              ) : (
                <TagLabel isTruncated>
                  {vaultData?.fee
                    ? `${formatUnits(
                        vaultData?.fee?.toString() ?? "0",
                        18
                      )} ${symbol}`
                    : "Free"}
                </TagLabel>
              )}
            </Tag>
          </Flex>
        </Box>
      </SkeletonCircle>
      <VStack pt={1} alignItems="start" spacing={0}>
        <Skeleton isLoaded={!isLoading && !!poap?.name}>
          <Text as="span" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
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
                  <Text as="span" fontSize="xs" color="gray">
                    {statusText}
                  </Text>
                </Tooltip>
              </HStack>

              {isActive && (
                <Text pt={0.5} as="span" fontSize="xs" color="gray">
                  {` • ${poapLinks?.claimed}/${poapLinks?.total} `}
                  <Text as="span" display={{ base: "none", md: "inline" }}>
                    claimed
                  </Text>
                </Text>
              )}

              {isReady && (
                <Text pt={0.5} as="span" fontSize="xs" color="gray">
                  {` • `}
                  <Link href={`/${urlName}/claim-poap/${poapFancyId}`}>
                    Claim page
                  </Link>
                </Text>
              )}
            </HStack>
          </Skeleton>
        </Box>

        <HStack spacing={1}>
          {!isReady && !isActive && (
            <Button
              size="xs"
              rounded="lg"
              leftIcon={<Icon as={Upload} />}
              onClick={() => {
                setPoapData(poap as any)
                setStep(1)
              }}
              isDisabled={isDisabled}
            >
              Upload mint links
            </Button>
          )}

          {!isVaultLoading && !vaultData?.id && isReady && !isActive && (
            <Button
              size="xs"
              rounded="lg"
              leftIcon={<Icon as={CoinVertical} />}
              onClick={() => {
                setPoapData(poap as any)
                setStep(2)
              }}
              isDisabled={isDisabled}
            >
              Monetize
            </Button>
          )}

          {/* TODO: show this btn only if there are funds to withdraw */}
          {!isVaultLoading && vaultData?.fee && (
            <Button
              size="xs"
              rounded="lg"
              leftIcon={<Icon as={Wallet} />}
              onClick={() => onWithdrawSubmit(vaultData?.id)}
              isLoading={isWithdrawLoading}
              loadingText="Withdrawing funds"
              isDisabled={isDisabled}
            >
              Withdraw
            </Button>
          )}

          {isReady && (
            <Button
              size="xs"
              rounded="lg"
              leftIcon={<Icon as={DiscordLogo} />}
              onClick={() => {
                setPoapData(poap as any)
                setStep(3)
              }}
              isDisabled={isDisabled}
            >
              {sendClaimButtonText}
            </Button>
          )}

          {isReady && !roleExistsWithThisPoap && (
            <Button
              size="xs"
              rounded="lg"
              leftIcon={<Icon as={Plus} />}
              onClick={createRoleWithPoap}
              isLoading={isCreateRoleLoading}
              loadingText="Creating role"
              isDisabled={isDisabled}
            >
              Role
            </Button>
          )}
        </HStack>
      </VStack>
    </HStack>
  )
}

export default PoapListItem
