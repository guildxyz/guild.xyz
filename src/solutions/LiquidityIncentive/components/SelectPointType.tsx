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
import ExistingPointsTypeSelect from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import RewardImagePicker from "platforms/SecretText/SecretTextDataForm/components/RewardImagePicker"
import { useFormContext, useWatch } from "react-hook-form"
import Star from "static/icons/star.svg"
import { PlatformType } from "types"

const SelectPointType = () => {
  const { id, guildPlatforms } = useGuild()
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

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
          existingPointsRewards={existingPointsRewards}
          selectedExistingId={selectedExistingId}
          showCreateNew
          fieldPath="pointsId"
        />
      )}

      <Collapse
        in={!existingPointsRewards.length || selectedExistingId === null}
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
