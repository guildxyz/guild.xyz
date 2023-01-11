import { Flex, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRouter } from "next/router"
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
  const { activeStep, prevStep, nextStep, platform } = useCreateGuildContext()
  const router = useRouter()

  return (
    <Flex justifyContent="right" w="full">
      <Button
        flexShrink={0}
        size={buttonSize}
        mr={2}
        onClick={
          platform && activeStep === 0
            ? () => router.replace("/create-guild")
            : prevStep
        }
      >
        {activeStep === 0 ? "Cancel" : "Previous"}
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

      {children}
    </Flex>
  )
}

export default Pagination
