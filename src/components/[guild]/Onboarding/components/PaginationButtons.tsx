import { Flex } from "@chakra-ui/react"
import Button from "components/common/Button"

const PaginationButtons = ({
  prevStep,
  nextStep,
  nextLabel = "Next",
  isPrevDisabled = false,
}) => (
  <Flex width="full" justify="flex-end" mt="5">
    <Button
      isDisabled={isPrevDisabled}
      mr={2}
      onClick={prevStep}
      size="sm"
      variant="ghost"
    >
      Prev
    </Button>
    <Button size="sm" onClick={nextStep}>
      {nextLabel}
    </Button>
  </Flex>
)

export default PaginationButtons
