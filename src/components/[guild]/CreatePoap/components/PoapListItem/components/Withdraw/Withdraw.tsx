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

  if (!withdrawableAmounts?.length) return null

  if (withdrawableAmountsSum === 0)
    return (
      <Tooltip label="No withdrawable amount" shouldWrapChildren>
        <WithdrawButton isDisabled label="Withdraw" />
      </Tooltip>
    )

  if (withdrawableAmounts?.length === 1)
    return (
      <WithdrawButton
        label={`Withdraw ${withdrawableAmounts[0].collected.toFixed(2)} ${
          withdrawableAmounts[0].tokenSymbol
        }`}
        chainId={withdrawableAmounts[0].chainId}
        vaultId={withdrawableAmounts[0].vaultId}
        onComplete={mutateWithdrawableAmounts}
      />
    )

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<Icon as={Wallet} />}
        rightIcon={<Icon as={CaretDown} />}
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
            />
          ))}
      </MenuList>
    </Menu>
  )
}

export default Withdraw
