import { Box, CloseButton, Spinner, Tag, useColorModeValue } from "@chakra-ui/react"
import AvailabilitySetup from "components/[guild]/AddRewardButton/components/AvailabilitySetup"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import PlatformCard from "components/[guild]/RolePlatforms/components/PlatformCard"
import { RolePlatformProvider } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import SetVisibility from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import useGuild from "components/[guild]/hooks/useGuild"
import { motion } from "framer-motion"
import NftAvailabilityTags from "platforms/ContractCall/components/NftAvailabilityTags"
import rewards, { CAPACITY_TIME_PLATFORMS } from "platforms/rewards"
import { useState } from "react"
import {
  GuildPlatformWithOptionalId,
  PlatformName,
  PlatformType,
  RoleFormType,
  RolePlatform,
  Visibility,
} from "types"
import DynamicTag from "../../DynamicReward/DynamicTag"

type GenericRolePlatformCardProps = {
  roleId?: number
  rolePlatform: RoleFormType["rolePlatforms"][number]
  index: number
  onRemove: (rolePlatformId: number) => void
  onVisibilityChange: (
    visibility: Visibility,
    visibilityRoleId: number
  ) => Promise<any>
  onAvailabilityChange: (capacity, startTime, endTime) => Promise<any>
}

const MotionTag = motion(Tag)

const GenericRolePlatformCard = ({
  roleId,
  rolePlatform,
  index,
  onRemove,
  onVisibilityChange,
  onAvailabilityChange,
}: GenericRolePlatformCardProps) => {
  const { guildPlatforms } = useGuild()

  const setVisibilityModalProps = useVisibilityModalProps()

  const removeButtonColor = useColorModeValue("gray.700", "gray.400")

  const [isUpdating, setIsUpdating] = useState(false)

  let guildPlatform: GuildPlatformWithOptionalId, type: PlatformName
  if (rolePlatform.guildPlatformId) {
    guildPlatform = guildPlatforms.find(
      (platform) => platform.id === rolePlatform.guildPlatformId
    )
    type = PlatformType[guildPlatform?.platformId] as PlatformName
  } else {
    guildPlatform = rolePlatform.guildPlatform
    type = guildPlatform?.platformName
  }

  if (!type) return null

  const isLegacyContractCallReward =
    type === "CONTRACT_CALL" &&
    guildPlatform.platformGuildData.function ===
      ContractCallFunction.DEPRECATED_SIMPLE_CLAIM

  const { cardPropsHook: useCardProps } = rewards[type]

  return (
    <RolePlatformProvider
      key={rolePlatform.id}
      rolePlatform={{
        ...rolePlatform,
        roleId,
        guildPlatform,
        index,
      }}
    >
      <Box position="relative" overflow={"hidden"}>
        <PlatformCard
          overflow="hidden"
          usePlatformCardProps={useCardProps}
          guildPlatform={guildPlatform}
          isLoading
          titleRightElement={
            <SetVisibility
              defaultValues={{
                visibility: rolePlatform?.visibility,
                visibilityRoleId: rolePlatform?.visibilityRoleId,
              }}
              entityType="reward"
              onSave={async ({ visibility, visibilityRoleId }) => {
                setIsUpdating(true)
                await onVisibilityChange(visibility, visibilityRoleId)
                setVisibilityModalProps.onClose()
                setIsUpdating(false)
              }}
              isLoading={isUpdating}
              {...setVisibilityModalProps}
            />
          }
          cornerButton={
            <CloseButton
              size="sm"
              color={removeButtonColor}
              rounded="full"
              aria-label="Remove platform"
              zIndex="1"
              onClick={() => onRemove(rolePlatform.id)}
            />
          }
          contentRow={
            <>
              {CAPACITY_TIME_PLATFORMS.includes(type) ||
              isLegacyContractCallReward ? (
                <AvailabilitySetup
                  platformType={type}
                  rolePlatform={rolePlatform}
                  defaultValues={{
                    capacity: rolePlatform.capacity,
                    startTime: rolePlatform.startTime,
                    endTime: rolePlatform.endTime,
                  }}
                  onDone={async ({ capacity, endTime, startTime }) => {
                    setIsUpdating(true)
                    await onAvailabilityChange(capacity, startTime, endTime)
                    setIsUpdating(false)
                  }}
                />
              ) : type === "CONTRACT_CALL" ? (
                <NftAvailabilityTags
                  guildPlatform={guildPlatform}
                  rolePlatform={rolePlatform}
                  mt={1}
                />
              ) : null}
              {!!rolePlatform.dynamicAmount && (
                <DynamicTag
                  rolePlatform={
                    { ...rolePlatform, guildPlatform: guildPlatform } as RolePlatform
                  }
                  editDisabled
                  mt={1}
                />
              )}
            </>
          }
        />
        <MotionTag
          initial={{ y: -100, opacity: 0 }}
          animate={isUpdating ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          margin={0}
          size="md"
          gap={2}
          pr={3.5}
          mx="auto"
          left={0}
          right={0}
          colorScheme="blue"
          top={3}
          borderRadius="full"
          width={"fit-content"}
          position={"absolute"}
        >
          <Spinner size={"xs"} /> Updating
        </MotionTag>
      </Box>
    </RolePlatformProvider>
  )
}

export default GenericRolePlatformCard
