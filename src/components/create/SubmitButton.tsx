import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useFormContext } from "react-hook-form"
import useSubmitMachine from "./hooks/useSubmitMachine"

type Props = {
  type: "group" | "guild"
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({ type, onErrorHandler }: Props): JSX.Element => {
  const { isSigning, callbackWithSign } = usePersonalSign(true)
  const { onSubmit, isLoading, isSuccess, state } = useSubmitMachine(type)

  const { handleSubmit } = useFormContext()

  return (
    <CtaButton
      disabled={isLoading || isSigning || isSuccess}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={(() => {
        if (isSigning) return "Signing"
        switch (state.value) {
          case "fetchData":
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
