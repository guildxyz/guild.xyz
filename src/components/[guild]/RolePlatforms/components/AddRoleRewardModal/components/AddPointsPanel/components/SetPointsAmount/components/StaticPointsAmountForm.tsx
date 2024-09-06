import {
  ButtonGroup,
  FormControl,
  Img,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import Star from "static/icons/star.svg"
import parseFromObject from "utils/parseFromObject"

const StaticPointsAmountForm = ({
  imageUrl,
  baseFieldPath,
}: { imageUrl?: string; baseFieldPath: string }) => {
  const fieldName = `${baseFieldPath}.platformRoleData.score`
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext()
  const amount = useWatch({ control, name: fieldName })

  return (
    <FormControl isInvalid={!!parseFromObject(errors, fieldName)}>
      <Stack direction={{ base: "column", md: "row" }}>
        <NumberInput
          value={amount}
          {...(register(fieldName, {
            required: "This field is required",
          }) as any)}
          // needed for the increment/decrement buttons to work
          onChange={(newValue) => {
            setValue(fieldName, newValue, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }}
        >
          <NumberInputField placeholder="0" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <ButtonGroup flex="1 0 auto" size={{ base: "sm", md: "md" }}>
          <ShortcutButton amount={5} {...{ imageUrl, fieldName }} />
          <ShortcutButton amount={10} {...{ imageUrl, fieldName }} />
          <ShortcutButton amount={50} {...{ imageUrl, fieldName }} />
          <ShortcutButton amount={100} {...{ imageUrl, fieldName }} />
        </ButtonGroup>
      </Stack>
      <FormErrorMessage>
        {parseFromObject(errors, fieldName)?.message as string}
      </FormErrorMessage>
    </FormControl>
  )
}

const ShortcutButton = ({
  amount,
  imageUrl,
  fieldName,
}: { amount: number; imageUrl?: string; fieldName: string }) => {
  const { setValue } = useFormContext()

  return (
    <Button
      w="full"
      leftIcon={
        imageUrl ? (
          <Img src={imageUrl} boxSize="4" borderRadius={"full"} />
        ) : (
          <Star />
        )
      }
      h={{ md: "10" }}
      onClick={() => {
        // Our backend accepts string, so converting the score here
        setValue(fieldName, amount.toString(), {
          shouldValidate: true,
          shouldDirty: true,
        })
      }}
    >
      {amount}
    </Button>
  )
}

export default StaticPointsAmountForm
