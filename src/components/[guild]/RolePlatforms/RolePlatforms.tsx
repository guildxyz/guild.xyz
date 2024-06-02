import { CloseButton, SimpleGrid, Spacer, useColorModeValue } from "@chakra-ui/react"
import TransitioningPlatformIcons from "components/[guild]/RolePlatforms/components/TransitioningPlatformIcons"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Section from "components/common/Section"
import { atom } from "jotai"
import { Plus } from "phosphor-react"
import NftAvailabilityTags from "platforms/ContractCall/components/NftAvailabilityTags"
import rewards, { CAPACITY_TIME_PLATFORMS } from "platforms/rewards"
import { useFieldArray, useFormContext } from "react-hook-form"
import {
  GuildPlatformWithOptionalId,
  PlatformName,
  PlatformType,
  RoleFormType,
  RolePlatform,
} from "types"
import AvailabilitySetup from "../AddRewardButton/components/AvailabilitySetup"
import { AddRewardProvider, useAddRewardContext } from "../AddRewardContext"
import DynamicTag from "../RoleCard/components/DynamicReward/DynamicTag"
import SetVisibility from "../SetVisibility"
import useVisibilityModalProps from "../SetVisibility/hooks/useVisibilityModalProps"
import useGuild from "../hooks/useGuild"
import AddRoleRewardModal from "./components/AddRoleRewardModal"
import { ContractCallFunction } from "./components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import EditRolePlatformButton from "./components/EditRolePlatformButton"
import PlatformCard from "./components/PlatformCard"
import RemovePlatformButton from "./components/RemovePlatformButton"
import { RolePlatformProvider } from "./components/RolePlatformProvider"

type Props = {
  roleId?: number
}

export const openRewardSettingsGuildPlatformIdAtom = atom(0)

const RolePlatforms = ({ roleId }: Props) => {
  const { onOpen } = useAddRewardContext()

  const { watch } = useFormContext<RoleFormType>()

  const { fields, append, remove } = useFieldArray<
    RoleFormType,
    "rolePlatforms",
    "fieldId"
  >({
    name: "rolePlatforms",
    keyName: "fieldId",
  })
  const watchFieldArray = watch("rolePlatforms")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  return (
    <Section
      title="Rewards"
      titleRightElement={
        <>
          <Spacer />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus />}
            rightIcon={<TransitioningPlatformIcons boxSize="4" />}
            onClick={onOpen}
          >
            Add reward
          </Button>
        </>
      }
    >
      <SimpleGrid spacing={{ base: 3 }}>
        {!controlledFields || controlledFields?.length <= 0 ? (
          <AddCard title="Add reward" onClick={onOpen} />
        ) : (
          controlledFields.map((rolePlatform, index) => (
            <RolePlatformCard
              key={rolePlatform.fieldId}
              roleId={roleId}
              rolePlatform={rolePlatform}
              index={index}
              remove={() => remove(index)}
            />
          ))
        )}
      </SimpleGrid>

      <AddRoleRewardModal append={append} />
    </Section>
  )
}

const RolePlatformsWrapper = (props: Props): JSX.Element => (
  <AddRewardProvider targetRoleId={props.roleId}>
    <RolePlatforms {...props} />
  </AddRewardProvider>
)

type RolePlatformCardProps = {
  roleId?: number
  rolePlatform: RoleFormType["rolePlatforms"][number] & { fieldId: string }
  index: number
  remove: () => void
}

const RolePlatformCard = ({
  roleId,
  rolePlatform,
  index,
  remove,
}: RolePlatformCardProps) => {
  const { guildPlatforms } = useGuild()
  const { setValue } = useFormContext()

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

  const {
    cardPropsHook: useCardProps,
    cardSettingsComponent,
    isPlatform,
  } = rewards[type]

  return (
    <RolePlatformProvider
      key={rolePlatform.fieldId}
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
              setValue(`rolePlatforms.${index}.visibility`, visibility, {
                shouldDirty: true,
              })
              setValue(`rolePlatforms.${index}.visibilityRoleId`, visibilityRoleId, {
                shouldDirty: true,
              })
              setVisibilityModalProps.onClose()
            }}
            {...setVisibilityModalProps}
          />
        }
        cornerButton={
          !rolePlatform.isNew ? (
            <RemovePlatformButton {...{ removeButtonColor, isPlatform }} />
          ) : (
            <CloseButton
              size="sm"
              color={removeButtonColor}
              rounded="full"
              aria-label="Remove platform"
              zIndex="1"
              onClick={() => remove()}
            />
          )
        }
        actionRow={
          cardSettingsComponent &&
          rolePlatform.isNew && (
            <EditRolePlatformButton
              SettingsComponent={cardSettingsComponent}
              rolePlatform={rolePlatform}
            />
          )
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
                onDone={({ capacity, startTime, endTime }) => {
                  setValue(`rolePlatforms.${index}.capacity`, capacity, {
                    shouldDirty: true,
                  })
                  setValue(`rolePlatforms.${index}.startTime`, startTime, {
                    shouldDirty: true,
                  })
                  setValue(`rolePlatforms.${index}.endTime`, endTime, {
                    shouldDirty: true,
                  })
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
                mt={1}
              />
            )}
          </>
        }
      />
    </RolePlatformProvider>
  )
}

export default RolePlatformsWrapper
