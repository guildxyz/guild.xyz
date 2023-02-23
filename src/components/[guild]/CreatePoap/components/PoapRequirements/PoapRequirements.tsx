import { Button, Flex, Heading, Stack, Text, useToast } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import AddRequirement from "components/create-guild/Requirements/components/AddRequirement"
import RequirementEditableCard from "components/create-guild/Requirements/components/RequirementEditableCard"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import LogicDivider from "components/[guild]/LogicDivider"
import { AnimatePresence } from "framer-motion"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { Coin, SpeakerHigh } from "phosphor-react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { RequirementType } from "requirements"
import PoapPaymentForm from "requirements/PoapPayment"
import PoapPaymentRequirementEditable from "requirements/PoapPayment/PoapPaymentRequirementEditable"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import PoapVoiceForm from "requirements/PoapVoice/PoapVoiceForm"
import PoapVoiceRequirementEditable from "requirements/PoapVoice/PoapVoiceRequirementEditable"
import useUpdatePoapRequirements from "../../hooks/useUpdatePoapRequirements"
import { useCreatePoapContext } from "../CreatePoapContext"
import AddPoapRequirement from "./components/AddPoapRequirement"

const PoapRequirements = ({
  onSuccess: onModalClose,
}: UseSubmitOptions): JSX.Element => {
  const toast = useToast()
  const { isSuperAdmin } = useUser()
  const { poaps } = useGuild()
  const { poapData } = useCreatePoapContext()
  const { poapEventDetails } = usePoapEventDetails()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)

  const methods = useForm()
  const { control, getValues, watch } = methods
  const { fields, append, replace, remove, update } = useFieldArray({
    name: "requirements",
    control,
  })

  // Watching the nested fields too, so we can properly update the list
  const watchFieldArray = watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const onSuccess = () => {
    toast({
      status: "success",
      title: "Successfully added POAP",
    })
    onModalClose()
  }

  const { onSubmit, isLoading } = useUpdatePoapRequirements(guildPoap, { onSuccess })

  if (!isSuperAdmin && guildPoap?.activated)
    return (
      <Text>
        You can't set requirements, because you've already started distributing your
        POAP.
      </Text>
    )

  return (
    <FormProvider {...methods}>
      <Heading size="sm" mb="3">
        Set requirements
      </Heading>
      <Stack spacing={0}>
        <AnimatePresence>
          {controlledFields.map((field, i) => {
            const type: RequirementType = getValues(`requirements.${i}.type`)

            return (
              <CardMotionWrapper key={field.id}>
                <RequirementEditableCard
                  type={type}
                  field={field}
                  index={i}
                  removeRequirement={remove}
                  updateRequirement={update}
                />
                <LogicDivider logic="AND" />
              </CardMotionWrapper>
            )
          })}
          {guildPoap?.poapContracts?.map((poapContract) => (
            <CardMotionWrapper key={poapContract.id}>
              <PoapPaymentRequirementEditable
                poapContract={poapContract}
                guildPoap={guildPoap}
              />

              <LogicDivider logic="AND" />
            </CardMotionWrapper>
          ))}
          {poapEventDetails?.voiceChannelId && (
            <CardMotionWrapper>
              <PoapVoiceRequirementEditable guildPoap={guildPoap} />

              <LogicDivider logic="AND" />
            </CardMotionWrapper>
          )}
        </AnimatePresence>

        {/* <AddPoapRequirement
          title="Original guild role"
          isDisabled
          description="Same as if you’d add it to an existing role, but you can set other requirements too"
          FormComponent={Role}
        /> */}
        {!guildPoap?.poapContracts?.length && (
          <AddPoapRequirement
            title="Payment"
            description="Monetize POAP with different payment methods that the users will be able to choose from"
            rightIcon={Coin}
            FormComponent={PoapPaymentForm}
          />
        )}
        {!poapEventDetails?.voiceChannelId && (
          <AddPoapRequirement
            title="Voice participation"
            description="Users will have to be in a Discord voice channel at the time of the event"
            rightIcon={SpeakerHigh}
            FormComponent={PoapVoiceForm}
          />
        )}
        <AddRequirement onAdd={(d) => append(d)} />
      </Stack>
      <Flex justifyContent={"right"} mt="8">
        <Button
          colorScheme="green"
          onClick={
            fields.length ? methods.handleSubmit(onSubmit) : (onSuccess as any)
          }
          isLoading={isLoading}
        >
          Done
        </Button>
      </Flex>
    </FormProvider>
  )
}

export default PoapRequirements
