import { Button, Flex } from "@chakra-ui/react"
import GatherForm from "platforms/Gather/GatherForm"
import { getNameFromSpaceId } from "platforms/Gather/useGatherCardProps"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

export type AddGatherFormType = {
  gatherApiKey: string
  gatherSpaceUrl: string
  gatherSpaceId: string
  gatherRole: string
  gatherAffiliation: string
}

type Props = {
  onSuccess: () => void
}

const AddGatherPanel = ({ onSuccess }: Props) => {
  const methods = useForm<AddGatherFormType>({
    mode: "all",
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const {
    control,
    formState: { errors },
  } = methods

  const [apiKey, spaceUrl] = useWatch({
    name: ["gatherApiKey", "gatherSpaceUrl"],
    control: control,
  })

  const onSubmit = (_data) => {
    append({
      guildPlatform: {
        platformName: "GATHER_TOWN",
        platformGuildId: _data.gatherSpaceId,
        platformGuildData: {
          gatherSpaceId: _data.gatherSpaceId,
          gatherApiKey: _data.gatherApiKey,
          gatherAffiliation: _data.gatherAffiliation,
          gatherRole: _data.gatherRole,
          name: getNameFromSpaceId(_data.gatherSpaceId),
        },
      },
      isNew: true,
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <GatherForm />

      <Flex justifyContent={"flex-end"} mt="auto" pt="10">
        <Button
          isDisabled={
            !!errors?.gatherApiKey ||
            !!errors?.gatherSpaceUrl ||
            !apiKey ||
            !spaceUrl
          }
          colorScheme="green"
          onClick={methods.handleSubmit(onSubmit)}
        >
          Continue
        </Button>
      </Flex>
    </FormProvider>
  )
}

export default AddGatherPanel
