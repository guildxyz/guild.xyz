import {
  Circle,
  HStack,
  Icon,
  Img,
  Skeleton,
  Spinner,
  Tag,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import useIsMember from "components/[guild]/hooks/useIsMember"
import Button from "components/common/Button"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import { useMemo } from "react"
import { Poap } from "types"
import { useAccount } from "wagmi"
import useMintPoapButton, { MintModal } from "../hooks/useMintPoapButton"

type Props = {
  poap: Poap
  isExpired?: boolean
  isInteractive?: boolean
  isLinkColorful?: boolean
}

/**
 * This is copy-pasted from Reward and adjusted to work with legacy POAP logic. Will
 * delete once POAP is a real reward
 */
const PoapReward = ({
  poap,
  isExpired,
  isInteractive = true,
  isLinkColorful,
}: Props) => {
  const isMember = useIsMember()
  const { isConnected } = useAccount()
  const openJoinModal = useOpenJoinModal()
  const { poapLinks } = usePoapLinks(poap?.id)
  const availableLinks = poapLinks?.total - poapLinks?.claimed

  const { data, isLoading } = useUserPoapEligibility(poap?.id)
  const hasAccess = data?.access

  const { buttonProps, modalProps } = useMintPoapButton(poap?.id)

  const state = useMemo(() => {
    if (availableLinks === 0 && !modalProps.response)
      return {
        tooltipLabel: poapLinks?.total
          ? "All available POAPs have been minted"
          : "Minting links not uploaded yet",
        buttonProps: { isDisabled: true },
      }
    if (isMember && hasAccess)
      return {
        tooltipLabel: "Go to minting page",
        buttonProps: isLinkColorful
          ? { ...buttonProps, colorScheme: "blue" }
          : buttonProps,
      }
    if (!isConnected || (!isMember && hasAccess))
      return {
        tooltipLabel: (
          <>
            <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
            Join guild to get access
          </>
        ),
        buttonProps: { onClick: openJoinModal },
      }
    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      buttonProps: { isDisabled: true },
    }
  }, [isMember, hasAccess, isConnected, availableLinks, isLinkColorful])

  return (
    <HStack pt="3" spacing={2} alignItems={"flex-start"}>
      <Circle size={6} overflow="hidden">
        <Img src={`/platforms/poap.png`} alt={"POAP image"} boxSize={6} />
      </Circle>
      <Wrap spacingY="1" w="full">
        <Text maxW="calc(100% - var(--chakra-sizes-3))">
          {"Claim: "}
          {isExpired || !isInteractive || !poap ? (
            <Skeleton as="span" isLoaded={!!poap}>
              <Text as="span" fontWeight={"semibold"}>
                {poap?.name ?? "Loading POAP name..."}
              </Text>
            </Skeleton>
          ) : (
            <Tooltip label={state.tooltipLabel} hasArrow>
              <Button
                variant="link"
                rightIcon={
                  isLoading ? <Spinner boxSize="1em" /> : <ArrowSquareOut />
                }
                iconSpacing="1"
                maxW="full"
                {...state.buttonProps}
              >
                {poap?.name}
              </Button>
            </Tooltip>
          )}
        </Text>
        {poapLinks &&
          (isExpired ? (
            <Tag>{`${poapLinks?.claimed}/${poapLinks?.total} minted`}</Tag>
          ) : (
            <Tag>{`${availableLinks}/${poapLinks?.total} available`}</Tag>
          ))}
      </Wrap>
      <MintModal {...modalProps} />
    </HStack>
  )
}

export default PoapReward
