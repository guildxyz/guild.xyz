import Button from "components/common/Button"
import useDatadog from "components/_app/Datadog/useDatadog"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"
import useCreateGuild from "./hooks/useCreateGuild"

type Props = {
  isDisabled?: boolean
}

const CreateGuildButton = ({ isDisabled }: Props): JSX.Element => {
  const { addDatadogAction, addDatadogError } = useDatadog()

  const { handleSubmit } = useFormContext<GuildFormType>()

  const { onSubmit, isLoading, response, isSigning, error, signLoadingText } =
    useCreateGuild()

  useEffect(() => {
    if (error) {
      addDatadogError("Guild creation error", { error })
    }
    if (response) {
      addDatadogAction("Successful guild creation")
    }
  }, [response, error])

  return (
    <Button
      flexShrink={0}
      size={{ base: "sm", md: "lg" }}
      colorScheme="indigo"
      isDisabled={response || isLoading || isSigning || isDisabled}
      isLoading={isLoading || isSigning}
      loadingText={signLoadingText || "Saving data"}
      onClick={handleSubmit(onSubmit)}
      data-test="create-guild-button"
    >
      Create Guild
    </Button>
  )
}

export default CreateGuildButton
