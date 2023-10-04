import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import Pagination from "components/create-guild/Pagination"
import useUser from "components/[guild]/hooks/useUser"
import SecretTextDataForm, {
  SecretTextRewardForm,
} from "platforms/SecretText/SecretTextDataForm"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildSecretText = () => {
  const { id: userId } = useUser()

  const { nextStep } = useCreateGuildContext()

  const { setValue } = useFormContext<GuildFormType>()
  const methods = useForm<SecretTextRewardForm>({ mode: "all" })

  const name = useWatch({ control: methods.control, name: "name" })
  const text = useWatch({ control: methods.control, name: "text" })
  const imageUrl = useWatch({ control: methods.control, name: "imageUrl" })

  return (
    <>
      <FormProvider {...methods}>
        <SecretTextDataForm />
      </FormProvider>

      <Pagination
        nextButtonDisabled={!name?.length || !text?.length}
        nextStepHandler={() => {
          setValue("guildPlatforms.0", {
            platformName: "TEXT",
            platformGuildId: `text-${userId}-${Date.now()}`,
            platformGuildData: {
              text,
              name,
              imageUrl,
            },
          })
          nextStep()
        }}
      />
    </>
  )
}
export default CreateGuildSecretText
