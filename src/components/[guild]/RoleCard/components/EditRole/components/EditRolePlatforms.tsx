import { Box, Collapse, Spacer, Spinner, Stack, Tag } from "@chakra-ui/react"
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
      <Stack spacing={{ base: 3 }}>
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
        <Box margin={"0 auto"}>
          <Collapse in={addWithExistingIsLoading}>
            <Tag
              size="lg"
              margin={"0 auto"}
              pr={5}
              my={6}
              colorScheme="blue"
              borderRadius="full"
              width={"fit-content"}
            >
              <Spinner size={"sm"} mr={2} />
              Adding reward...
            </Tag>
          </Collapse>
        </Box>
      </Stack>

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
