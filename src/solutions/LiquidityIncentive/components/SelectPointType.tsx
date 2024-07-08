import {
  Collapse,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import ExistingPointsTypeSelect, {
  CREATE_NEW_OPTION,
} from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFormContext, useWatch } from "react-hook-form"
import RewardImagePicker from "rewards/SecretText/SecretTextDataForm/components/RewardImagePicker"
import Star from "static/icons/star.svg"
import { PlatformType } from "types"
import { LiquidityIncentiveForm } from "../LiquidityIncentiveSetupModal"

const SelectPointType = () => {
  const { guildPlatforms } = useGuild()
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext<LiquidityIncentiveForm>()

  const existingPointsRewards = guildPlatforms
    ? guildPlatforms.filter((gp) => gp.platformId === PlatformType.POINTS)
    : []

  const selectedExistingId = useWatch({
    control,
    name: "pointsId",
  })

  return (
    <Stack gap={3}>
      {!!existingPointsRewards.length && (
        <ExistingPointsTypeSelect
          fieldName="pointsId"
          existingPointsRewards={existingPointsRewards}
          selectedExistingId={selectedExistingId ?? undefined}
          showCreateNew
        />
      )}

      <Collapse
        in={
          !existingPointsRewards.length || selectedExistingId === CREATE_NEW_OPTION
        }
        style={{ flexShrink: 0 }}
      >
        <FormControl isInvalid={!!errors?.name} flex="1">
          <Text fontWeight={"medium"} mb="2">
            {existingPointsRewards.length ? "Appearance" : "Points setup"}
          </Text>
          <HStack>
            <RewardImagePicker defaultIcon={Star} />
            <Input {...register("name")} placeholder="points" />
          </HStack>
          <FormErrorMessage>{errors?.name?.message as string}</FormErrorMessage>
        </FormControl>
        {!!existingPointsRewards.length && <Divider mt={5} />}
      </Collapse>
    </Stack>
  )
}

export default SelectPointType
