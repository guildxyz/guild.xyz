import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
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
  const badgeId = useWatch({ name: `${baseFieldPath}.data.id` })

  const { data } = useOtterspaceBadges(chain)

  const pickedBadge = data?.find((option) => option.value === badgeId)

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={["OPTIMISM", "GOERLI"]}
        onChange={() => resetField(`${baseFieldPath}.data.id`)}
      />

      <FormControl isRequired>
        <FormLabel>Badge:</FormLabel>

        <InputGroup>
          {pickedBadge && (
            <InputLeftElement>
              <OptionImage
                img={pickedBadge?.img as string}
                alt={pickedBadge?.label}
              />
            </InputLeftElement>
          )}

          <ControlledSelect
            name={`${baseFieldPath}.data.id`}
            rules={{ required: "This field is required." }}
            isClearable
            options={data}
            placeholder="Choose badge"
          />
        </InputGroup>

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default OtterspaceForm
