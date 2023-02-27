import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
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
  const { setValue } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  /**
   * Temporary, will use ChainPicker when we add it to the supported chains (and the
   * other option will be POLYGON mainnet once PolygonID is available there too)
   */
  useEffect(() => {
    setValue(`${baseFieldPath}.chain`, "POLYGON_MUMBAI")
  }, [])

  const selected = polygonIdRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={polygonIdRequirementTypes}
          afterOnChange={() => setValue(`${baseFieldPath}.data`, "")}
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
