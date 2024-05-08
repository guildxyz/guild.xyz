import { Circle, FormControl, Icon, useColorModeValue } from "@chakra-ui/react"
import CustomSnapshotForm from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/CustomSnapshotForm"
import { SnapshotOption } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/DynamicAmount"
import GuildPointsSnapshotForm from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/GuildPointsSnapshotForm"
import RadioSelect from "components/common/RadioSelect"
import { Option } from "components/common/RadioSelect/RadioSelect"
import { ListNumbers } from "phosphor-react"
import { useController, useFormContext } from "react-hook-form"
import Star from "static/icons/star.svg"

const DynamicTypeForm = () => {
  const circleBgColor = useColorModeValue("blackAlpha.200", "gray.600")

  const { control, setValue } = useFormContext()

  const { field: snapshotOption } = useController({
    control: control,
    name: "snapshotOption",
  })

  const dynamicOptions: Option[] = [
    {
      value: SnapshotOption.GUILD_POINTS,
      title: "Guild points snapshot",
      description:
        "Calculate rewards based on users' Guild points at a specific time",
      leftComponent: (
        <Circle bg={circleBgColor} p={3}>
          <Icon as={Star} />
        </Circle>
      ),
      children: <GuildPointsSnapshotForm />,
    },
    {
      value: SnapshotOption.CUSTOM,
      title: "Custom snapshot",
      description:
        "Upload a custom snapshot to assign unique numbers to users for reward calculation",
      leftComponent: (
        <Circle bg={circleBgColor} p={3}>
          <Icon as={ListNumbers} />
        </Circle>
      ),
      children: <CustomSnapshotForm />,
    },
  ]

  return (
    <FormControl>
      <RadioSelect
        options={dynamicOptions}
        colorScheme="indigo"
        {...snapshotOption}
        onChange={(val) => {
          snapshotOption.onChange(val)
          if (val === SnapshotOption.CUSTOM) setValue("data.guildPlatformId", null)
        }}
      />
    </FormControl>
  )
}

export default DynamicTypeForm
