import CtaButton from "components/common/CtaButton"
import usePersonalSign from "hooks/usePersonalSign"
import { useFormContext } from "react-hook-form"
import useCreate from "./hooks/useCreate"

type Props = {
  type: "group" | "guild"
  onErrorHandler: (errors: any) => void
}

const SubmitButton = ({ type, onErrorHandler }: Props): JSX.Element => {
  const { isSigning } = usePersonalSign(true)
  const { onSubmit, isLoading, response } = useCreate(type)

  const { handleSubmit } = useFormContext()

  return (
    <CtaButton
      disabled={isLoading || isSigning || response}
      flexShrink={0}
      size="lg"
      isLoading={isLoading || isSigning}
      loadingText={isSigning ? "Signing" : "Saving data"}
      onClick={handleSubmit(onSubmit, onErrorHandler)}
    >
      {response ? "Success" : "Summon"}
    </CtaButton>
  )
}

export default SubmitButton
