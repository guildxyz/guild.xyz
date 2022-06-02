import {
  HStack,
  Img,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react"
import usePoap from "components/[guild]/Requirements/components/PoapRequirementCard/hooks/usePoap"
import { useMemo } from "react"
import { useCreatePoapContext } from "./CreatePoapContext"

type Props = {
  poapFancyId: string
}

// TODO: get the connected claim links from the BE. If claimLinks.length < 1 => inactive, otherwise active
const IS_ACTIVE = false
const DC_CLAIM_SENT = true

const PoapListItem = ({ poapFancyId }: Props): JSX.Element => {
  const { poap, isLoading } = usePoap(poapFancyId)
  const { setPoapData } = useCreatePoapContext()

  const isExpired = useMemo(() => {
    if (!poap) return false
    const currentTime = Date.now()
    const expiryTime = new Date(poap.expiry_date)?.getTime()
    return currentTime >= expiryTime
  }, [poap])

  const tooltipLabel = IS_ACTIVE
    ? "Your poap is being distributed."
    : !DC_CLAIM_SENT
    ? "You can send the Discord claim button."
    : isExpired
    ? "Your POAP has expired."
    : "You haven't uploaded the mint links for your POAP yet."

  const statusText = IS_ACTIVE
    ? "Active"
    : !DC_CLAIM_SENT
    ? "Pending"
    : isExpired
    ? "Expired"
    : "Inactive"

  const statusColor = IS_ACTIVE
    ? "green.500"
    : !DC_CLAIM_SENT
    ? "yellow.500"
    : isExpired
    ? "red.500"
    : "gray.500"

  return (
    <HStack
      as="button"
      // alignItems="start"
      onClick={() => setPoapData(poap as any)}
      spacing={3}
    >
      <SkeletonCircle boxSize={14} isLoaded={!isLoading && !!poap?.image_url}>
        <Img src={poap?.image_url} alt={poap?.name} boxSize={14} rounded="full" />
      </SkeletonCircle>
      <VStack alignItems="start" spacing={1}>
        <Skeleton isLoaded={!isLoading && !!poap?.name}>
          <Text as="span" fontWeight="bold">
            {poap?.name ?? "Loading POAP..."}
          </Text>
        </Skeleton>

        {/* <Skeleton isLoaded={!isLoading && !!poap}>

      </Skeleton> */}
        {/* <HStack spacing={1}>
          <Circle size={3} position="relative" bgColor={statusColor} />
          <Tooltip label={tooltipLabel}>
            <Text as="span" fontSize="sm" color="gray">
              {statusText}
            </Text>
          </Tooltip>
        </HStack> */}
      </VStack>
    </HStack>
  )
}

export default PoapListItem
