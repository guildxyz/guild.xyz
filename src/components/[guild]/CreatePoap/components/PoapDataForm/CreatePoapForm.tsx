import { Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGuild from "components/[guild]/hooks/useGuild"
import useToast from "hooks/useToast"
import { FormProvider, useForm } from "react-hook-form"
import { CreatePoapForm as CreatePoapFormType } from "types"
import convertPoapExpiryDate from "utils/convertPoapExpiryDate"
import { AddPoapStep } from "../../AddPoapModalContent"
import useCreatePoap from "../../hooks/useCreatePoap"
import useSavePoap from "../../hooks/useSavePoap"
import { useCreatePoapContext } from "../CreatePoapContext"
import PoapDataForm from "./PoapDataForm"

type Props = {
  setStep: (step: AddPoapStep) => void
}

const CreatePoapForm = ({ setStep }: Props): JSX.Element => {
  const { setPoapData } = useCreatePoapContext()
  const { id } = useGuild()
  const toast = useToast()

  const defaultValues = {
    secret_code: Math.floor(100000 + Math.random() * 900000),
    event_template_id: 0,
    virtual_event: true,
    private_event: false,
    city: "",
    country: "",
  }

  const methods = useForm<CreatePoapFormType>({
    mode: "all",
    defaultValues,
  })

  const { control, handleSubmit } = methods

  const { onSubmit: onSavePoapSubmit, isLoading: isSavePoapLoading } = useSavePoap({
    onSuccess: () => setStep("requirements"),
  })

  const { onSubmit: onCreatePoapSubmit, isLoading: isCreatePoapLoading } =
    useCreatePoap({
      onSuccess: (response) => {
        toast({
          status: "success",
          title: "Drop successfully submitted",
          description:
            "The POAP Curation Body will review your POAP, and you'll receive an email with the minting links that you’ll have to upload",
          duration: 6000,
        })
        setPoapData(response)
        onSavePoapSubmit({
          poapId: response?.id,
          fancyId: response?.fancy_id,
          expiryDate: convertPoapExpiryDate(response.expiry_date),
          guildId: id,
        })
      },
    })

  return (
    <FormProvider {...methods}>
      <PoapDataForm isCreate />
      <Stack
        pt="6"
        mt="auto"
        direction={{ base: "column", sm: "row" }}
        justifyContent="end"
        spacing={2}
      >
        <Button
          colorScheme="green"
          onClick={handleSubmit(onCreatePoapSubmit)}
          isDisabled={isCreatePoapLoading || isSavePoapLoading}
          isLoading={isCreatePoapLoading || isSavePoapLoading}
          loadingText={`Creating POAP`}
        >
          {"Create POAP"}
        </Button>
      </Stack>

      <DynamicDevTool control={control} />
    </FormProvider>
  )
}

export default CreatePoapForm
