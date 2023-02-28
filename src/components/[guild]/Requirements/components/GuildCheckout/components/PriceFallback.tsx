import { Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  error: any
  pickedCurrency: string
}

const PriceFallback = ({
  error,
  pickedCurrency,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  if (error)
    return (
      <Text as="span" colorScheme={"gray"}>
        Couldn't calculate
      </Text>
    )

  if (!pickedCurrency)
    return (
      <Text as="span" colorScheme={"gray"}>
        Choose currency
      </Text>
    )

  return <>{children}</>
}

export default PriceFallback
