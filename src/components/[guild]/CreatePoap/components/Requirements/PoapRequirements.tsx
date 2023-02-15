import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import AddRequirement from "components/create-guild/Requirements/components/AddRequirement"
import RequirementEditableCard from "components/create-guild/Requirements/components/RequirementEditableCard"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import LogicDivider from "components/[guild]/LogicDivider"
import { AnimatePresence } from "framer-motion"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { RequirementType } from "requirements"
import { useCreatePoapContext } from "../CreatePoapContext"

const PoapRequirements = (): JSX.Element => {
  const { isSuperAdmin } = useUser()
  const { poaps } = useGuild()
  const { poapData } = useCreatePoapContext()
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
        </AnimatePresence>

        <AddCard
          title="Original guild role"
          description="Same as if you’d add it to an existing role, but you can set other requirements too"
          py="5"
          mb="2 !important"
        />
        <AddCard
          title="Payment"
          description="Monetize POAP with different payment methods that the users will be able to choose from"
          // rightIcon={Coin}
          py="5"
          mb="2 !important"
        />
        <AddCard
          title="Voice participation"
          description="Users will have to be in a Discord voice channel at the time of the event"
          // rightIcon={SpeakerHigh}
          py="5"
          mb="2 !important"
        />
        <AddRequirement onAdd={(d) => append(d)} />
      </Stack>
      <Flex justifyContent={"right"} mt="8">
        <Button colorScheme="green" onClick={() => {}}>
          Done
        </Button>
      </Flex>
    </FormProvider>
  )
}

export default PoapRequirements
