import { SimpleGrid, Spacer } from "@chakra-ui/react"
import useAddReward from "components/[guild]/AddRewardButton/hooks/useAddReward"
import {
  AddRewardProvider,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import AddRoleRewardModal from "components/[guild]/RolePlatforms/components/AddRoleRewardModal"
import TransitioningPlatformIcons from "components/[guild]/RolePlatforms/components/TransitioningPlatformIcons"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import { usePostHogContext } from "components/_app/PostHogProvider"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Section from "components/common/Section"
import { atom } from "jotai"
import { Plus } from "phosphor-react"
import { AddRewardPanelProps } from "platforms/rewards"
import useUpdateAvailability from "../hooks/useUpdateAvailability"
import useUpdateRolePlatformVisibility from "../hooks/useUpdateRolePlatformVisibility"
import GenericRolePlatformCard from "./GenericRolePlatformCard"

type Props = {
  roleId?: number
}

export const openRewardSettingsGuildPlatformIdAtom = atom(0)

const EditRolePlatforms = ({ roleId }: Props) => {
  const { onOpen } = useAddRewardContext()
  const { id: guildId, mutateGuild } = useGuild()
  const { rolePlatforms } = useRole(guildId, roleId)

  const { captureEvent } = usePostHogContext()

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward({
      onSuccess: (res) => {
        console.log(res)
        captureEvent("reward successfully added to existing guild")
        mutateGuild()
      },
      onError: (err) => {
        captureEvent("reward failed to add to existing guild", {
          error: err,
        })
      },
    })

  const handleAdd = (data: Parameters<AddRewardPanelProps["onAdd"]>[0]) => {
    const { guildPlatform, ...rolePlatform } = data
    const dataToSend = {
      ...guildPlatform,
      rolePlatforms: [
        {
          roleId: roleId,
          platformRoleId: `${roleId}`, // Why a string????
          guildPlatform: guildPlatform,
          ...rolePlatform,
        },
      ],
    }

    onAddRewardSubmit(dataToSend)
  }

  const handleAvailabilityChange = useUpdateAvailability()
  const handleVisibilityChange = useUpdateRolePlatformVisibility()

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
          rolePlatforms.map((rolePlatform, index) => (
            <GenericRolePlatformCard
              key={rolePlatform.id}
              roleId={roleId}
              rolePlatform={rolePlatform}
              index={index}
              onRemove={(rolePlatformId) => () => {}} // TODO
              onAvailabilityChange={(capacity, start, end) =>
                handleAvailabilityChange(rolePlatform, capacity, start, end)
              }
              onVisibilityChange={(visibility, visibilityRoleId) =>
                handleVisibilityChange(rolePlatform, visibility, visibilityRoleId)
              }
            />
          ))
        )}
      </SimpleGrid>

      <AddRoleRewardModal append={handleAdd} />
    </Section>
  )
}

const EditRolePlatformsWrapper = (props: Props): JSX.Element => (
  <AddRewardProvider targetRoleId={props.roleId}>
    <EditRolePlatforms {...props} />
  </AddRewardProvider>
)

export default EditRolePlatformsWrapper
