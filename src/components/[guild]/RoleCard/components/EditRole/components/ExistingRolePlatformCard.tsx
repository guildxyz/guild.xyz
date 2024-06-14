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
  RolePlatform,
} from "types"
import DynamicTag from "../../DynamicReward/DynamicTag"
import useUpdateAvailability from "../hooks/useUpdateAvailability"
import useUpdateRolePlatformVisibility from "../hooks/useUpdateRolePlatformVisibility"

type Props = {
  rolePlatform: RolePlatform
}

const ExistingRolePlatformCard = ({ rolePlatform }: Props) => {
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

  const { onSubmit: onAvailabilityChange, isLoading: isAvailabilityLoading } =
    useUpdateAvailability()
  const { onSubmit: onVisibilityChange, isLoading: isVisibilityLoading } =
    useUpdateRolePlatformVisibility()

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
              await onVisibilityChange({
                rolePlatform,
                visibility,
                visibilityRoleId,
              })
              setVisibilityModalProps.onClose()
            }}
            isLoading={isVisibilityLoading}
            {...setVisibilityModalProps}
          />
        }
        cornerButton={
          <RemovePlatformButton {...{ removeButtonColor, isPlatform }} />
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
                  onAvailabilityChange({
                    rolePlatform,
                    capacity,
                    startTime,
                    endTime,
                  })
                }
                isLoading={isAvailabilityLoading}
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

export default ExistingRolePlatformCard
