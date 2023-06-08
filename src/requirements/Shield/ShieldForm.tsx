import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import TornadoCash from "./components/TornadoCash"

const shieldRequirementTypes = [
  {
    label: "Anomalous transaction patterns",
    value: "SHIELD_ANOM_TX",
  },
  {
    label: "Creation of unverified contracts",
    value: "SHIELD_UNVERIFIED_CONTRACT",
  },
  {
    label: "Interaction with known exploits",
    value: "SHIELD_EXPLOIT_INTERACTION",
  },
  {
    label: "Frequent indirect exchange deposits",
    value: "SHIELD_INDIRECT_DEPOSITS",
  },
  {
    label: "Interactions with Tornado Cash",
    value: "SHIELD_TORNADO_CASH",
    ShieldRequirement: TornadoCash,
  },
]

const ShieldForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const { resetField } = useFormContext()

  useEffect(() => {
    if (typeof field === "undefined")
      resetField(`${baseFieldPath}.isNegated`, {
        defaultValue: true,
      })
  }, [])

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const { errors } = useFormState()

  const selected = shieldRequirementTypes.find((reqType) => reqType.value === type)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={shieldRequirementTypes}
          placeholder="Select type"
          disableOptionFiltering
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.ShieldRequirement && (
        <>
          <Divider />
          <selected.ShieldRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default ShieldForm
