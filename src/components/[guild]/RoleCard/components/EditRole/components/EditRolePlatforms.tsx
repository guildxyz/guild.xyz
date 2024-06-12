import { Collapse, SimpleGrid, Skeleton, Spacer } from "@chakra-ui/react"
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
import useAddRewardAndMutate from "../hooks/useAddRewardAndMutate"
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

  const { handleAdd, isLoading: addIsLoading } = useAddRewardAndMutate()
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

        <Collapse in={addIsLoading}>
          <Skeleton rounded={"2xl"} minH={28} w="full" h={28}></Skeleton>
        </Collapse>
      </SimpleGrid>

      <AddRoleRewardModal append={(data) => handleAdd(roleId, data)} />
    </Section>
  )
}

const EditRolePlatformsWrapper = (props: Props): JSX.Element => (
  <AddRewardProvider targetRoleId={props.roleId}>
    <EditRolePlatforms {...props} />
  </AddRewardProvider>
)

export default EditRolePlatformsWrapper
