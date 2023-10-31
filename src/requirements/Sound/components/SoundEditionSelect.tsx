import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import { PropsWithChildren } from "react"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  onChange?: (selectedOption: string) => void
}

const options = [
  {
    label: "Forever edition",
    value: 0,
  },
  {
    label: "Limited edition",
    value: 1,
  },
]

const SoundEdition = ({ baseFieldPath }: PropsWithChildren<Props>) => {
  const { errors } = useFormState()

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.tierNumber}
    >
      <FormLabel>Edition:</FormLabel>

      <ControlledSelect
        name={`${baseFieldPath}.data.tierNumber`}
        defaultValue={0}
        options={options}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.tierNumber?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default SoundEdition
