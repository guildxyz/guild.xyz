import { Box, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Requirement, SelectOption } from "types"

type Props = {
  index: number
  field: Requirement
}

const options = [
  { label: "Before", value: "before" },
  { label: "After", value: "after" },
]

const DiscoFormCard = ({ index }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const baseFieldName = `requirements.${index}.data.params`

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
    <>
      <FormControl isInvalid={errors?.requirements?.[index]?.data?.params?.credType}>
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
          {errors?.requirements?.[index]?.data?.params?.credType?.message}
        </FormErrorMessage>
      </FormControl>

      <Box w="full">
        <FormLabel>Issuance date:</FormLabel>
        <Stack spacing="2" direction={{ base: "column", sm: "row" }} w="full">
          <FormControl
            isInvalid={errors?.requirements?.[index]?.data?.params?.credIssuence}
          >
            <Controller
              name={`${baseFieldName}.credIssuence`}
              control={control}
              rules={{ required: isRequired("credIssuence") }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <StyledSelect
                  ref={ref}
                  isClearable
                  options={options}
                  placeholder={placeholder("credIssuence")}
                  value={options.find((option) => option.value === value) ?? ""}
                  onChange={(newSelectedOption: SelectOption) =>
                    onChange(newSelectedOption?.value)
                  }
                  onBlur={onBlur}
                />
              )}
            />
            <FormErrorMessage>
              {errors?.requirements?.[index]?.data?.params?.credIssuence?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={errors?.requirements?.[index]?.data?.params?.credIssuenceDate}
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
                errors?.requirements?.[index]?.data?.params?.credIssuenceDate
                  ?.message
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
    </>
  )
}

export default DiscoFormCard
