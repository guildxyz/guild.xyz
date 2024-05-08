import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const options = [
  { label: "Intro to DeFi", value: "0x2face815247a997eaa29881c16f75fd83f4df65b" },
  { label: "Intro to NFTs", value: "0xa3b61c077da9da080d22a4ce24f9fd5f139634ca" },
  { label: "Intro to DAOs", value: "0xc9a42690912f6bd134dbc4e2493158b3d72cad21" },
]

const RabbitholeForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  useController({
    name: `${baseFieldPath}.chain`,
    defaultValue: "ETHEREUM",
  })

  useController({
    name: `${baseFieldPath}.data`,
    defaultValue: {},
  })

  return (
    <>
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Skill:</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.address`}
          rules={{ required: "This field is required." }}
          isClearable
          options={options}
          placeholder="Choose..."
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default RabbitholeForm
export { options as rabbitholeCourses }
