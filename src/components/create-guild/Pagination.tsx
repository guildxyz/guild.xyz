import { Flex, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRouter } from "next/router"
import { useCreateGuildContext } from "./CreateGuildContext"

type Props = {
  nextButtonDisabled?: boolean
  nextButtonHidden?: boolean
  nextStepHandler?: () => void
  nextStepLabel?: string
}

const Pagination = ({
  nextButtonDisabled,
  nextButtonHidden,
  nextStepHandler,
  nextStepLabel,
}: Props): JSX.Element => {
  const buttonSize = useBreakpointValue({ base: "sm", md: "lg" })
  const { activeStep, prevStep, nextStep, platform } = useCreateGuildContext()
  const router = useRouter()

  return (
    <Flex justifyContent="right" w="full">
      <Button
        flexShrink={0}
        size={buttonSize}
        mr={2}
        onClick={
          platform && activeStep === 1
            ? () => router.push("/create-guild")
            : prevStep
        }
      >
        Previous
      </Button>

      {!nextButtonHidden && (
        <Button
          flexShrink={0}
          size={buttonSize}
          colorScheme="indigo"
          isDisabled={nextButtonDisabled}
          onClick={nextStepHandler ?? nextStep}
        >
          {nextStepLabel ?? "Next"}
        </Button>
      )}
    </Flex>
  )
}

export default Pagination
