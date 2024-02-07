import { Stack } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import CreateFormForm from "components/[guild]/CreateFormModal/components/CreateFormForm"
import useCreateForm from "components/[guild]/CreateFormModal/hooks/useCreateForm"
import {
  CreateFormParams,
  FormSchema,
} from "components/[guild]/CreateFormModal/schemas"
import Button from "components/common/Button"
import { ArrowRight } from "phosphor-react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"
import { uuidv7 } from "uuidv7"

type Props = {
  onSuccess: () => void
}

const defaultValues = {
  name: "",
  description: "",
  active: false,
  fields: [],
}

const AddFormPanel = ({ onSuccess }: Props) => {
  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const methods = useForm<CreateFormParams>({
    mode: "all",
    resolver: zodResolver(FormSchema),
    defaultValues,
  })

  const { onSubmit: onCreateFormSubmit, isLoading } = useCreateForm(
    (createdForm) => {
      methods.reset(defaultValues)
      append({
        guildPlatform: {
          platformName: "FORM",
          platformGuildId: `form-${createdForm.id}`,
          platformGuildData: {
            formId: createdForm.id,
          },
        },
        visibility: roleVisibility,
      })
      onSuccess()
    }
  )

  const onSubmit = (data: CreateFormParams) =>
    onCreateFormSubmit({
      ...data,
      fields: data.fields.map((field) => ({
        ...field,
        id: uuidv7(),
      })),
    })

  return (
    <FormProvider {...methods}>
      <Stack spacing={6}>
        <CreateFormForm />
        <Button
          colorScheme="green"
          rightIcon={<ArrowRight />}
          w="max-content"
          ml="auto"
          onClick={methods.handleSubmit(onSubmit, console.error)}
          loadingText="Creating form"
          isLoading={isLoading}
        >
          Create form & continue
        </Button>
      </Stack>
    </FormProvider>
  )
}

export default AddFormPanel
