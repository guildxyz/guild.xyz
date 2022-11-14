import {
  FormControl,
  FormLabel,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect, useState } from "react"
import { useController, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

type MemberSinceFormat = "DAY" | "MONTH" | "YEAR"

const dayInMs = 86400000

const multipliers = {
  DAY: dayInMs,
  MONTH: dayInMs * 30,
  YEAR: dayInMs * 365,
}

const DiscordJoinFromNow = ({ baseFieldPath }: Props): JSX.Element => {
  const { touchedFields, errors } = useFormState()

  const [memberSinceFormat, setMemberSinceFormat] = useState<
    "DAY" | "MONTH" | "YEAR"
  >("DAY")

  const { field: memberSinceField } = useController({
    name: `${baseFieldPath}.data.memberSince`,
    defaultValue: dayInMs,
  })

  useEffect(() => {
    if (!touchedFields.data) return
    memberSinceField.onChange(multipliers[memberSinceFormat])
  }, [memberSinceFormat])

  return (
    <Stack w="full">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath).data?.memberSince}
      >
        <FormLabel>Minimum account age</FormLabel>

        <InputGroup>
          <NumberInput
            min={0}
            sx={{
              "> input": {
                borderRightRadius: 0,
              },
              "div div:first-of-type": {
                borderTopRightRadius: 0,
              },
              "div div:last-of-type": {
                borderBottomRightRadius: 0,
              },
            }}
            value={
              typeof memberSinceField.value === "number"
                ? memberSinceField.value / multipliers[memberSinceFormat]
                : ""
            }
            onChange={(_, newValue) =>
              memberSinceField.onChange(
                typeof newValue === "number"
                  ? newValue * multipliers[memberSinceFormat]
                  : ""
              )
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Select
            borderLeftRadius={0}
            maxW={32}
            value={memberSinceFormat}
            onChange={(e) =>
              setMemberSinceFormat(e.target.value as MemberSinceFormat)
            }
          >
            <option value="DAY">Day</option>
            <option value="MONTH">Month</option>
            <option value="YEAR">Year</option>
          </Select>
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.memberSince?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default DiscordJoinFromNow
