import {
  Circle,
  FormControl,
  FormLabel,
  Img,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import { countryCodes } from "./countryCodes"

const VERIFICATIONS_COINBASE_ETH = "0x357458739F90461b99789350868CD7CF330Dd7EE"
export const EAS_CB_VERIFIED_ACCOUNT_SCHEMA_ID =
  "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
export const EAS_CB_VERIFIED_COUNTRY_SCHEMA_ID =
  "0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065"

const options: SelectOption[] = [
  {
    label: "Verified Account",
    value: EAS_CB_VERIFIED_ACCOUNT_SCHEMA_ID,
  },
  {
    label: "Verified Country",
    value: EAS_CB_VERIFIED_COUNTRY_SCHEMA_ID,
  },
]

const CoinbaseEASForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const selectOptionImgBgColor = useColorModeValue(
    "blackAlpha.100",
    "blackAlpha.300"
  )

  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  useController({
    name: `${baseFieldPath}.chain`,
    defaultValue: "BASE_MAINNET",
  })

  useController({
    name: `${baseFieldPath}.data.attester`,
    defaultValue: VERIFICATIONS_COINBASE_ETH,
  })

  const schemaId = useWatch({ name: `${baseFieldPath}.data.schemaId` })

  const countryOptions: SelectOption[] = countryCodes.map(({ name, alpha2 }) => ({
    label: name,
    value: alpha2,
    img: (
      <Circle size={5} bgColor={selectOptionImgBgColor}>
        <Img
          w={3}
          src={`https://flagcdn.com/40x30/${alpha2.toLowerCase()}.webp`}
          alt={name}
        />
      </Circle>
    ),
  }))

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.data.schemaId`}
          rules={{ required: "It's required to select a schema" }}
          options={options}
          afterOnChange={(newSchemaId) => {
            if (newSchemaId.value === EAS_CB_VERIFIED_COUNTRY_SCHEMA_ID) {
              setValue(`${baseFieldPath}.data.key`, "verifiedCountry")
            } else {
              setValue(`${baseFieldPath}.data.key`, undefined)
            }

            setValue(`${baseFieldPath}.data.val`, undefined)
          }}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {schemaId === EAS_CB_VERIFIED_COUNTRY_SCHEMA_ID && (
        <FormControl>
          <FormLabel>Country</FormLabel>

          <ControlledSelect
            name={`${baseFieldPath}.data.val`}
            options={countryOptions}
          />
        </FormControl>
      )}
    </Stack>
  )
}
export default CoinbaseEASForm
