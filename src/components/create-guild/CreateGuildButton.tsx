import Button from "components/common/Button"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"
import useCreateGuild from "./hooks/useCreateGuild"

type Props = {
  isDisabled?: boolean
}

const CreateGuildButton = ({ isDisabled }: Props): JSX.Element => {
  const { handleSubmit } = useFormContext<GuildFormType>()

  const { onSubmit, isLoading, response, isSigning, signLoadingText } =
    useCreateGuild()

  return (
    <Button
      flexShrink={0}
      size={{ base: "sm", md: "lg" }}
      colorScheme="indigo"
      isDisabled={response || isLoading || isSigning || isDisabled}
      isLoading={isLoading || isSigning}
      loadingText={signLoadingText || "Saving data"}
      onClick={handleSubmit(onSubmit)}
    >
      Create Guild
    </Button>
  )
}

export default CreateGuildButton
