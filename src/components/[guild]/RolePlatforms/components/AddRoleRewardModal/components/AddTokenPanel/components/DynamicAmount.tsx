import { Stack, Text } from "@chakra-ui/react"
import DynamicTypeForm from "platforms/Token/DynamicTypeForm"
import ConversionInput from "./ConversionInput"

export enum SnapshotOption {
  GUILD_POINTS = "GUILD_POINTS",
  CUSTOM = "CUSTOM",
}

const DynamicAmount = () => (
  <>
    <Text colorScheme="gray">
      Claimable amount is dynamic based on a snapshot containing each eligible user
      paired with a number.
    </Text>

    <DynamicTypeForm />

    <Stack gap={0}>
      <ConversionInput />
    </Stack>
  </>
)

export default DynamicAmount
