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
import { useEffect, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { CreateNftFormType } from "../CreateNftForm"

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
  const [mintLimitType, setMintLimitType] = useState<MintLimitType>("UNLIMITED")

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
      min: mintLimitType === "LIMITED" ? 1 : 0,
      max: !!getValues("maxSupply")
        ? {
            value: getValues("maxSupply"),
            message: "Must be less than or equal to max supply",
          }
        : undefined,
    },
  })

  useEffect(() => {
    mintableAmountPerUserOnChange(mintLimitType === "LIMITED" ? 1 : 0)
  }, [mintableAmountPerUserOnChange, mintLimitType])

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
          onChange={(newSupplyType: MintLimitType) =>
            setMintLimitType(newSupplyType)
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
