import { Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import WithdrawButton from "./components/WithdrawButton"
import useWithdrawableAmounts from "./hooks/useWithdrawableAmounts"

type Props = {
  poapId: number
  vaultId: number
}

const Withdraw = ({ poapId, vaultId }: Props): JSX.Element => {
  const { id: guildId } = useGuild()
  const { withdrawableAmounts, mutateWithdrawableAmounts } = useWithdrawableAmounts(
    guildId,
    poapId
  )

  if (!withdrawableAmounts?.length) return null
  const withdrawable = withdrawableAmounts.find(
    (w) => w.vaultId === vaultId && w.collected > 0
  )

  if (!withdrawable)
    return (
      <Tooltip label="No withdrawable amount" shouldWrapChildren>
        <WithdrawButton isDisabled label="Withdraw" />
      </Tooltip>
    )

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

export default Withdraw
