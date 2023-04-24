import { Flex, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"
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
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const buttonSize = useBreakpointValue({ base: "sm", md: "lg" })
  const { activeStep, prevStep, nextStep, platform, setPlatform } =
    useCreateGuildContext()

  const prevStepText = activeStep === 0 ? "Cancel" : "Previous"
  const nextStepText = nextStepLabel ?? "Next"

  return (
    <Flex justifyContent="right" w="full">
      <Button
        flexShrink={0}
        size={buttonSize}
        mr={2}
        onClick={
          (platform && activeStep === 0) ||
          (platform === "DEFAULT" && activeStep === 1)
            ? () => {
                setPlatform(null)
                if (activeStep > 0) prevStep()
              }
            : prevStep
        }
      >
        {prevStepText}
      </Button>

      {!nextButtonHidden && (
        <Button
          flexShrink={0}
          size={buttonSize}
          colorScheme="indigo"
          isDisabled={nextButtonDisabled}
          onClick={nextStepHandler ?? nextStep}
        >
          {nextStepText}
        </Button>
      )}

      {children}
    </Flex>
  )
}

export default Pagination
