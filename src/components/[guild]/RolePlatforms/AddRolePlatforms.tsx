import { SimpleGrid, Spacer } from "@chakra-ui/react"
import TransitioningPlatformIcons from "components/[guild]/RolePlatforms/components/TransitioningPlatformIcons"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Section from "components/common/Section"
import { atom } from "jotai"
import { Plus } from "phosphor-react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { RoleFormType, RolePlatform } from "types"
import NewRolePlatformCard from "../AddAndOrderRoles/components/NewRolePlatformCard"
import { AddRewardProvider, useAddRewardContext } from "../AddRewardContext"
import AddRoleRewardModal from "./components/AddRoleRewardModal"

export const openRewardSettingsGuildPlatformIdAtom = atom(0)

const AddRolePlatforms = () => {
  const { onOpen } = useAddRewardContext()

  const { watch } = useFormContext<RoleFormType>()

  const { fields, append } = useFieldArray<RoleFormType, "rolePlatforms", "fieldId">(
    {
      name: "rolePlatforms",
      keyName: "fieldId",
    }
  )
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
            <NewRolePlatformCard
              key={rolePlatform.fieldId}
              rolePlatform={{ ...rolePlatform, id: index } as RolePlatform}
            />
          ))
        )}
      </SimpleGrid>

      <AddRoleRewardModal
        addWithNewGuildPlatform={append}
        addWithExistingGuildPlatform={append}
      />
    </Section>
  )
}

const AddRolePlatformsWrapper = (): JSX.Element => (
  <AddRewardProvider>
    <AddRolePlatforms />
  </AddRewardProvider>
)

export default AddRolePlatformsWrapper
