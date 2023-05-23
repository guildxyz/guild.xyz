import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"
import PolygonIdBasic from "./components/PolygonIdBasic"
import PolygonIdQuery from "./components/PolygonIdQuery"

const polygonIdRequirementTypes = [
  {
    label: "Authenticate with PolygonID",
    value: "POLYGON_ID_BASIC",
    PolygonIdRequirement: PolygonIdBasic,
  },
  {
    label: "Satisfy query",
    value: "POLYGON_ID_QUERY",
    PolygonIdRequirement: PolygonIdQuery,
  },
]

const PolygonIdForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()
  const { resetField } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = polygonIdRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.maxAmount`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.query`, { defaultValue: "" })
  }

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain`}
        supportedChains={["POLYGON", "POLYGON_MUMBAI"]}
        onChange={resetFields}
      />
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={polygonIdRequirementTypes}
          beforeOnChange={resetFields}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.PolygonIdRequirement && (
        <>
          <Divider />
          <selected.PolygonIdRequirement
            baseFieldPath={baseFieldPath}
            field={field}
          />
        </>
      )}
    </Stack>
  )
}

export default PolygonIdForm
