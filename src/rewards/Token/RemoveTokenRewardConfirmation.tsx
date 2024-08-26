import {
  Alert,
  AlertIcon,
  Collapse,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useRemoveGuildPlatform from "components/[guild]/AccessHub/hooks/useRemoveGuildPlatform"
import Button from "components/common/Button"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import WithdrawPoolModal from "./WithdrawPoolModal"
import usePool from "./hooks/usePool"

const RemoveTokenRewardConfirmation = ({ isOpen, onClose, guildPlatform }) => {
  const { onSubmit, isLoading, isSigning } = useRemoveGuildPlatform(guildPlatform.id)

  const { data: poolData, refetch } = usePool(
    guildPlatform.platformGuildData.chain,
    BigInt(guildPlatform.platformGuildData.poolId)
  )
  const { balance: poolBalance } = poolData

  const {
    isOpen: withdrawIsOpen,
    onOpen: withdrawOnOpen,
    onClose: withdrawOnClose,
  } = useDisclosure()

  return (
    <>
      <ConfirmationAlert
        isLoading={isLoading}
        loadingText={isSigning && "Check your wallet"}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSubmit}
        title="Remove reward"
        description={
          <>
            <Collapse in={!!poolBalance}>
              <Alert status="warning">
                <Stack>
                  <HStack gap={0}>
                    <AlertIcon mt={0} />{" "}
                    <Text fontWeight={"bold"}>Funds remaining in pool</Text>
                  </HStack>{" "}
                  <Text>
                    After deletion, you will not be able to witdhraw the pool's funds
                    through Guild.
                  </Text>
                  <Button colorScheme="orange" onClick={withdrawOnOpen}>
                    Withdraw
                  </Button>
                </Stack>
              </Alert>
            </Collapse>

            <Collapse in={!poolBalance}>
              Are you sure you want to remove this reward?
            </Collapse>
          </>
        }
        confirmationText="Remove"
      />
      <WithdrawPoolModal
        isOpen={withdrawIsOpen}
        onClose={withdrawOnClose}
        onSuccess={refetch}
      />
    </>
  )
}

export default RemoveTokenRewardConfirmation
