import { Stack, Text } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import useUsersTokenBalance from "components/[guild]/claim-poap/hooks/useUsersTokenBalance"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import useCoinBalance from "hooks/useCoinBalance"
import { Wallet } from "phosphor-react"
import { useContext } from "react"
import { Token } from "types"
import shortenHex from "utils/shortenHex"
import JoinStep from "./JoinStep"

type Props = {
  token: Token
}

const WalletAuthButtonWithBalance = ({ token }: Props): JSX.Element => {
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const { account } = useWeb3React()

  const coinBalance = useCoinBalance()
  const { balance, isBalanceLoading } = useUsersTokenBalance(token.address)

  return (
    <JoinStep
      title={account ? "Wallet connected" : "Connect wallet"}
      buttonLabel={
        !account ? (
          "Connect"
        ) : (
          <Stack spacing={0} alignItems="flex-start">
            <Text as="span" fontSize={"sm"} fontWeight="bold">
              {shortenHex(account, 3)}
            </Text>
            <Text as="span" fontSize="xs" fontWeight="medium" color="whiteAlpha.700">
              {isBalanceLoading
                ? "..."
                : `${parseFloat(
                    formatUnits(
                      (token.address === "0x0000000000000000000000000000000000000000"
                        ? coinBalance
                        : balance) ?? "0",
                      token.decimals ?? 18
                    )
                  )?.toFixed(2)} ${token.symbol}`}
            </Text>
          </Stack>
        )
      }
      isRequired
      icon={<Wallet />}
      isDone={!!account}
      colorScheme="gray"
      onClick={openWalletSelectorModal}
      iconSpacing={account && 3}
    />
  )
}

export default WalletAuthButtonWithBalance
