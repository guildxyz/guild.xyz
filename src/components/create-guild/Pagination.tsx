import { Flex, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"
import { useCreateGuildContext } from "./CreateGuildContext"

const Pagination = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const buttonSize = useBreakpointValue({ base: "sm", md: "lg" })
  const { activeStep, steps, prevStep, nextStep } = useCreateGuildContext()

  return (
    <Flex justifyContent="right" w="full">
      <Button flexShrink={0} size={buttonSize} mr={2} onClick={prevStep}>
        Previous
      </Button>
      {activeStep === steps.length - 1 ? (
        children
      ) : (
        <Button
          flexShrink={0}
          size={buttonSize}
          colorScheme="green"
          onClick={nextStep}
        >
          Next
        </Button>
      )}
    </Flex>
  )
}

export default Pagination
