import { FormControl, FormLabel, Icon, Text, Tooltip } from "@chakra-ui/react"
import SegmentedControl from "components/common/SegmentedControl"
import { Question } from "phosphor-react"
import { useController, useFormContext } from "react-hook-form"
import { CreateNftFormType } from "./NftDataForm"

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
      <FormLabel>
        <Text as="span">Type</Text>
        <Tooltip
          label="A non-tradable NFT can't be transferred or sold to another wallet"
          placement="top"
          hasArrow
        >
          <Icon
            as={Question}
            color="GrayText"
            position="relative"
            left={1}
            top={0.5}
          />
        </Tooltip>
      </FormLabel>
      <SegmentedControl options={options} {...soulboundField} />
    </FormControl>
  )
}

export default NftTypeInput
