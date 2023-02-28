import {
  Circle,
  HStack,
  Icon,
  Img,
  Skeleton,
  Tag,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import MintPoapButton from "components/[guild]/CreatePoap/components/MintPoapButton"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import { useMemo } from "react"
import { Poap } from "types"

type Props = {
  poap: Poap
  isExpired?: boolean
  isInteractive?: boolean
}

const PoapReward = ({ poap, isExpired, isInteractive = true }: Props) => {
  const isMember = useIsMember()
  const { account } = useWeb3React()
  const openJoinModal = useOpenJoinModal()
  const { poapLinks } = usePoapLinks(poap?.id)
  const availableLinks = poapLinks?.total - poapLinks?.claimed

  const { data } = useUserPoapEligibility(poap?.id)
  const hasAccess = data?.access

  const state = useMemo(() => {
    if (availableLinks === 0)
      return {
        tooltipLabel: "All available POAPs have been minted",
        buttonProps: { isDisabled: true },
      }
    if (isMember && hasAccess)
      return {
        tooltipLabel: "Go to minting page",
        showMintButton: true,
      }
    if (!account || (!isMember && hasAccess))
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
  }, [isMember, hasAccess, account, availableLinks])

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
              {state.showMintButton ? (
                <MintPoapButton
                  poapId={poap?.id}
                  variant="link"
                  maxW="full"
                  iconSpacing="1"
                >
                  {poap?.name}
                </MintPoapButton>
              ) : (
                <Button
                  variant="link"
                  rightIcon={<ArrowSquareOut />}
                  iconSpacing="1"
                  maxW="full"
                  {...state.buttonProps}
                >
                  {poap?.name}
                </Button>
              )}
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
    </HStack>
  )
}

export default PoapReward
