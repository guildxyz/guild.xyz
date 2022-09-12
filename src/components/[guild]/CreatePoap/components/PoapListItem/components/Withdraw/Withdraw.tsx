import {
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains, RPC } from "connectors"
import { CaretDown, Wallet } from "phosphor-react"
import { useState } from "react"
import WithdrawButton from "./components/WithdrawButton"
import useWithdrawableAmounts from "./hooks/useWithdrawableAmounts"

type Props = {
  poapId: number
}

const Withdraw = ({ poapId }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  const { id: guildId } = useGuild()
  const { withdrawableAmounts, mutateWithdrawableAmounts } = useWithdrawableAmounts(
    guildId,
    poapId
  )

  const withdrawableAmountsSum = withdrawableAmounts
    ?.map((data) => data.collected)
    ?.reduce((amount1, amount2) => amount1 + amount2, 0)

  const [isLoading, setIsLoading] = useState(false)

  if (!withdrawableAmounts?.length) return null

  if (withdrawableAmountsSum === 0)
    return (
      <Tooltip label="No withdrawable amount" shouldWrapChildren>
        <WithdrawButton isDisabled label="Withdraw" />
      </Tooltip>
    )

  if (
    withdrawableAmounts?.filter((withdrawable) => withdrawable.collected > 0)
      ?.length === 1
  ) {
    const withdrawable = withdrawableAmounts.find((w) => w.collected > 0)
    return (
      <WithdrawButton
        label={`Withdraw ${withdrawable.collected.toFixed(2)} ${
          withdrawable.tokenSymbol
        }`}
        chainId={withdrawable.chainId}
        vaultId={withdrawable.vaultId}
        onComplete={mutateWithdrawableAmounts}
      />
    )
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<Icon as={Wallet} />}
        rightIcon={<Icon as={CaretDown} />}
        isLoading={isLoading}
        loadingText="Withdrawing funds"
        size="xs"
        rounded="lg"
        borderWidth={colorMode === "light" ? 2 : 0}
        borderColor="gray.200"
      >
        Withdraw
      </MenuButton>
      <MenuList>
        {withdrawableAmounts
          .filter((withdrawable) => withdrawable.collected > 0)
          ?.map((withdrawable) => (
            <WithdrawButton
              key={withdrawable.id}
              asMenuItem
              label={`Withdraw ${withdrawable.collected.toFixed(2)} ${
                withdrawable.tokenSymbol
              } (on ${RPC[Chains[withdrawable.chainId]].chainName})`}
              chainId={withdrawable.chainId}
              vaultId={withdrawable.vaultId}
              onComplete={mutateWithdrawableAmounts}
              setIsLoading={setIsLoading}
            />
          ))}
      </MenuList>
    </Menu>
  )
}

export default Withdraw
