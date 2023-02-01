import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Chains, RPC } from "connectors"
import { useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import use101Courses from "./hooks/use101Courses"

const HundredNOneForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const { data, isValidating } = use101Courses()

  const options = data?.map((badge) => ({
    value: badge.onChainId.toString(),
    label: badge.courses[0]?.title,
    img: badge.courses[0]?.creator.image,
    details: RPC[Chains[badge.contract.chainId]].chainName,
    chainId: badge.contract.chainId,
  }))

  return (
    <>
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Course:</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.data.id`}
          rules={{ required: "This field is required." }}
          isClearable
          placeholder="Choose course"
          isLoading={!data && isValidating}
          options={options}
          afterOnChange={(newValue) =>
            setValue(`${baseFieldPath}.chain`, Chains[newValue.chainId])
          }
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default HundredNOneForm
