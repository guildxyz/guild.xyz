import Button from "components/common/Button"
import { useFormContext } from "react-hook-form"
import { CreateGuildFormType } from "./CreateGuildForm"
import useCreateGuild from "./hooks/useCreateGuild"

const CreateGuildButton = () => {
  const { handleSubmit } = useFormContext<CreateGuildFormType>()
  const { onSubmit, isLoading } = useCreateGuild()

  return (
    <Button
      colorScheme="green"
      ml="auto"
      size="lg"
      w="full"
      isLoading={isLoading}
      loadingText="Creating guild"
      onClick={handleSubmit(onSubmit)}
    >
      Create guild
    </Button>
  )
}

export default CreateGuildButton
