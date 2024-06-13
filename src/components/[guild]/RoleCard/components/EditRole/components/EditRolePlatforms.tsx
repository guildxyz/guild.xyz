import { Collapse, SimpleGrid, Skeleton, Spacer } from "@chakra-ui/react"
import useAddReward from "components/[guild]/AddRewardButton/hooks/useAddReward"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import AddRoleRewardModal from "components/[guild]/RolePlatforms/components/AddRoleRewardModal"
import TransitioningPlatformIcons from "components/[guild]/RolePlatforms/components/TransitioningPlatformIcons"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Section from "components/common/Section"
import { atom } from "jotai"
import { Plus } from "phosphor-react"
import { AddRewardPanelProps } from "platforms/rewards"
import { RolePlatform } from "types"
import useAddRewardWithExistingGP from "../hooks/useAddRewardWithExistingGP"
import useRemoveReward from "../hooks/useRemoveReward"
import useUpdateAvailability from "../hooks/useUpdateAvailability"
import useUpdateRolePlatformVisibility from "../hooks/useUpdateRolePlatformVisibility"
import GenericRolePlatformCard from "./GenericRolePlatformCard"

type Props = {
  roleId?: number
}

export const openRewardSettingsGuildPlatformIdAtom = atom(0)

const EditRolePlatforms = ({ roleId }: Props) => {
  const { onOpen } = useAddRewardContext()
  const { id: guildId } = useGuild()
  const { rolePlatforms } = useRole(guildId, roleId)

  const { onSubmit: submitAdd, isLoading: addIsLoading } = useAddReward({
    onSuccess: () => {},
    onError: () => {},
  })

  const {
    onSubmit: handleAddWithExistingGuildPlatform,
    isLoading: addWithExistingIsLoading,
  } = useAddRewardWithExistingGP()

  const { onSubmit: handleAvailabilityChange, isLoading: availabilityIsLoading } =
    useUpdateAvailability()

  const { onSubmit: handleVisibilityChange, isLoading: visibilityIsLoading } =
    useUpdateRolePlatformVisibility()

  const { onSubmit: handleRemove, isLoading: removeIsLoading } = useRemoveReward()

  const handleAdd = (
    roleId_: number,
    data: Parameters<AddRewardPanelProps["onAdd"]>[0]
  ) => {
    const { guildPlatform, ...rolePlatform } = data
    const dataToSend = {
      ...guildPlatform,
      rolePlatforms: [
        {
          roleId: roleId_,
          platformRoleId: `${roleId_}`, // Why a string????
          guildPlatform: guildPlatform,
          ...rolePlatform,
        },
      ],
    }
    submitAdd(dataToSend)
  }

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
        {!rolePlatforms || rolePlatforms?.length <= 0 ? (
          <AddCard title="Add reward" onClick={onOpen} />
        ) : (
          rolePlatforms.map((rolePlatform) => (
            <GenericRolePlatformCard
              key={rolePlatform.id}
              rolePlatform={rolePlatform}
              handlers={{
                onRemove: handleRemove,
                onAvailabilityChange: (rp, capacity, startTime, endTime) =>
                  handleAvailabilityChange({
                    rolePlatform: rp,
                    capacity,
                    startTime,
                    endTime,
                  }),
                onVisibilityChange: (rp, visibility, visibilityRoleId) =>
                  handleVisibilityChange({
                    rolePlatform: rp,
                    visibility,
                    visibilityRoleId,
                  }),
              }}
              loadingStates={{
                isRemoving: removeIsLoading,
                isUpdating: availabilityIsLoading || visibilityIsLoading,
              }}
            />
          ))
        )}

        <Collapse in={addIsLoading || addWithExistingIsLoading}>
          <Skeleton rounded={"2xl"} minH={28} w="full" h={28}></Skeleton>
        </Collapse>
      </SimpleGrid>

      <AddRoleRewardModal
        addWithNewGuildPlatform={(data) => handleAdd(roleId, data)}
        addWithExistingGuildPlatform={(data) =>
          handleAddWithExistingGuildPlatform(data as RolePlatform)
        }
      />
    </Section>
  )
}

const EditRolePlatformsWrapper = (props: Props): JSX.Element => (
  <AddRewardProvider targetRoleId={props.roleId}>
    <EditRolePlatforms {...props} />
  </AddRewardProvider>
)

export default EditRolePlatformsWrapper
