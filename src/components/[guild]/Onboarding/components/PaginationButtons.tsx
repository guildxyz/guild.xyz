import { Flex } from "@chakra-ui/react"
import Button from "components/common/Button"

const PaginationButtons = ({
  prevStep,
  nextStep,
  nextLabel = "Next",
  isPrevDisabled = false,
}) => (
  <Flex width="full" justify={{ md: "flex-end" }} mt="5" mb={{ base: 5, md: 0 }}>
    <Button size="sm" onClick={nextStep} colorScheme="onboarding">
      {nextLabel}
    </Button>
    <Button
      isDisabled={isPrevDisabled}
      mr={2}
      onClick={prevStep}
      size="sm"
      variant="ghost"
      order={{ md: -1 }}
    >
      Prev
    </Button>
  </Flex>
)

export default PaginationButtons
