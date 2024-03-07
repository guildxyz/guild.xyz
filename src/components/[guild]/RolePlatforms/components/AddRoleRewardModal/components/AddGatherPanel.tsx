import { Button, Flex } from "@chakra-ui/react"
import GatherForm from "platforms/Gather/GatherForm"
import useGatherAccess from "platforms/Gather/hooks/useGatherAccess"
import {
  gatherSpaceIdToName,
  gatherSpaceUrlToSpaceId,
} from "platforms/Gather/useGatherCardProps"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"

export type AddGatherFormType = {
  gatherApiKey: string
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
    name: ["gatherApiKey", "gatherSpaceId"],
    control: control,
  })
  const { success: accessSuccess } = useGatherAccess(
    !errors?.gatherApiKey && apiKey,
    !errors?.gatherSpaceId && spaceUrl
  )

  const onSubmit = (_data) => {
    const spaceId = gatherSpaceUrlToSpaceId(_data.gatherSpaceId)
    append({
      guildPlatform: {
        platformName: "GATHER_TOWN",
        platformGuildId: spaceId,
        platformGuildData: {
          gatherSpaceId: spaceId,
          gatherApiKey: _data.gatherApiKey,
          gatherAffiliation: _data.gatherAffiliation,
          gatherRole: _data.gatherRole,
          name: gatherSpaceIdToName(spaceId),
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
          isDisabled={!accessSuccess}
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
