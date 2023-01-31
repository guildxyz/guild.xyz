import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"

const PurchaseButton = (): JSX.Element => {
  const { setProcessing } = useGuildCheckoutContext()

  return (
    <CardMotionWrapper>
      {/* <Button size="xl" colorScheme="blue" loadingText="Check your wallet"> */}
      <Button
        size="xl"
        /*isDisabled*/ colorScheme="blue"
        w="full"
        onClick={() => setProcessing(true)}
      >
        Purchase
      </Button>
    </CardMotionWrapper>
  )
}

export default PurchaseButton
