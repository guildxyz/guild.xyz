import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import Hold from "./components/Hold"
import HoldCollection from "./components/HoldCollection"
import HoldState from "./components/HoldState"
import Listings from "./components/Listings"

export const vaultStateOptions = [
  { label: "Distribution", value: "distribution" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Reconstitution", value: "reconstitution" },
  { label: "Closed", value: "closed" },
]

const tesseraRequirementTypes = [
  {
    label: "Own Raes of a Vault",
    value: "TESSERA_HOLD",
    TesseraRequirement: Hold,
  },
  {
    label: "Own Raes from a collection",
    value: "TESSERA_HOLD_COLLECTION",
    TesseraRequirement: HoldCollection,
  },
  {
    label: "Own Raes with Specific Vault Phase",
    value: "TESSERA_HOLD_STATE",
    TesseraRequirement: HoldState,
  },
  {
    label: "Have Raes listed",
    value: "TESSERA_LISTINGS",
    TesseraRequirement: Listings,
  },
]

const TesseraForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    resetField,
    formState: { errors, touchedFields },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const selected = tesseraRequirementTypes.find((reqType) => reqType.value === type)

  useEffect(() => {
    if (!touchedFields?.data) return
    resetField(`${baseFieldPath}.data.vault`)
    resetField(`${baseFieldPath}.data.minAmount`)
    resetField(`${baseFieldPath}.data.vaultState`)
    resetField(`${baseFieldPath}.data.minDate`)
  }, [type])

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={tesseraRequirementTypes}
          placeholder="Select type"
          disableOptionFiltering
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.TesseraRequirement && (
        <>
          <Divider />
          <selected.TesseraRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default TesseraForm
