import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import Button from "components/common/Button"
import TelegramGroup from "components/create-guild/TelegramGroup"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../DefaultAddRewardPanelWrapper"

const AddTelegramPanel = ({ onAdd }: AddRewardPanelProps) => {
  const methods = useForm({
    mode: "all",
    defaultValues: {
      platformGuildId: null,
    },
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  const platformGuildId = useWatch({
    name: "platformGuildId",
    control: methods.control,
  })

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
        <TelegramGroup fieldName={`platformGuildId`}>
          <Button
            colorScheme={"green"}
            onClick={() =>
              onAdd({
                guildPlatform: {
                  platformName: "TELEGRAM",
                  platformId: PlatformType.TELEGRAM,
                  platformGuildId,
                },
                isNew: true,
              })
            }
          >
            Add Telegram
          </Button>
        </TelegramGroup>
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddTelegramPanel
