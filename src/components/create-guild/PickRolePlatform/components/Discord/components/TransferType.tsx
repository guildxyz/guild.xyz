import {
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import Switch from "components/common/Switch"
import { Info } from "phosphor-react"
import { Controller, useFormContext, useWatch } from "react-hook-form"

const TransferType = (): JSX.Element => {
  const {
    control,
    getValues,
    formState: { errors },
    register,
  } = useFormContext()

  const discordRoleId = useWatch({ control, name: "discordRoleId" })
  const instantTransfer = useWatch({ control, name: "instantTransfer" })

  return (
    <FormControl
      isInvalid={!!errors?.transferDays}
      isDisabled={!discordRoleId || discordRoleId == 0}
    >
      <FormLabel d="flex" alignItems="center">
        <Text as="span" mr="2">
          Role transfer type
        </Text>
        {/* not focusable so it doesn't automatically open on Guard modal open */}
        <Tooltip label="Slow: They have a week to authenticate themselves before losing the access. Instant: Unauthenticated users will lose access">
          <Info />
        </Tooltip>
      </FormLabel>
      <HStack spacing={4}>
        <Switch
          title="Instant"
          {...register("instantTransfer")}
          isDisabled={!discordRoleId || discordRoleId == 0}
          colorScheme="DISCORD"
        />

        <Controller
          name="transferDays"
          control={control}
          rules={{
            required: !getValues("instantTransfer") && "This field is required.",
            min: {
              value: 0,
              message: "Amount must be positive",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              isDisabled={instantTransfer}
              ref={ref}
              value={value}
              onChange={(newValue) => onChange(parseFloat(newValue))}
              onBlur={onBlur}
              min={0}
            >
              <NumberInputField placeholder="Days" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
      </HStack>
      <FormErrorMessage>{errors?.transferDays?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default TransferType
