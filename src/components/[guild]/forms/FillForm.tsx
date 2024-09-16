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
import { useState } from "react"
import { Controller, FormProvider, UseFormProps, useForm } from "react-hook-form"
import { useUserFormSubmission } from "rewards/Forms/hooks/useFormSubmissions"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"
import useMembershipUpdate from "../JoinModal/hooks/useMembershipUpdate"
import useGuild from "../hooks/useGuild"
import useUser from "../hooks/useUser"
import FillFormProgress from "./FillFormProgress"
import SuccessfullySubmittedForm from "./SuccessfullySubmittedForm"

type FormProp = { form: Schemas["Form"] }

type Props = FormProp & {
  method?: "POST" | "PUT"
} & UseFormProps

const FillForm = ({ form, method = "POST", ...config }: Props) => {
  const { id: guildId } = useGuild()
  const { id: userId } = useUser()
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const methods = useForm(config)
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

  const { mutate: mutateSubmission } = useUserFormSubmission(form)
  const { triggerMembershipUpdate } = useMembershipUpdate()

  const { rewardClaimed } = useCustomPosthogEvents()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { onSubmit, isLoading } = useSubmitWithSign(
    (signedValidation) =>
      fetcher(
        `/v2/guilds/${guildId}/forms/${form.id}/user-submissions${method === "PUT" ? `/${userId}` : ""}`,
        {
          ...signedValidation,
          method,
        }
      ),
    {
      onSuccess: (res) => {
        rewardClaimed(PlatformType.FORM)
        toast({
          status: "success",
          title: "Successfully submitted form",
        })
        setHasSubmitted(true)
        mutateSubmission(res, {
          revalidate: false,
        })
        triggerMembershipUpdate()
      },
      onError: (error) => showErrorToast(error),
    }
  )

  if (hasSubmitted) return <SuccessfullySubmittedForm />

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

const FillFormWrapper = ({ form }: FormProp) => {
  const { userSubmission, isLoading } = useUserFormSubmission(form)

  if (!form || isLoading) return <FillFormSkeleton />

  if (!userSubmission) return <FillForm form={form} />

  if (form.isEditable)
    return (
      <FillForm
        form={form}
        method="PUT"
        defaultValues={mapAnswersToObject(userSubmission.submissionAnswers)}
      />
    )

  return <SuccessfullySubmittedForm />
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

const stringifyDbValue = (dbValue: any) => {
  if (!dbValue) return ""
  if (Array.isArray(dbValue)) return dbValue.map((option: any) => `${option}`)
  return `${dbValue}`
}

const mapAnswersToObject = (answers: any) =>
  answers.reduce((acc: any, curr: any) => {
    acc[curr.fieldId] = stringifyDbValue(curr.value)
    return acc
  }, {})

export default FillFormWrapper
