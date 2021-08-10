import { Center, Text, useColorMode } from "@chakra-ui/react"
import { TransactionResponse } from "@ethersproject/providers"
import useEstimateTransactionTime from "hooks/useEstimateTransactionTime"
import { ArrowCircleUp } from "phosphor-react"
import msToReadableFormat from "utils/msToReadableFormat"

type Props = {
  transaction: TransactionResponse
}

const TransactionSubmitted = ({ transaction }: Props) => {
  const estimatedTransactionTime = useEstimateTransactionTime(transaction)
  const { colorMode } = useColorMode()

  return (
    <>
      <Center>
        <ArrowCircleUp
          size="50%"
          color={
            colorMode === "light" ? "var(--chakra-colors-primary-500)" : "white"
          }
          weight="thin"
        />
      </Center>
      <Text fontWeight="medium" mt="8">
        Estimated transaction time is{" "}
        {estimatedTransactionTime
          ? msToReadableFormat(estimatedTransactionTime)
          : "[loading...]"}
        . You’ll be notified when it succeeds.
      </Text>
    </>
  )
}

export default TransactionSubmitted
