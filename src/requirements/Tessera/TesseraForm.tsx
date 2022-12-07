import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import Hold from "./components/Hold"
import Listings from "./components/Listings"
import UserSince from "./components/UserSince"
import Vaultshare from "./components/Vaultshare"

const tesseraRequirementTypes = [
  {
    label: "Hold fractions of an NFT",
    value: "TESSERA_HOLD",
    TesseraRequirement: Hold,
  },
  {
    label: "Hold percentage of an NFT",
    value: "TESSERA_VAULTSHARE",
    TesseraRequirement: Vaultshare,
  },
  {
    label: "List NFTs",
    value: "TESSERA_LISTINGS",
    TesseraRequirement: Listings,
  },
  {
    label: "Signed the ToS before",
    value: "TESSERA_USER_SINCE",
    TesseraRequirement: UserSince,
  },
]

const TesseraForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const {
    resetField,
    formState: { errors, touchedFields },
  } = useFormContext()

  const selected = tesseraRequirementTypes.find((reqType) => reqType.value === value)

  useEffect(() => {
    if (!touchedFields?.data) return
    resetField(`${baseFieldPath}.data.vault`)
    resetField(`${baseFieldPath}.data.minAmount`)
    resetField(`${baseFieldPath}.data.minShare`)
    resetField(`${baseFieldPath}.data.minVaultShare`)
    resetField(`${baseFieldPath}.data.minDate`)
  }, [value])

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={tesseraRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
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
