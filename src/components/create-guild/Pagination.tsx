import { ButtonGroup, useBreakpointValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
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
  const { activeStep, prevStep, nextStep, platform, setPlatform } =
    useCreateGuildContext()

  const prevStepText = /* activeStep === 0 ? "Cancel" :  */ "Previous"
  const nextStepText = nextStepLabel ?? "Next"

  const isMobile = useBreakpointValue({ base: true, md: false }, "md")

  return (
    <Card
      alignSelf="flex-end"
      borderRadius={0}
      {...(isMobile
        ? {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            shadow: "dark-lg",
            zIndex: "9",
            alignItems: "flex-end",
          }
        : {
            shadow: "none",
            bg: "none",
          })}
    >
      <ButtonGroup>
        <Button
          isDisabled={activeStep === 1 && platform === "CONTRACT_CALL"}
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
            colorScheme="indigo"
            isDisabled={nextButtonDisabled}
            onClick={nextStepHandler ?? nextStep}
          >
            {nextStepText}
          </Button>
        )}
        {children}
      </ButtonGroup>
    </Card>
  )
}

export default Pagination
