import {
  FormLabel,
  Icon,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Star } from "phosphor-react"
import { useWatch } from "react-hook-form"
import { PlatformType } from "types"

const StaticAmount = () => {
  const { guildPlatforms } = useGuild()

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const selectedExistingId = useWatch({
    name: "data.guildPlatformId",
  })

  const selectedPointsReward = existingPointsRewards.find(
    (gp) => gp.id === selectedExistingId
  )

  return (
    <>
      <Text colorScheme="gray" mt={-2}>
        Each user can claim the same amount of tokens.
      </Text>

      <Stack gap={0}>
        <FormLabel>Amount to reward</FormLabel>
        <InputGroup>
          <InputLeftElement>
            {selectedPointsReward?.platformGuildData?.imageUrl ? (
              <OptionImage
                img={selectedPointsReward?.platformGuildData?.imageUrl}
                alt={
                  selectedPointsReward?.platformGuildData?.name ?? "Point type image"
                }
              />
            ) : (
              <Icon as={Star} />
            )}
          </InputLeftElement>

          <NumberInput w="full" min={0.0001} step={0.0001} value={1}>
            <NumberInputField pl="10" pr={0} />
            <NumberInputStepper padding={"0 !important"}>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>
      </Stack>
    </>
  )
}

export default StaticAmount
