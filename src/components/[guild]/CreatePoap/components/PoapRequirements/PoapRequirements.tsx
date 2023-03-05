import { Button, Flex, Heading, Stack } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import AddRequirement from "components/create-guild/Requirements/components/AddRequirement"
import RequirementEditableCard from "components/create-guild/Requirements/components/RequirementEditableCard"
import useGuild from "components/[guild]/hooks/useGuild"
import LogicDivider from "components/[guild]/LogicDivider"
import { AnimatePresence } from "framer-motion"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { Coin, SpeakerHigh } from "phosphor-react"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form"
import { RequirementType } from "requirements"
import PoapPaymentForm from "requirements/PoapPayment"
import PoapPaymentRequirementEditable from "requirements/PoapPayment/PoapPaymentRequirementEditable"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import PoapVoiceForm from "requirements/PoapVoice/PoapVoiceForm"
import PoapVoiceRequirementEditable from "requirements/PoapVoice/PoapVoiceRequirementEditable"
import logo from "static/logo.svg"
import { PlatformType } from "types"
import useUpdatePoapRequirements from "../../hooks/useUpdatePoapRequirements"
import { useCreatePoapContext } from "../CreatePoapContext"
import PoapSuccessCard from "../PoapSuccessCard"
import AddPoapRequirement from "./components/AddPoapRequirement"
import OriginalGuildRoleForm from "./components/OriginalGuildRoleForm"

const SetupPoapRequirements = ({
  onSuccess: onModalClose,
}: UseSubmitOptions): JSX.Element => {
  const toast = useToast()
  const { poaps } = useGuild()

  const { poapData } = useCreatePoapContext()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)

  const methods = useForm()

  const onSuccess = () => {
    toast({
      status: "success",
      title: "Successfully added POAP",
    })
    onModalClose()
  }

  const { onSubmit, isLoading } = useUpdatePoapRequirements(guildPoap, { onSuccess })

  const handleSubmit = (data) => {
    if (!data?.requirements?.length) return onSuccess()
    return onSubmit(data)
  }

  return (
    <FormProvider {...methods}>
      <PoapSuccessCard />
      <Heading size="sm" mb="3" mt="8">
        Set requirements
      </Heading>
      <PoapRequirements guildPoap={guildPoap ?? { poapIdentifier: poapData?.id }} />
      <Flex justifyContent={"right"} mt="8">
        <Button
          colorScheme="green"
          onClick={methods.handleSubmit(handleSubmit)}
          isLoading={isLoading}
        >
          Save
        </Button>
      </Flex>
    </FormProvider>
  )
}

const PoapRequirements = ({ guildPoap }): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const hasDiscord = guildPlatforms?.some(
    (platform) => platform.platformId === PlatformType.DISCORD
  )

  const { poapEventDetails } = usePoapEventDetails(guildPoap?.poapIdentifier)

  const methods = useFormContext()
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

  return (
    <Stack spacing={0}>
      <AnimatePresence>
        {poapEventDetails?.voiceChannelId && (
          <CardMotionWrapper>
            <PoapVoiceRequirementEditable guildPoap={guildPoap} />

            <LogicDivider logic="AND" />
          </CardMotionWrapper>
        )}

        {guildPoap?.poapContracts?.map((poapContract, i) => (
          <CardMotionWrapper key={poapContract.id}>
            <PoapPaymentRequirementEditable
              poapContract={poapContract}
              guildPoap={guildPoap}
            />

            <LogicDivider
              logic={i === guildPoap.poapContracts.length - 1 ? "AND" : "OR"}
            />
          </CardMotionWrapper>
        ))}

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
      </AnimatePresence>

      {!fields.some((field: any) => field.type === "GUILD_ROLE") && (
        <AddPoapRequirement
          title="Original guild role"
          description="Same as if you’d add it to an existing role, but you can set other requirements too"
          rightIcon={logo}
          FormComponent={OriginalGuildRoleForm}
          onAdd={(d) => append(d)}
          poapId={guildPoap?.poapIdentifier}
        />
      )}
      <AddPoapRequirement
        title="Payment"
        description="Monetize POAP with different payment methods"
        rightIcon={Coin}
        FormComponent={PoapPaymentForm}
        poapId={guildPoap?.poapIdentifier}
      />
      {hasDiscord && !poapEventDetails?.voiceChannelId && (
        <AddPoapRequirement
          title="Voice participation"
          description="Users will have to be in a Discord voice channel at the time of the event"
          rightIcon={SpeakerHigh}
          FormComponent={PoapVoiceForm}
          poapId={guildPoap?.poapIdentifier}
        />
      )}
      <AddRequirement onAdd={(d) => append(d)} />
    </Stack>
  )
}

export default PoapRequirements
export { SetupPoapRequirements }
