import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import Pagination from "components/create-guild/Pagination"
import useUser from "components/[guild]/hooks/useUser"
import TextDataForm, { TextRewardForm } from "platforms/Text/TextDataForm"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildText = () => {
  const { id: userId } = useUser()

  const { nextStep } = useCreateGuildContext()

  const { setValue } = useFormContext<GuildFormType>()
  const methods = useForm<TextRewardForm>({ mode: "all" })

  const name = useWatch({ control: methods.control, name: "name" })
  const text = useWatch({ control: methods.control, name: "text" })
  const imageUrl = useWatch({ control: methods.control, name: "imageUrl" })

  return (
    <>
      <FormProvider {...methods}>
        <TextDataForm />
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
export default CreateGuildText
