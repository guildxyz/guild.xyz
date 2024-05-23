import {
  HStack,
  Icon,
  Skeleton,
  Stack,
  Tag,
  TagProps,
  TagRightIcon,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import ClickableTagPopover from "components/[guild]/activity/ActivityLogAction/components/ClickableTagPopover"
import useToast from "hooks/useToast"
import { Coin, DotsThreeVertical, Wallet } from "phosphor-react"
import FundPoolModal from "platforms/Token/FundPoolModal"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import usePool from "platforms/Token/hooks/usePool"
import { useRef } from "react"
import { formatUnits } from "viem"
import WithdrawPoolModal from "./WithdrawPoolModal"

const PoolTag = ({ poolId, ...rest }: { poolId: bigint } & TagProps) => {
  const {
    token: {
      data: { decimals, symbol },
      isLoading: isTokenLoading,
    },
    guildPlatform,
  } = useTokenRewardContext()

  const chain = guildPlatform.platformGuildData.chain
  const { data, isLoading, error } = usePool(chain, poolId)
  const toast = useToast()
  const { colorMode } = useColorMode()
  const finalFocusRef = useRef()

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
      <Skeleton isLoaded={!isLoading && !isTokenLoading} rounded={"md"}>
        Pool balance
      </Skeleton>
    )
  if (error) return <Tag>Failed to load balance</Tag>

  const poolBalance = data ? data.balance : undefined
  const balance = poolBalance ? Number(formatUnits(poolBalance, decimals)) : 0
  const isWithdrawDisabled = balance === 0

  return (
    <>
      <Tag
        {...rest}
        bg={"none"}
        borderStyle={"dashed"}
        borderWidth={"1px"}
        borderColor={colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300"}
      >
        <Text opacity={0.5} mr={1}>
          Balance:
        </Text>
        <Text>
          {balance} {symbol}
        </Text>

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
            ref={finalFocusRef}
            as={DotsThreeVertical}
            opacity={0.5}
            _hover={{ opacity: 1, cursor: "pointer" }}
          />
        </ClickableTagPopover>
      </Tag>

      <FundPoolModal
        isOpen={fundIsOpen}
        onClose={fundOnClose}
        onSuccess={() => {
          toast({
            status: "success",
            title: "Success",
            description: "Successfully funded the token pool!",
          })
          fundOnClose()
        }}
        finalFocusRef={finalFocusRef}
      />

      <WithdrawPoolModal
        isOpen={withdrawIsOpen}
        onClose={withdrawOnClose}
        onSuccess={() => {}}
        finalFocusRef={finalFocusRef}
      />
    </>
  )
}

export default PoolTag
