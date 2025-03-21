import { Flex } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { AddRewardPanelProps } from "rewards"
import FarcasterChannelForm from "rewards/FarcasterChannel/FarcasterChannelForm"
import { PlatformGuildData, PlatformType } from "types"
import { DefaultAddRewardPanelWrapper } from "../DefaultAddRewardPanelWrapper"

export type AddFarcasterChannelFormType = {
  channel: {
    id: string
    name: string
    imageUrl?: string
  }
}

const AddGatherPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm<AddFarcasterChannelFormType>({
    mode: "all",
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  const channelId = useWatch({
    control: methods.control,
    name: "channel.id",
  })

  const { id: moderatorUserId } = useUser()

  const { targetRoleId } = useAddRewardContext()

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
        <FarcasterChannelForm />

        <Flex justifyContent={"flex-end"} mt="auto" pt="10">
          <Button
            isDisabled={!channelId}
            colorScheme="green"
            onClick={methods.handleSubmit((data) =>
              onAdd({
                guildPlatform: {
                  platformGuildId: data.channel.id,
                  platformId: PlatformType.FARCASTER_CHANNEL,
                  platformName: "FARCASTER_CHANNEL",
                  platformGuildData: {
                    name: data.channel.name,
                    imageUrl: data.channel.imageUrl,
                    moderatorUserId,
                  } as PlatformGuildData["FARCASTER_CHANNEL"],
                },

                platformRoleId: `FARCASTER_CHANNEL-${targetRoleId}`,
                isNew: true,
              })
            )}
          >
            Continue
          </Button>
        </Flex>
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddGatherPanel
