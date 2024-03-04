import { CloseButton, SimpleGrid, Spacer, useColorModeValue } from "@chakra-ui/react"
import TransitioningPlatformIcons from "components/[guild]/RolePlatforms/components/TransitioningPlatformIcons"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Section from "components/common/Section"
import { Plus } from "phosphor-react"
import platforms, { CAPACITY_TIME_PLATFORMS } from "platforms/platforms"
import { useFieldArray, useFormContext } from "react-hook-form"
import { GuildPlatform, PlatformType } from "types"
import AvailabilitySetup from "../AddRewardButton/components/AvailabilitySetup"
import { AddRewardProvider, useAddRewardContext } from "../AddRewardContext"
import useGuild from "../hooks/useGuild"
import AddRoleRewardModal from "./components/AddRoleRewardModal"
import PlatformCard from "./components/PlatformCard"
import RemovePlatformButton from "./components/RemovePlatformButton"
import { RolePlatformProvider } from "./components/RolePlatformProvider"

type Props = {
  roleId?: number
}

const RolePlatforms = ({ roleId }: Props) => {
  const { guildPlatforms } = useGuild()
  const { setValue, watch } = useFormContext()

  const { onOpen } = useAddRewardContext()

  const { fields, remove } = useFieldArray({
    name: "rolePlatforms",
    keyName: "fieldId",
  })
  const watchFieldArray = watch("rolePlatforms")
  const controlledFields = watchFieldArray.map((field, index) => ({
    ...field,
    ...fields[index],
  }))

  const removeButtonColor = useColorModeValue("gray.700", "gray.400")

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
          controlledFields.map((rolePlatform: any, index) => {
            let guildPlatform: GuildPlatform, type
            if (rolePlatform.guildPlatformId) {
              guildPlatform = guildPlatforms.find(
                (platform) => platform.id === rolePlatform.guildPlatformId
              )
              type = PlatformType[guildPlatform?.platformId]
            } else {
              guildPlatform = rolePlatform.guildPlatform
              type = guildPlatform?.platformName
            }

            if (!type) return null

            const { cardPropsHook: useCardProps, cardSettingsComponent } =
              platforms[type]

            let PlatformCardSettings = cardSettingsComponent
            // only show Google access level settings and Discord role settings for new platforms
            if (!rolePlatform.isNew) PlatformCardSettings = null

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
                  usePlatformProps={useCardProps}
                  guildPlatform={guildPlatform}
                  cornerButton={
                    !rolePlatform.isNew ? (
                      <RemovePlatformButton
                        removeButtonColor={removeButtonColor}
                        guildPlatform={guildPlatform}
                      />
                    ) : (
                      <CloseButton
                        size="sm"
                        color={removeButtonColor}
                        rounded="full"
                        aria-label="Remove platform"
                        zIndex="1"
                        onClick={() => remove(index)}
                      />
                    )
                  }
                  actionRow={PlatformCardSettings && <PlatformCardSettings />}
                  contentRow={
                    CAPACITY_TIME_PLATFORMS.includes(type) && (
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
                    )
                  }
                />
              </RolePlatformProvider>
            )
          })
        )}
      </SimpleGrid>

      <AddRoleRewardModal />
    </Section>
  )
}

const RolePlatformsWrapper = (props: Props): JSX.Element => (
  <AddRewardProvider>
    <RolePlatforms {...props} />
  </AddRewardProvider>
)

export default RolePlatformsWrapper
