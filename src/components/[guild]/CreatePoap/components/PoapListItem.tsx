import {
  Circle,
  HStack,
  Icon,
  Img,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import { DiscordLogo, Upload } from "phosphor-react"
import { useMemo } from "react"
import usePoapLinks from "../hooks/usePoapLinks"
import { useCreatePoapContext } from "./CreatePoapContext"

type Props = {
  isDisabled?: boolean
  setStep: (step: number) => void
  poapFancyId: string
}

const PoapListItem = ({ isDisabled, setStep, poapFancyId }: Props): JSX.Element => {
  const { poaps } = useGuild()
  const { poap, isLoading } = usePoap(poapFancyId)
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)

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

  return (
    <HStack
      alignItems="center"
      spacing={{ base: 2, md: 3 }}
      py={1}
      opacity={isDisabled ? 0.5 : 1}
    >
      <SkeletonCircle
        boxSize={{ base: 10, md: 14 }}
        isLoaded={!isLoading && !!poap?.image_url}
      >
        <Img
          src={poap?.image_url}
          alt={poap?.name}
          boxSize={{ base: 10, md: 14 }}
          rounded="full"
        />
      </SkeletonCircle>
      <VStack alignItems="start" spacing={0}>
        <Skeleton isLoaded={!isLoading && !!poap?.name}>
          <Text as="span" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
            {poap?.name ?? "Loading POAP..."}
          </Text>
        </Skeleton>

        <Skeleton
          isLoaded={!isLoading && !!poap && !isPoapLinksLoading && !!poapLinks}
        >
          <HStack>
            <HStack spacing={0} pt={0.5}>
              <Circle size={2.5} mr={1} bgColor={statusColor} />
              <Tooltip label={tooltipLabel}>
                <Text as="span" fontSize="xs" color="gray">
                  {statusText}
                </Text>
              </Tooltip>
            </HStack>

            {!isReady && !isActive && (
              <Button
                size="xs"
                rounded="lg"
                variant="ghost"
                leftIcon={<Icon as={Upload} />}
                onClick={() => {
                  setPoapData(poap as any)
                  setStep(2)
                }}
                isDisabled={isDisabled}
              >
                Upload mint links
              </Button>
            )}

            {isActive && (
              <Text pt={0.5} as="span" fontSize="xs" color="gray">
                {` • ${poapLinks?.claimed}/${poapLinks?.total} `}
                <Text as="span" display={{ base: "none", md: "inline" }}>
                  claimed
                </Text>
              </Text>
            )}

            {isReady && (
              <Button
                size="xs"
                rounded="lg"
                variant="ghost"
                leftIcon={<Icon as={DiscordLogo} />}
                onClick={() => {
                  setPoapData(poap as any)
                  setStep(3)
                }}
                isDisabled={isDisabled}
              >
                {isActive ? "Send claim button" : "Set up Discord claim"}
              </Button>
            )}
          </HStack>
        </Skeleton>
      </VStack>
    </HStack>
  )
}

export default PoapListItem
