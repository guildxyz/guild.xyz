import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useFormContext, useWatch } from "react-hook-form"
import useSubmitMachine from "./hooks/useSubmitMachine"

const SubmitButton = ({ onErrorHandler }) => {
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess, state } = useSubmitMachine()

  const { control, handleSubmit } = useFormContext()

  const requirementsLength = useWatch({
    control: control,
    name: "requirements",
  })?.length

  return (
    <CtaButton
      disabled={!requirementsLength || isLoading || isSigning || isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={(() => {
        if (isSigning) return "Signing"
        switch (state.value) {
          case "fetchCommunity":
            return "Saving data"
          case "fetchLevels":
            return "Saving requirements"
          default:
            return undefined
        }
      })()}
      onClick={callbackWithSign(handleSubmit(onSubmit, onErrorHandler))}
    >
      {isSuccess ? "Success" : "Summon"}
    </CtaButton>
  )
}

export default SubmitButton
