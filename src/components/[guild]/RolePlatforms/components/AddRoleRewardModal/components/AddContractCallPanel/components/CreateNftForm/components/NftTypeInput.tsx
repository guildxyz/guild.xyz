import { FormControl, FormLabel } from "@chakra-ui/react"
import SegmentedControl from "components/common/SegmentedControl"
import { useController, useFormContext } from "react-hook-form"
import { CreateNftFormType } from "../CreateNftForm"

const options = [
  {
    label: "Tradable",
    value: "false",
  },
  {
    label: "Non-tradable",
    value: "true",
  },
] satisfies { label: string; value: CreateNftFormType["soulbound"] }[]

const NftTypeInput = () => {
  const { control } = useFormContext<CreateNftFormType>()
  const { field: soulboundField } = useController({
    control,
    name: "soulbound",
    defaultValue: "false",
  })

  return (
    <FormControl>
      <FormLabel>Type</FormLabel>
      <SegmentedControl options={options} {...soulboundField} />
    </FormControl>
  )
}

export default NftTypeInput
