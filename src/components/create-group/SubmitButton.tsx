import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useFormContext, useWatch } from "react-hook-form"
import useSubmitMachine from "./hooks/useSubmitMachine"

// CODE DUPLICATION! - TODO...
const SubmitButton = ({ onErrorHandler }) => {
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess, state } = useSubmitMachine()

  const { control, handleSubmit } = useFormContext()

  const guildsLength = useWatch({
    control: control,
    name: "guilds",
  })?.length

  return (
    <CtaButton
      disabled={!guildsLength || isLoading || isSigning || isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={(() => {
        if (isSigning) return "Signing"
        switch (state.value) {
          case "fetchGroup":
            return "Saving data"
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
