import { Collapse, Divider, Flex, Text, Tooltip } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { AddRewardPanelProps } from "platforms/rewards"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformGuildData, PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../../DefaultAddRewardPanelWrapper"
import AddNewPointsType from "./components/AddNewPointsType"
import ExistingPointsTypeSelect from "./components/ExistingPointsTypeSelect"
import SetPointsAmount from "./components/SetPointsAmount"

export type AddPointsFormType = {
  data: { guildPlatformId: number }
  name: string
  imageUrl: string
  platformRoleData?: { score: string }
  dynamicAmount?: {
    operation: {
      input: { requirementId: number }
      params: { multiplier: number }
    }
  }
}

const AddPointsPanel = ({ onAdd }: AddRewardPanelProps) => {
  const { id, guildPlatforms } = useGuild()

  const { targetRoleId } = useAddRewardContext()

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
  const localName = useWatch({ control, name: "name" })
  const localImageUrl = useWatch({ control, name: "imageUrl" })

  const { name: selectedName, imageUrl: selectedImageUrl } =
    existingPointsRewards?.find((gp) => gp.id === selectedExistingId)
      ?.platformGuildData ?? {}

  const name = selectedName ?? localName
  const imageUrl = selectedExistingId ? selectedImageUrl : localImageUrl // not just ?? so it doesn't stay localImageUrl if we upload an image then switch to an existing type without image

  const formDynamicAmount = useWatch({ control, name: "dynamicAmount" })
  const isContinueDisabled =
    !!formDynamicAmount && !formDynamicAmount?.operation.input?.requirementId

  const onSubmit = (data: AddPointsFormType) => {
    const dynamicAmount = data?.dynamicAmount
      ? {
          operation: {
            type: "LINEAR",
            params: {
              addition: 0,
              multiplier: data.dynamicAmount.operation.params.multiplier,
              shouldFloorResult: true,
            },
            input: {
              type: "REQUIREMENT_AMOUNT",
              requirementId: data.dynamicAmount.operation.input.requirementId,
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
      roleId: targetRoleId,
      ...(dynamicAmount
        ? { dynamicAmount: dynamicAmount as any }
        : {
            platformRoleData: {
              score: parseInt(data.platformRoleData.score),
            },
          }),
    })
  }

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
        <Text colorScheme="gray" fontWeight="semibold" mb="8">
          Gamify your guild with a score system, so users can collect points / XP /
          your custom branded score, and compete on a leaderboard. You’ll also be
          able to set points based requirements for satisfying higher level roles!
        </Text>
        {!!existingPointsRewards.length && (
          <ExistingPointsTypeSelect
            existingPointsRewards={existingPointsRewards}
            selectedExistingId={selectedExistingId}
            showCreateNew
            mb="5"
          />
        )}
        <Collapse
          in={!existingPointsRewards.length || selectedExistingId === null}
          style={{ flexShrink: 0 }}
        >
          <AddNewPointsType
            name={name}
            imageUrl={imageUrl}
            isOptional={!existingPointsRewards.length}
          />
        </Collapse>
        <Divider mt={8} mb={4} />

        <SetPointsAmount {...{ imageUrl, name }} baseFieldPath="" />

        <Flex justifyContent={"flex-end"} mt="auto" pt="10">
          <Tooltip
            label={
              isContinueDisabled &&
              "Please select a base value for dynamic reward calculation."
            }
            hasArrow
            placement={"top"}
          >
            <Button
              colorScheme="green"
              isDisabled={isContinueDisabled}
              onClick={methods.handleSubmit(onSubmit)}
            >
              Continue
            </Button>
          </Tooltip>
        </Flex>
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}

export default AddPointsPanel
