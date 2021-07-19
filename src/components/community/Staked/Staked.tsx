import {
  Box,
  Button,
  chakra,
  ScaleFade,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import ActionCard from "components/common/ActionCard"
import { useEffect } from "react"
import msToReadableFormat from "utils/msToReadableFormat"
import { useCommunity } from "../Context"
import UnstakingModal from "./components/UnstakingModal/UnstakingModal"
import useStaked from "./hooks/useStaked"
import formatDate from "./utils/formatDate"

const Staked = (): JSX.Element => {
  const {
    chainData: {
      token: { symbol },
    },
  } = useCommunity()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { unlockedAmount, locked } = useStaked()

  // close modal on unstake success
  useEffect(() => {
    if (!unlockedAmount) onClose()
  }, [unlockedAmount, onClose])

  return (
    <ScaleFade
      in={!!unlockedAmount || !!locked.length}
      initialScale={0.9}
      unmountOnExit
    >
      <ActionCard
        title="Staked"
        description={[
          !!unlockedAmount && (
            <chakra.span display="block" key="unlocked">
              {unlockedAmount} {symbol}
            </chakra.span>
          ),
          ...locked.map(({ amount, expires, id }) => (
            <chakra.span display="block" key={id}>
              {amount} {symbol} - locked until {formatDate(expires)}
            </chakra.span>
          )),
        ]}
      >
        <Tooltip
          isDisabled={!!unlockedAmount}
          label={`You can't unstake yet, your next timelock expires in ${msToReadableFormat(
            Math.min(...locked.map(({ expires }) => +expires)) - Date.now()
          )}`}
        >
          <Box>
            <Button
              disabled={!unlockedAmount}
              colorScheme="primary"
              fontWeight="medium"
              onClick={onOpen}
            >
              Unstake
            </Button>
          </Box>
        </Tooltip>
      </ActionCard>
      <UnstakingModal isOpen={isOpen} onClose={onClose} />
    </ScaleFade>
  )
}

export default Staked
