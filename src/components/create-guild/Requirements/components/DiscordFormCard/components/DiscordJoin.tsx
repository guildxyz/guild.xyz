import {
  Checkbox,
  FormControl,
  FormLabel,
  Input,
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
import LogicDivider from "components/[guild]/LogicDivider"
import { useEffect, useState } from "react"
import { useController, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
}

type MemberSinceFormat = "DAY" | "MONTH" | "YEAR"

const dayInMs = 86400000
const defaultDate = Date.now() - dayInMs

const multipliers = {
  DAY: dayInMs,
  MONTH: dayInMs * 30,
  YEAR: dayInMs * 365,
}

const DiscordJoin = ({ baseFieldPath }: Props): JSX.Element => {
  const { touchedFields, errors } = useFormState()

  const { field: fromNowField } = useController({
    name: `${baseFieldPath}.data.fromNow`,
    defaultValue: false,
  })

  const [memberSinceFormat, setMemberSinceFormat] = useState<
    "DAY" | "MONTH" | "YEAR"
  >("DAY")

  const { field: memberSinceField } = useController({
    name: `${baseFieldPath}.data.memberSince`,
    defaultValue: defaultDate,
  })

  useEffect(() => {
    if (!touchedFields.data) return
    memberSinceField.onChange(multipliers[memberSinceFormat])
  }, [memberSinceFormat])

  return (
    <Stack w="full">
      <FormControl
        isDisabled={fromNowField.value}
        isInvalid={!fromNowField.value && typeof memberSinceField.value !== "number"}
      >
        <FormLabel>Member since</FormLabel>

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
              !fromNowField.value && typeof memberSinceField.value === "number"
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
          {!fromNowField.value &&
            typeof memberSinceField.value !== "number" &&
            "This field is required."}
        </FormErrorMessage>
      </FormControl>

      <LogicDivider logic="OR" />

      <Checkbox
        ref={fromNowField.ref}
        name={fromNowField.name}
        onChange={(e) => {
          const checked = e.target.checked
          memberSinceField.onChange(
            checked ? defaultDate : multipliers[memberSinceFormat]
          )
          fromNowField.onChange(checked)
        }}
        onBlur={fromNowField.onBlur}
        checked={!fromNowField.value}
        colorScheme="primary"
      >
        Define a specific date
      </Checkbox>

      <FormControl
        isDisabled={!fromNowField.value}
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.memberSince}
      >
        <FormLabel>Joined server before</FormLabel>

        <Input
          type="date"
          ref={memberSinceField.ref}
          name={memberSinceField.name}
          value={
            fromNowField.value &&
            (memberSinceField.value
              ? new Date(memberSinceField.value).toISOString().split("T")[0]
              : "")
          }
          onChange={(e) => {
            const valueAsTimestamp = new Date(e.target.value).getTime()
            memberSinceField.onChange(valueAsTimestamp)
          }}
          onBlur={memberSinceField.onBlur}
          max={new Date().toISOString().split("T")[0]}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.memberSince?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default DiscordJoin
