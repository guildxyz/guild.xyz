import { Tab, TabList, TabPanel, TabPanels, TabProps, Tabs } from "@chakra-ui/react"
import {
  RolesOrRequirementsTabs,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import RoleSelector from "components/[guild]/RoleSelector"
import useGuild from "components/[guild]/hooks/useGuild"
import SetRequirements from "components/create-guild/Requirements"
import platforms, { PlatformAsRewardRestrictions } from "platforms/platforms"
import { useFormContext } from "react-hook-form"
import { PlatformName } from "types"

type Props = {
  selectedPlatform: PlatformName
  isRoleSelectorDisabled?: boolean
}

const TAB_STYLE_PROPS: TabProps = {
  noOfLines: 1,
  whiteSpace: "nowrap",
  display: "block",
}

const SelectRoleOrSetRequirements = ({ isRoleSelectorDisabled }: Props) => {
  const { roles } = useGuild()
  const { setValue } = useFormContext()
  const { selection, activeTab, setActiveTab } = useAddRewardContext()

  return (
    <Tabs
      isLazy
      lazyBehavior="keepMounted"
      size="sm"
      isFitted
      variant="solid"
      colorScheme="indigo"
      index={isRoleSelectorDisabled ? RolesOrRequirementsTabs.NEW_ROLE : activeTab}
      onChange={setActiveTab}
    >
      <TabList mb="8">
        <Tab
          {...TAB_STYLE_PROPS}
          isDisabled={isRoleSelectorDisabled}
        >{`Add to existing role${
          platforms[selection].asRewardRestriction ===
          PlatformAsRewardRestrictions.MULTIPLE_ROLES
            ? "s"
            : ""
        }`}</Tab>
        <Tab {...TAB_STYLE_PROPS}>Create new role (set requirements)</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <RoleSelector
            allowMultiple={
              platforms[selection].asRewardRestriction ===
              PlatformAsRewardRestrictions.MULTIPLE_ROLES
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
