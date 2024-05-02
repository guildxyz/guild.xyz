import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"
import PolygonIDBasic from "./components/PolygonIDBasic"
import PolygonIDQuery from "./components/PolygonIDQuery"

const polygonIDRequirementTypes = [
  {
    label: "Authenticate with PolygonID",
    value: "POLYGON_ID_BASIC",
    PolygonIDRequirement: PolygonIDBasic,
  },
  {
    label: "Satisfy query",
    value: "POLYGON_ID_QUERY",
    PolygonIDRequirement: PolygonIDQuery,
  },
]

const PolygonIDForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const isEditMode = !!field?.id

  const selected = polygonIDRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  const resetFields = () => {
    setValue(`${baseFieldPath}.data.maxAmount`, undefined, {
      shouldValidate: true,
    })
    setValue(`${baseFieldPath}.data.query`, "", {
      shouldValidate: true,
    })
  }

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain`}
        supportedChains={["POLYGON"]}
        onChange={resetFields}
      />
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={polygonIDRequirementTypes}
          beforeOnChange={resetFields}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.PolygonIDRequirement && (
        <>
          <Divider />
          <selected.PolygonIDRequirement
            baseFieldPath={baseFieldPath}
            field={field}
          />
        </>
      )}
    </Stack>
  )
}

export default PolygonIDForm
