import { Box, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const options = [
  { label: "Before", value: "before" },
  { label: "After", value: "after" },
]

const DiscoForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const baseFieldName = `${baseFieldPath}.data.params`

  const credIssuence = useWatch({ name: `${baseFieldName}.credIssuence` })
  const credIssuanceDate = useWatch({ name: `${baseFieldName}.credIssuenceDate` })
  const credIssuer = useWatch({ name: `${baseFieldName}.credIssuer` })

  const isRequired = (param) => {
    const message = "This field is required"
    switch (param) {
      case "credType":
        if (credIssuence || credIssuanceDate || credIssuer) return message
      case "credIssuence":
        if (credIssuanceDate) return message
      case "credIssuenceDate":
        if (credIssuence) return message
      default:
        return false
    }
  }

  const placeholder = (param) => {
    if (isRequired(param)) return "Required"
    else return "Optional"
  }

  const dateFormat = (date) => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    if (day < 10) {
      day = "0" + day
    }
    if (month < 10) {
      month = "0" + month
    }

    return year + "-" + month + "-" + day
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={parseFromObject(errors, baseFieldPath)?.data?.params?.credType}
      >
        <FormLabel>Credential type:</FormLabel>
        <Controller
          name={`${baseFieldName}.credType`}
          control={control}
          rules={{ required: isRequired("credType") }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder={placeholder("credType")}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.params?.credType?.message}
        </FormErrorMessage>
      </FormControl>

      <Box w="full">
        <FormLabel>Issuance date:</FormLabel>
        <Stack spacing="2" direction={{ base: "column", sm: "row" }} w="full">
          <FormControl
            isInvalid={
              parseFromObject(errors, baseFieldPath)?.data?.params?.credIssuence
            }
          >
            <ControlledCombobox
              name={`${baseFieldName}.credIssuence`}
              rules={{ required: isRequired("credIssuence") }}
              isClearable
              options={options}
              placeholder={placeholder("credIssuence")}
            />

            <FormErrorMessage>
              {
                parseFromObject(errors, baseFieldPath)?.data?.params?.credIssuence
                  ?.message
              }
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={
              parseFromObject(errors, baseFieldPath)?.data?.params?.credIssuenceDate
            }
          >
            <Controller
              name={`${baseFieldName}.credIssuenceDate`}
              control={control}
              rules={{ required: isRequired("credIssuenceDate") }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  type="date"
                  ref={ref}
                  placeholder="Cred date..."
                  value={dateFormat(new Date(value)) ?? ""}
                  onChange={(newDate) => {
                    onChange(
                      newDate.target.value != ""
                        ? new Date(newDate.target.value).toISOString()
                        : ""
                    )
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            <FormErrorMessage>
              {
                parseFromObject(errors, baseFieldPath)?.data?.params
                  ?.credIssuenceDate?.message
              }
            </FormErrorMessage>
          </FormControl>
        </Stack>
      </Box>
      <FormControl>
        <FormLabel>Issuer DID:</FormLabel>

        <Controller
          name={`${baseFieldName}.credIssuer`}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder="Optional"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>
    </Stack>
  )
}

export default DiscoForm
