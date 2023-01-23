import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"

const ChooseCurrencyButton = (): JSX.Element => (
  <CardMotionWrapper>
    <Button size="xl" isDisabled w="full">
      Choose currency
    </Button>
  </CardMotionWrapper>
)

export default ChooseCurrencyButton
