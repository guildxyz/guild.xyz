import { Box, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { DiscoParamType, Requirement, SelectOption } from "types"

type Props = {
  index: number
  field: Requirement
}

const options = [
  { label: "Before", value: "before" },
  { label: "After", value: "after" },
]

const DiscoFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const baseFieldName = `requirements.${index}.data.params`

  const isType = useWatch({ name: `${baseFieldName}.credType` })
  const isIssuence = useWatch({ name: `${baseFieldName}.credIssuence` })
  const isDate = useWatch({ name: `${baseFieldName}.credIssuenceDate` })
  const isIssuer = useWatch({ name: `${baseFieldName}.credIssuer` })

  const isRequired = (param) => {
    const error = "This field is required"
    switch (param) {
      case "credType":
        if (isType || isIssuence || isDate || isIssuer) return error
        else return false
      case "credIssuence":
        if (isDate) return error
        else return false
      case "credIssuenceDate":
        if (isIssuence) return error
        else return false
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
      <FormControl
        isInvalid={errors?.requirements?.[index]?.data?.params?.credType && !isType}
      >
        <FormLabel>Credential type:</FormLabel>
        <Controller
          name={`${baseFieldName}.credType`}
          control={control}
          defaultValue={(field.data?.params as DiscoParamType)?.credType}
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
            isInvalid={
              errors?.requirements?.[index]?.data?.params?.credIssuence &&
              !isIssuence
            }
          >
            <Controller
              name={`${baseFieldName}.credIssuence`}
              control={control}
              defaultValue={(field.data?.params as DiscoParamType)?.credIssuence}
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
            isInvalid={
              errors?.requirements?.[index]?.data?.params?.credIssuenceDate &&
              !isDate
            }
          >
            <Controller
              name={`${baseFieldName}.credIssuenceDate`}
              control={control}
              defaultValue={(field.data?.params as DiscoParamType)?.credIssuenceDate}
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
          defaultValue={(field.data?.params as DiscoParamType)?.credIssuer}
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
