import { Text } from "@chakra-ui/react"
import useBalance from "hooks/useBalance"
import type { Token } from "types"

type Props = {
  token: Token
}

const Balance = ({ token }: Props): JSX.Element => {
  const balance = useBalance(token)

  const convertBalance = (): string => {
    let decimals = 0

    if (balance < 10) {
      decimals = 3
    } else if (balance < 100) {
      decimals = 2
    } else if (balance < 1000) {
      decimals = 1
    }

    if (token.decimals === 0) decimals = 0

    return Number(balance).toFixed(decimals)
  }

  return (
    <Text as="span" fontWeight="bold" fontSize="sm">
      {typeof balance === "undefined"
        ? "Loading..."
        : `${convertBalance()} ${token.symbol}`}
    </Text>
  )
}

export default Balance
