import { useColorModeValue } from "@chakra-ui/react"
import AvailabilitySetup from "components/[guild]/AddRewardButton/components/AvailabilitySetup"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import PlatformCard from "components/[guild]/RolePlatforms/components/PlatformCard"
import RemovePlatformButton from "components/[guild]/RolePlatforms/components/RemovePlatformButton"
import { RolePlatformProvider } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import SetVisibility from "components/[guild]/SetVisibility"
import useVisibilityModalProps from "components/[guild]/SetVisibility/hooks/useVisibilityModalProps"
import useGuild from "components/[guild]/hooks/useGuild"
import NftAvailabilityTags from "platforms/ContractCall/components/NftAvailabilityTags"
import rewards, { CAPACITY_TIME_PLATFORMS } from "platforms/rewards"
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
  rolePlatform: RoleFormType["rolePlatforms"][number]
  handlers: {
    onRemove: (rolePlatform: RolePlatform) => void
    onVisibilityChange: (
      rolePlatform: RolePlatform,
      visibility: Visibility,
      visibilityRoleId: number
    ) => Promise<any>
    onAvailabilityChange: (
      rolePlatform: RolePlatform,
      capacity?: number,
      startTime?: string,
      endTime?: string
    ) => Promise<any>
  }
  loadingStates: {
    isRemoving: boolean
    isUpdating: boolean
  }
}

const GenericRolePlatformCard = ({
  rolePlatform,
  handlers: { onRemove, onVisibilityChange, onAvailabilityChange },
  loadingStates: { isRemoving, isUpdating },
}: GenericRolePlatformCardProps) => {
  const { guildPlatforms } = useGuild()
  const setVisibilityModalProps = useVisibilityModalProps()
  const removeButtonColor = useColorModeValue("gray.700", "gray.400")

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

  const { cardPropsHook: useCardProps, isPlatform } = rewards[type]

  return (
    <RolePlatformProvider
      key={rolePlatform.id}
      rolePlatform={{
        ...rolePlatform,
        guildPlatform,
      }}
    >
      <PlatformCard
        overflow="hidden"
        usePlatformCardProps={useCardProps}
        guildPlatform={guildPlatform}
        titleRightElement={
          <SetVisibility
            defaultValues={{
              visibility: rolePlatform?.visibility,
              visibilityRoleId: rolePlatform?.visibilityRoleId,
            }}
            entityType="reward"
            onSave={async ({ visibility, visibilityRoleId }) => {
              await onVisibilityChange(
                rolePlatform as RolePlatform,
                visibility,
                visibilityRoleId
              )
              setVisibilityModalProps.onClose()
            }}
            isLoading={isUpdating}
            {...setVisibilityModalProps}
          />
        }
        cornerButton={
          <RemovePlatformButton
            {...{ removeButtonColor, isPlatform }}
            onSubmit={() => onRemove(rolePlatform as RolePlatform)}
            isLoading={isRemoving}
          />
        }
        contentRow={
          <>
            {CAPACITY_TIME_PLATFORMS.includes(type) || isLegacyContractCallReward ? (
              <AvailabilitySetup
                platformType={type}
                rolePlatform={rolePlatform}
                defaultValues={{
                  capacity: rolePlatform.capacity,
                  startTime: rolePlatform.startTime,
                  endTime: rolePlatform.endTime,
                }}
                onDone={({ capacity, endTime, startTime }) =>
                  onAvailabilityChange(
                    rolePlatform as RolePlatform,
                    capacity,
                    startTime,
                    endTime
                  )
                }
                isLoading={isUpdating}
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
    </RolePlatformProvider>
  )
}

export default GenericRolePlatformCard
