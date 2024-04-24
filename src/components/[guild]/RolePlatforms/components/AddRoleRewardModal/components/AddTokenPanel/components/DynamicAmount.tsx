import {
  Circle,
  FormControl,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import RadioSelect from "components/common/RadioSelect"
import { Option } from "components/common/RadioSelect/RadioSelect"
import { ListNumbers } from "phosphor-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import Star from "static/icons/star.svg"
import ConversionInput from "./ConversionInput"
import CustomSnapshotForm from "./CustomSnapshotForm"
import GuildPointsSnapshotForm from "./GuildPointsSnapshotForm"

export enum SnapshotOption {
  GUILD_POINTS = "GUILD_POINTS",
  CUSTOM = "CUSTOM",
}

const DynamicAmount = () => {
  const { setValue } = useFormContext()

  const circleBgColor = useColorModeValue("blackAlpha.200", "gray.600")
  const [snapshotOption, setSnapshotOption] = useState(SnapshotOption.GUILD_POINTS)

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
    <>
      <Text colorScheme="gray">
        Claimable amount is dynamic based on a snapshot containing each eligible user
        paired with a number.
      </Text>

      <FormControl>
        <RadioSelect
          options={dynamicOptions}
          colorScheme="primary"
          onChange={(val) => {
            setSnapshotOption(SnapshotOption[val])
            if (val === SnapshotOption.CUSTOM) setValue("data.guildPlatformId", null)
          }}
          value={snapshotOption.toString()}
        />
      </FormControl>

      <Stack gap={0}>
        <ConversionInput />
      </Stack>
    </>
  )
}

export default DynamicAmount
