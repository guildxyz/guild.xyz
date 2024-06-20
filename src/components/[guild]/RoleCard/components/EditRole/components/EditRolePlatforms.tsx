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
import useAddRolePlatform from "../hooks/useAddRolePlatform"
import ExistingRolePlatformCard from "./ExistingRolePlatformCard"

type Props = {
  roleId?: number
}

export const openRewardSettingsGuildPlatformIdAtom = atom(0)

const EditRolePlatforms = ({ roleId }: Props) => {
  const { onOpen } = useAddRewardContext()
  const { id: guildId } = useGuild()
  const { rolePlatforms } = useRole(guildId, roleId)

  const {
    onSubmit: handleAddWithExistingGuildPlatform,
    isLoading: addWithExistingIsLoading,
  } = useAddRolePlatform(roleId)

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
            <ExistingRolePlatformCard
              key={rolePlatform.id}
              rolePlatform={{ ...rolePlatform }}
            />
          ))
        )}

        <Collapse in={addWithExistingIsLoading}>
          <Skeleton rounded={"2xl"} minH={28} w="full" h={28}></Skeleton>
        </Collapse>
      </SimpleGrid>

      <AddRoleRewardModal onAdd={handleAddWithExistingGuildPlatform} />
    </Section>
  )
}

const EditRolePlatformsWrapper = (props: Props): JSX.Element => (
  <AddRewardProvider targetRoleId={props.roleId}>
    <EditRolePlatforms {...props} />
  </AddRewardProvider>
)

export default EditRolePlatformsWrapper
