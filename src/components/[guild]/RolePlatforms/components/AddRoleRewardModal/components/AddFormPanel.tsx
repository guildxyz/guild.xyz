import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Collapse,
  Stack,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { zodResolver } from "@hookform/resolvers/zod"
import CreateFormForm from "components/[guild]/CreateFormModal/components/CreateFormForm"
import useCreateForm from "components/[guild]/CreateFormModal/hooks/useCreateForm"
import { FormCreationSchema } from "components/[guild]/CreateFormModal/schemas"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import StyledSelect from "components/common/StyledSelect"
import { ArrowRight } from "phosphor-react"
import { AddRewardPanelProps } from "platforms/rewards"
import { useMemo } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
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

const AddFormPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<CreateForm>({
    mode: "all",
    resolver: zodResolver(FormCreationSchema),
    defaultValues,
  })

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
    </FormProvider>
  )
}

const useGetNotConnectedForms = () => {
  const { id: guildId, guildPlatforms } = useGuild()

  const { data, isLoading } = useSWRImmutable<Schemas["Form"][]>(
    `/v2/guilds/${guildId}/forms/`
  )

  const notConnectedForms = useMemo(() => {
    if (isLoading) return
    return data.filter(
      (form) =>
        !guildPlatforms.filter((fgp) => fgp.platformGuildData?.formId === form.id)
          .length
    )
  }, [guildPlatforms, data, isLoading])
  return { notConnectedForms, isLoading }
}

const ContinueWithExistingFormAlert = ({ onAdd }) => {
  const { notConnectedForms, isLoading: isRawFormsLoading } =
    useGetNotConnectedForms()

  return (
    <Collapse in={!!notConnectedForms?.length}>
      <Alert status="info">
        <AlertIcon />
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent={"space-between"}
          gap={{ base: 3, md: 4 }}
          w="full"
        >
          <Box>
            <AlertTitle>Continue with existing form?</AlertTitle>
            <AlertDescription>
              There're forms that you've created but haven't added as a reward yet
            </AlertDescription>
          </Box>
          <Center flexShrink={0} w="full" maxW={48}>
            <StyledSelect
              isLoading={isRawFormsLoading}
              onChange={({ value }) =>
                onAdd({
                  guildPlatform: {
                    platformName: "FORM",
                    platformId: value.FORM,
                    platformGuildId: `form-${value.id}`,
                    platformGuildData: {
                      formId: value.id,
                    } satisfies PlatformGuildData["FORM"],
                  },
                  isNew: true,
                })
              }
              options={notConnectedForms?.map((form) => ({
                label: form.name,
                value: form,
              }))}
            />
          </Center>
        </Stack>
      </Alert>
    </Collapse>
  )
}

export default AddFormPanel
