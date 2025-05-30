import { Button, Flex } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { AddRewardPanelProps } from "rewards"
import GatherForm from "rewards/Gather/GatherForm"
import useGatherAccess from "rewards/Gather/hooks/useGatherAccess"
import {
  gatherSpaceIdToName,
  gatherSpaceUrlToSpaceId,
} from "rewards/Gather/useGatherCardProps"
import { PlatformType } from "types"
import { DefaultAddRewardPanelWrapper } from "../DefaultAddRewardPanelWrapper"

export type AddGatherFormType = {
  gatherApiKey: string
  gatherSpaceId: string
  gatherRole: string
  gatherAffiliation: string
}

const AddGatherPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<AddGatherFormType>({
    mode: "all",
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

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
    onAdd({
      guildPlatform: {
        platformId: PlatformType.GATHER_TOWN,
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
  }

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
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
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddGatherPanel
