import { Icon } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { targetRoleAtom } from "components/[guild]/RoleCard/components/EditRole/EditRole"
import useGuild from "components/[guild]/hooks/useGuild"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useAtomValue } from "jotai"
import { Star } from "phosphor-react"
import { AddRewardPanelProps } from "platforms/rewards"
import { ReactNode } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformGuildData, PlatformType } from "types"
import ConversionSetup from "../DynamicSetup/ConversionSetup"
import InformationModal from "../DynamicSetup/InformationModal"
import PointsRewardSetup from "./components/PointsRewardSetup"

export type AddPointsFormType = {
  data: { guildPlatformId: number }
  amount: string
  name: string
  imageUrl: string
  dynamic?: {
    multiplier: number
    requirementId: number
  }
}

const AddPointsPanel = ({ onAdd }: AddRewardPanelProps) => {
  const { id, guildPlatforms } = useGuild()

  const existingPointsRewards = guildPlatforms.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const methods = useForm<AddPointsFormType>({
    mode: "all",
    defaultValues: {
      data: { guildPlatformId: existingPointsRewards?.[0]?.id },
    },
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  const { control } = methods
  const selectedExistingId = useWatch({
    control,
    name: "data.guildPlatformId",
  })

  const selectedImageUrl =
    existingPointsRewards?.find((gp) => gp.id === selectedExistingId)
      ?.platformGuildData?.imageUrl || null
  const formImageUrl = useWatch({ control, name: "imageUrl" })
  const imageUrl = selectedExistingId ? selectedImageUrl : formImageUrl

  const targetRoleId = useAtomValue<number>(targetRoleAtom)

  const pointImage: ReactNode = imageUrl ? (
    <OptionImage img={imageUrl} alt={"Point type image"} />
  ) : (
    <Icon as={Star} />
  )

  const onSubmit = (data: AddPointsFormType) => {
    const dynamicAmount = data?.dynamic?.multiplier
      ? {
          operation: {
            type: "LINEAR",
            params: {
              addition: 0,
              multiplier: data.dynamic.multiplier,
              shouldFloorResult: true,
            },
            input: {
              type: "REQUIREMENT_AMOUNT",
              requirementId: data.dynamic.requirementId,
              roleId: targetRoleId,
            },
          },
        }
      : null

    onAdd({
      ...(selectedExistingId
        ? {
            guildPlatformId: selectedExistingId,
            // have to send these in this case too so the validator doesn't throw an error
            guildPlatform: {
              platformName: "POINTS",
              platformId: PlatformType.POINTS,
              platformGuildId: "",
              platformGuildData: {},
            } as any,
          }
        : {
            guildPlatform: {
              platformName: "POINTS",
              platformId: PlatformType.POINTS,
              platformGuildId: `points-${id}-${data.name.toLowerCase() || "points"}`,
              platformGuildData: {
                name: data.name,
                imageUrl: data.imageUrl,
              } satisfies PlatformGuildData["POINTS"],
            },
          }),
      isNew: true,
      platformRoleData: {
        score: parseInt(data.amount),
      },
      dynamicAmount: dynamicAmount as any,
    })
  }

  const steps: Record<string, JSX.Element> = {
    REWARD_SETUP: <PointsRewardSetup onSubmit={methods.handleSubmit(onSubmit)} />,
    INFO: <InformationModal />,
    CONVERSION_SETUP: (
      <ConversionSetup
        onSubmit={methods.handleSubmit(onSubmit)}
        toImage={pointImage}
      />
    ),
  }

  const { step } = useAddRewardContext()
  const SetupStep = steps[step]

  return <FormProvider {...methods}>{SetupStep}</FormProvider>
}

export default AddPointsPanel
