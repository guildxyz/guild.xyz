import { Stack } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import CreateFormForm from "components/[guild]/CreateFormModal/components/CreateFormForm"
import useCreateForm from "components/[guild]/CreateFormModal/hooks/useCreateForm"
import { FormCreationSchema } from "components/[guild]/CreateFormModal/schemas"
import Button from "components/common/Button"
import { ArrowRight } from "phosphor-react"
import { AddPlatformPanelProps } from "platforms/platforms"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformGuildData, PlatformType } from "types"
import { uuidv7 } from "uuidv7"

type MapOptions<Variant> = Variant extends {
  options?: (
    | string
    | number
    | {
        value?: string | number
      }
  )[]
}
  ? Omit<Variant, "options"> & { options: { value: string | number }[] }
  : Variant

export type CreateForm = Omit<Schemas["FormCreationPayload"], "fields"> & {
  fields: MapOptions<Schemas["FormCreationPayload"]["fields"][number]>[]
}

const defaultValues: CreateForm = {
  name: "",
  description: "",
  fields: [],
}

const AddFormPanel = ({ onSuccess }: AddPlatformPanelProps) => {
  const methods = useForm<CreateForm>({
    mode: "all",
    resolver: zodResolver(FormCreationSchema),
    defaultValues,
  })

  const fields = useWatch({ control: methods.control, name: "fields" })

  const { onSubmit: onCreateFormSubmit, isLoading } = useCreateForm(
    (createdForm) => {
      methods.reset(defaultValues)
      onSuccess({
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
          isDisabled={!fields?.length}
        >
          Create form & continue
        </Button>
      </Stack>
    </FormProvider>
  )
}

export default AddFormPanel
