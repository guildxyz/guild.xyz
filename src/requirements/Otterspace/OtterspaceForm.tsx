import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

const OtterspaceForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  const { data } = useOtterspaceBadges(chain)

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={["ETHEREUM", "POLYGON", "OPTIMISM", "GOERLI"]}
        onChange={() => resetField(`${baseFieldPath}.data.id`)}
      />

      <FormControl isRequired>
        <FormLabel>Badge:</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.data.id`}
          rules={{ required: "This field is required." }}
          isClearable
          options={data}
          placeholder="Choose badge"
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default OtterspaceForm
