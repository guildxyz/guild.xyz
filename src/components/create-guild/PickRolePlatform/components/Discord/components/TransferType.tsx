import {
  FormControl,
  FormLabel,
  HStack,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Info } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"

const TransferType = (): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors },
    register,
  } = useFormContext()

  const discordRoleId = useWatch({ control, name: "discordRoleId" })
  const transferType = useWatch({ control, name: "transferType" })

  const daysInputDisabled = useMemo(
    () => !discordRoleId || discordRoleId == 0 || transferType != 1,
    [discordRoleId, transferType]
  )

  useEffect(() => {
    if (discordRoleId && discordRoleId != 0) {
      if (typeof discordRoleId === "undefined") return
      if (transferType == 0) setValue("transferDays", undefined)
      else if (transferType == 1) setValue("transferDays", 7)
      else if (transferType == 2) setValue("transferDays", 0)
      return
    }

    setValue("transferDays", undefined)
  }, [discordRoleId, transferType])

  return (
    <FormControl
      isInvalid={!!errors?.transferDays}
      isDisabled={!discordRoleId || discordRoleId == 0}
    >
      <FormLabel d="flex" alignItems="center">
        <Text as="span" mr="2">
          How to authenticate users?
        </Text>
        {/* not focusable so it doesn't automatically open on Guard modal open */}
        <Tooltip label="Slow: They have a week to authenticate themselves before losing the access. Instant: Unauthenticated users will lose access">
          <Info />
        </Tooltip>
      </FormLabel>
      <HStack alignItems="start" spacing={4}>
        <Select
          isInvalid={false}
          isDisabled={!discordRoleId || discordRoleId == 0}
          {...register("transferType")}
        >
          <option value={0} defaultChecked>
            None
          </option>
          <option value={1}>Slow</option>
          <option value={2}>Instant</option>
        </Select>

        <Stack>
          <Controller
            name="transferDays"
            control={control}
            rules={{
              required: transferType == 1 && "This field is required.",
              min: {
                value: 0,
                message: "Amount must be positive",
              },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <InputGroup>
                <NumberInput
                  isDisabled={daysInputDisabled}
                  ref={ref}
                  value={value}
                  onChange={(newValue) => {
                    const parsedValue = parseFloat(newValue)
                    onChange(isNaN(parsedValue) ? "" : parsedValue)
                  }}
                  onBlur={onBlur}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <InputRightAddon opacity={daysInputDisabled ? 0.5 : 1}>
                  days
                </InputRightAddon>
              </InputGroup>
            )}
          />
          <FormErrorMessage>{errors?.transferDays?.message}</FormErrorMessage>
        </Stack>
      </HStack>
    </FormControl>
  )
}

export default TransferType
