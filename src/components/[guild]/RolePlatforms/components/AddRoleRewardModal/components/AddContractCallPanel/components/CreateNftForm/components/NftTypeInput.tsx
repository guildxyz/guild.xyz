import { FormControl, FormLabel } from "@chakra-ui/react"
import SegmentedControl from "components/common/SegmentedControl"
import { useController, useFormContext } from "react-hook-form"
import { CreateNftFormType } from "./NftDataForm"

const options = [
  {
    label: "Non-transferable",
    value: "true",
  },
  {
    label: "Transferable",
    value: "false",
  },
] satisfies { label: string; value: CreateNftFormType["soulbound"] }[]

const NftTypeInput = () => {
  const { control } = useFormContext<CreateNftFormType>()
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    field: { ref: _ref, ...soulboundField },
  } = useController({
    control,
    name: "soulbound",
    defaultValue: "false",
  })

  return (
    <FormControl>
      <FormLabel>Availability</FormLabel>
      <SegmentedControl options={options} {...soulboundField} />
    </FormControl>
  )
}

export default NftTypeInput
