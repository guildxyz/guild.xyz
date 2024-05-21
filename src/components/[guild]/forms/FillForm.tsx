import { FormControl, Skeleton, Stack } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import FormFieldTitle from "components/[guild]/CreateFormModal/components/FormCardEditable/components/FormFieldTitle"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import Button from "components/common/Button"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useUserFormSubmission } from "platforms/Forms/hooks/useFormSubmissions"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"
import useGuild from "../hooks/useGuild"
import FillFormProgress from "./FillFormProgress"
import SuccessfullySubmittedForm from "./SuccessfullySubmittedForm"

type Props = {
  form: Schemas["Form"]
}

const FillForm = ({ form }: Props) => {
  const { id: guildId } = useGuild()
  const methods = useForm()
  const {
    control,
    formState: { errors },
    watch,
  } = methods
  const formValues = watch()
  const requiredFieldIds = form?.fields
    .filter((field) => field.isRequired)
    .map((field) => field.id)
  const isSubmitDisabled = Object.keys(formValues).some(
    (fieldId) => requiredFieldIds.includes(fieldId) && !formValues[fieldId]
  )

  const { userSubmission, mutate: mutateSubmission } = useUserFormSubmission(form)

  const { rewardClaimed } = useCustomPosthogEvents()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { onSubmit, isLoading } = useSubmitWithSign(
    (signedValidation) =>
      fetcher(`/v2/guilds/${guildId}/forms/${form.id}/user-submissions`, {
        ...signedValidation,
        method: "POST",
      }),
    {
      onSuccess: (res) => {
        rewardClaimed(PlatformType.FORM)
        toast({
          status: "success",
          title: "Successfully submitted form",
        })
        mutateSubmission(res, {
          revalidate: false,
        })
      },
      onError: (error) => showErrorToast(error),
    }
  )

  if (!form) return <FillFormSkeleton />

  if (!!userSubmission) return <SuccessfullySubmittedForm />

  return (
    <FormProvider {...methods}>
      <Stack>
        {form.fields.map((field) => {
          const { DisplayComponent } = fieldTypes.find(
            (ft) => ft.value === field.type
          )

          return (
            <Card p={5} key={field.id}>
              <FormControl isInvalid={!!errors[field.id]}>
                <FormFieldTitle field={field} mb={2} />
                <Controller
                  control={control}
                  name={field.id}
                  rules={{
                    required: field.isRequired && "This field is required",
                  }}
                  render={({ field: controlledField }) => (
                    <DisplayComponent field={field} {...controlledField} />
                  )}
                />

                <FormErrorMessage>
                  {errors[field.id]?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            </Card>
          )
        })}
      </Stack>

      <FillFormProgress>
        <Button
          colorScheme="green"
          isDisabled={isSubmitDisabled}
          isLoading={isLoading}
          onClick={methods.handleSubmit(
            (data: Record<string, string>) =>
              onSubmit({
                submissionAnswers: Object.entries(data).map(([fieldId, value]) => ({
                  fieldId,
                  value,
                })),
              }),
            console.error
          )}
        >
          Submit
        </Button>
      </FillFormProgress>

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

const FillFormSkeleton = () => (
  <Stack spacing={2}>
    {[...Array(3)].map((_, i) => (
      <Card p={5} key={i}>
        <Stack>
          <Skeleton w="60%" h={5} />
          <Skeleton w="full" h={24} />
        </Stack>
      </Card>
    ))}
  </Stack>
)

export default FillForm
