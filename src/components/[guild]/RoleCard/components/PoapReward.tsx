import { Circle, HStack, Icon, Img, Tag, Text, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import { Poap } from "types"

type Props = {
  poap: Poap
}

const PoapReward = ({ poap }: Props) => {
  const isMember = useIsMember()
  const { account } = useWeb3React()
  const openJoinModal = useOpenJoinModal()
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(poap?.id)

  return (
    <HStack pt="3" spacing={0} alignItems={"flex-start"}>
      <Circle size={6} overflow="hidden">
        <Img src={`/platforms/poap.png`} alt={"POAP image"} boxSize={6} />
      </Circle>
      <Text px="2" maxW="calc(100% - var(--chakra-sizes-12))">
        {"Claim: "}
        {!account || !isMember ? (
          <Tooltip
            label={
              <>
                <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
                Join guild to get access
              </>
            }
            hasArrow
          >
            <Button
              variant="link"
              rightIcon={<ArrowSquareOut />}
              iconSpacing="1"
              onClick={openJoinModal}
              maxW="full"
            >
              {poap?.name}
            </Button>
          </Tooltip>
        ) : (
          <Text as="span" fontWeight={"semibold"}>
            {poap?.name}
          </Text>
        )}
        <Tag ml="2">{`${poapLinks?.total - poapLinks?.claimed} available`}</Tag>
      </Text>
    </HStack>
  )
}

export default PoapReward
