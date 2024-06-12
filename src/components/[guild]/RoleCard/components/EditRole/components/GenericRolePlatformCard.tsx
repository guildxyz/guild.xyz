import { CloseButton, useColorModeValue } from "@chakra-ui/react"
import AvailabilitySetup from "components/[guild]/AddRewardButton/components/AvailabilitySetup"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import PlatformCard from "components/[guild]/RolePlatforms/components/PlatformCard"
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
  roleId?: number
  rolePlatform: RoleFormType["rolePlatforms"][number]
  index: number
  onRemove: (rolePlatformId: number) => void
  onVisibilityChange: (visibility: Visibility, visibilityRoleId: number) => void
  onAvailabilityChange: (capacity, startTime, endTime) => void
}

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
      <PlatformCard
        usePlatformCardProps={useCardProps}
        guildPlatform={guildPlatform}
        /**
         * TODO: use the `PUT
         * /guilds/:guildId/roles/:roleId/role-platforms/:rolePlatformId` endpoint
         * here
         */
        titleRightElement={
          <SetVisibility
            defaultValues={{
              visibility: rolePlatform?.visibility,
              visibilityRoleId: rolePlatform?.visibilityRoleId,
            }}
            entityType="reward"
            onSave={({ visibility, visibilityRoleId }) => {
              onVisibilityChange(visibility, visibilityRoleId)
              setVisibilityModalProps.onClose()
            }}
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
                  onAvailabilityChange(capacity, startTime, endTime)
                }
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
