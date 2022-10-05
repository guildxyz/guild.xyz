import { SystemStyleObject } from "@chakra-ui/theme-tools"
import { StepsStyleConfig } from "chakra-ui-steps"

type StepIconContainer = SystemStyleObject & {
  _activeStep: SystemStyleObject & { _invalid }
}

const Steps = {
  ...StepsStyleConfig,
  baseStyle: (props) => ({
    ...StepsStyleConfig.baseStyle(props),
    stepIconContainer: {
      ...StepsStyleConfig.baseStyle(props).stepIconContainer,
      _activeStep: {
        ...(StepsStyleConfig.baseStyle(props).stepIconContainer as StepIconContainer)
          ._activeStep,
        // The stepper doesn't have a "warning" state, so for now we've modified the error/invalid state
        _invalid: {
          ...(
            StepsStyleConfig.baseStyle(props).stepIconContainer as StepIconContainer
          )._activeStep._invalid,
          bg: "gray.400",
          borderColor: "gray.400",
        },
      },
    },
  }),
}

export default Steps
