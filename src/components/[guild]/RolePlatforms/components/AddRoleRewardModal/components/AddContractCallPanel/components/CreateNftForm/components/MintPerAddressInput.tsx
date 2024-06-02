import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import SegmentedControl from "components/common/SegmentedControl"
import { useController, useFormContext } from "react-hook-form"
import { CreateNftFormType } from "./NftDataForm"

type MintLimitType = "LIMITED" | "UNLIMITED"
const options = [
  {
    label: "Unlimited",
    value: "UNLIMITED",
  },
  {
    label: "Limited",
    value: "LIMITED",
  },
] satisfies { label: string; value: MintLimitType }[]

const MintPerAddressInput = () => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<CreateNftFormType>()
  const {
    field: {
      onChange: mintableAmountPerUserOnChange,
      ...mintableAmountPerUserField
    },
  } = useController({
    control,
    name: "mintableAmountPerUser",
    defaultValue: 1,
    rules: {
      min: 0,
      max: !!getValues("maxSupply")
        ? {
            value: getValues("maxSupply"),
            message: "Must be less than or equal to max supply",
          }
        : undefined,
    },
  })

  const mintLimitType: MintLimitType =
    mintableAmountPerUserField.value > 0 ? "LIMITED" : "UNLIMITED"

  return (
    <FormControl
      as={Grid}
      isInvalid={!!errors.mintableAmountPerUser}
      isDisabled={mintLimitType === "UNLIMITED"}
      templateColumns="repeat(3, 1fr)"
      columnGap={4}
      rowGap={2}
    >
      <GridItem as={FormControl} colSpan={{ base: 3, md: 2 }}>
        <FormLabel>Claiming per address</FormLabel>
        <SegmentedControl
          options={options}
          value={mintLimitType}
          onChange={(newSupplyType: MintLimitType) =>
            mintableAmountPerUserOnChange(newSupplyType === "LIMITED" ? 1 : 0)
          }
        />
      </GridItem>

      <GridItem colSpan={{ base: 3, md: 1 }}>
        <FormLabel>Max</FormLabel>
        <NumberInput
          {...mintableAmountPerUserField}
          onChange={mintableAmountPerUserOnChange}
          min={mintLimitType === "LIMITED" ? 1 : 0}
          max={getValues("maxSupply") || undefined}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </GridItem>

      <GridItem colSpan={3}>
        <FormErrorMessage>{errors.mintableAmountPerUser?.message}</FormErrorMessage>
      </GridItem>
    </FormControl>
  )
}

export default MintPerAddressInput
