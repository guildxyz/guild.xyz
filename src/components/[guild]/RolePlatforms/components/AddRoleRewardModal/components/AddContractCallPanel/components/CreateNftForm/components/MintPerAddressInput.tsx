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
    label: "Custom amount",
    value: "LIMITED",
  },
] satisfies { label: string; value: MintLimitType }[]

const MintPerAddressInput = () => {
  const [mintLimitType, setMintLimitType] = useState<MintLimitType>("UNLIMITED")

  const {
    control,
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
    },
  })

  useEffect(() => {
    mintableAmountPerUserOnChange(mintLimitType === "LIMITED" ? 1 : 0)
  }, [mintableAmountPerUserOnChange, mintLimitType])

  return (
    <Grid templateColumns="repeat(3, 1fr)" columnGap={4} rowGap={2}>
      <GridItem as={FormControl} colSpan={{ base: 3, md: 2 }}>
        <FormLabel>Claiming per address</FormLabel>
        <SegmentedControl
          options={options}
          onChange={(newSupplyType: MintLimitType) =>
            setMintLimitType(newSupplyType)
          }
        />
      </GridItem>

      <GridItem
        as={FormControl}
        colSpan={{ base: 3, md: 1 }}
        isInvalid={!!errors.mintableAmountPerUser}
        isDisabled={mintLimitType === "UNLIMITED"}
      >
        <FormLabel>Max</FormLabel>
        <NumberInput
          {...mintableAmountPerUserField}
          onChange={mintableAmountPerUserOnChange}
          min={mintLimitType === "LIMITED" ? 1 : 0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </GridItem>
    </Grid>
  )
}

export default MintPerAddressInput
