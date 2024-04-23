import {
  Box,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Tag,
  TagProps,
  TagRightIcon,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import ClickableTagPopover from "components/[guild]/activity/ActivityLogAction/components/ClickableTagPopover"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import useToast from "hooks/useToast"
import { Coin, DotsThreeVertical, Wallet } from "phosphor-react"
import FundPoolModal from "platforms/Token/FundPoolModal"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import usePool from "platforms/Token/hooks/usePool"
import useWithdrawPool from "platforms/Token/hooks/useWithdrawPool"
import { useState } from "react"
import { formatUnits } from "viem"

const PoolTag = ({ poolId, ...rest }: { poolId: bigint } & TagProps) => {
  const {
    token: {
      data: { decimals },
      isLoading: isTokenLoading,
    },
    guildPlatform,
  } = useTokenRewardContext()

  const chain = guildPlatform.platformGuildData.chain

  const { data, isLoading, error, refetch } = usePool(chain, poolId)

  const toast = useToast()

  const { onSubmitTransaction: onSubmitWithdraw, isLoading: withdrawIsLoading } =
    useWithdrawPool(chain, poolId, () => {
      toast({
        status: "success",
        title: "Success",
        description: "Successfully withdrawed all funds from the pool!",
      })
      withdrawOnClose()
      refetch()
    })

  const { colorMode } = useColorMode()
  const [showClaimed, setShowClaimed] = useState(false)
  const {
    isOpen: fundIsOpen,
    onOpen: fundOnOpen,
    onClose: fundOnClose,
  } = useDisclosure()

  const {
    isOpen: withdrawIsOpen,
    onOpen: withdrawOnOpen,
    onClose: withdrawOnClose,
  } = useDisclosure()

  if (isLoading)
    return (
      <Tag>
        <Skeleton isLoaded={!isLoading && !isTokenLoading}></Skeleton>
      </Tag>
    )
  if (error) return <Tag>Failed to load balance</Tag>

  const [owner, , totalFunding, poolBalance] = data
  const capacity = Number(formatUnits(totalFunding, decimals))
  const balance = Number(formatUnits(poolBalance, decimals))

  const claimedCount = Number((capacity - balance).toFixed(4))
  const available = Number(
    (capacity - claimedCount < 0 ? 0 : capacity - claimedCount).toFixed(4)
  )

  const isWithdrawDisabled = balance === 0

  return (
    <>
      <Tag {...rest}>
        <Tooltip label={showClaimed ? "Show available" : "Show claimed"} hasArrow>
          <Box
            onClick={() => setShowClaimed((prevValue) => !prevValue)}
            cursor="pointer"
          >
            {showClaimed
              ? `${claimedCount} / ${capacity} claimed`
              : `${available} / ${capacity} available`}
          </Box>
        </Tooltip>

        <ClickableTagPopover
          options={
            <Stack gap={0}>
              <HStack
                onClick={fundOnOpen}
                px={3}
                py={1}
                _hover={{
                  cursor: "pointer",
                  background:
                    colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100",
                }}
              >
                <Icon as={Coin} weight="bold" />
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  Fund pool
                </Text>
              </HStack>
              <HStack
                px={3}
                py={1}
                _hover={{
                  cursor: isWithdrawDisabled ? "default" : "pointer",
                  background:
                    colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100",
                }}
                opacity={isWithdrawDisabled ? 0.5 : 1}
                onClick={!isWithdrawDisabled ? withdrawOnOpen : () => {}}
              >
                <Icon as={Wallet} weight="bold" />
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  Withdraw
                </Text>
              </HStack>
            </Stack>
          }
        >
          <TagRightIcon
            as={DotsThreeVertical}
            opacity={0.5}
            _hover={{ opacity: 1, cursor: "pointer" }}
          />
        </ClickableTagPopover>
      </Tag>

      <FundPoolModal
        poolId={poolId}
        balance={balance}
        owner={owner}
        onClose={fundOnClose}
        isOpen={fundIsOpen}
        onSuccess={() => {
          toast({
            status: "success",
            title: "Success",
            description: "Successfully funded the token pool!",
          })
          fundOnClose()
          refetch()
        }}
      />

      <ConfirmationAlert
        isLoading={withdrawIsLoading}
        isOpen={withdrawIsOpen}
        onClose={withdrawOnClose}
        onConfirm={onSubmitWithdraw}
        title="Withdraw all funds"
        description={
          <>
            Are you sure you want to withdraw all funds from the reward pool? No
            further rewards can be claimed until funded again.
          </>
        }
        confirmationText="Withdraw"
      />
    </>
  )
}

export default PoolTag
