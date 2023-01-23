import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"

const PurchaseButton = (): JSX.Element => (
  <CardMotionWrapper>
    {/* <Button size="xl" colorScheme="blue" loadingText="Check your wallet"> */}
    <Button size="xl" isDisabled w="full">
      Purchase
    </Button>
  </CardMotionWrapper>
)

export default PurchaseButton
