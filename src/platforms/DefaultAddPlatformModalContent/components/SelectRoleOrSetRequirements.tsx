import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import SetRequirements from "components/create-guild/Requirements"
import {
  RolesOrRequirementsTabs,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import useGuild from "components/[guild]/hooks/useGuild"
import RoleSelector from "components/[guild]/RoleSelector"
import platforms, { PlatformUsageRestrictions } from "platforms/platforms"
import { useFormContext } from "react-hook-form"
import { PlatformName } from "types"

type Props = {
  selectedPlatform: PlatformName
  isRoleSelectorDisabled?: boolean
}

const SelectRoleOrSetRequirements = ({ isRoleSelectorDisabled }: Props) => {
  const { roles } = useGuild()
  const { setValue } = useFormContext()
  const { selection, activeTab, setActiveTab } = useAddRewardContext()

  return (
    <Tabs
      size="sm"
      isFitted
      variant="solid"
      colorScheme="indigo"
      index={isRoleSelectorDisabled ? RolesOrRequirementsTabs.NEW_ROLE : activeTab}
      onChange={setActiveTab}
    >
      <TabList mb="8">
        <Tab isDisabled={isRoleSelectorDisabled}>{`Add to existing role${
          platforms[selection].usageRestriction ===
          PlatformUsageRestrictions.MULTIPLE_ROLES
            ? "s"
            : ""
        }`}</Tab>
        <Tab>Create new role (set requirements)</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <RoleSelector
            allowMultiple={
              platforms[selection].usageRestriction ===
              PlatformUsageRestrictions.MULTIPLE_ROLES
            }
            roles={roles}
            onChange={(selectedRoleIds) => setValue("roleIds", selectedRoleIds)}
            size="lg"
          />
        </TabPanel>
        <TabPanel>
          <SetRequirements
            isOptional={activeTab === RolesOrRequirementsTabs.EXISTING_ROLE}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default SelectRoleOrSetRequirements
