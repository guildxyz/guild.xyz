import { Stack } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import CreateFormForm from "components/[guild]/CreateFormModal/components/CreateFormForm"
import useCreateForm from "components/[guild]/CreateFormModal/hooks/useCreateForm"
import { FormCreationSchema } from "components/[guild]/CreateFormModal/schemas"
import Button from "components/common/Button"
import { ArrowRight } from "phosphor-react"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformGuildData, PlatformType } from "types"
import { uuidv7 } from "uuidv7"
import { CreateForm } from "."
import DefaultAddRewardPanelWrapper from "../../DefaultAddRewardPanelWrapper"
import ContinueWithExistingFormAlert from "./components/ContinueWithExistingFormAlert"

const defaultValues: CreateForm = {
  name: "",
  description: "",
  fields: [],
}

const AddFormPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<CreateForm>({
    mode: "all",
    resolver: zodResolver(FormCreationSchema),
    defaultValues,
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  const fields = useWatch({ control: methods.control, name: "fields" })

  const { onSubmit: onCreateFormSubmit, isLoading } = useCreateForm(
    (createdForm) => {
      methods.reset(defaultValues)
      onAdd({
        guildPlatform: {
          platformName: "FORM",
          platformId: PlatformType.FORM,
          platformGuildId: `form-${createdForm.id}`,
          platformGuildData: {
            formId: createdForm.id,
          } satisfies PlatformGuildData["FORM"],
        },
        isNew: true,
      })
    }
  )

  const onSubmit = (data: CreateForm) =>
    onCreateFormSubmit({
      ...data,
      fields: data.fields.map((field) => ({
        ...field,
        id: uuidv7(),
      })),
    })

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
        <Stack spacing={6}>
          <ContinueWithExistingFormAlert {...{ onAdd }} />
          <CreateFormForm />
          <Button
            colorScheme="green"
            rightIcon={<ArrowRight />}
            w="max-content"
            ml="auto"
            onClick={methods.handleSubmit(onSubmit, console.error)}
            loadingText="Creating form"
            isLoading={isLoading}
            isDisabled={!fields?.length}
          >
            Create form & continue
          </Button>
        </Stack>
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddFormPanel
