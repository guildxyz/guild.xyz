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
    switch (param) {
      case "credType":
        if (isType || isIssuence || isDate || isIssuer) return true
        else return false
      case "credIssuence":
        if (isDate) return true
        else return false
      case "credIssuenceDate":
        if (isIssuence) return true
        else return false
    }
  }

  const placeholder = (param) => {
    if (isRequired(param)) return "Required"
    else return "Optional"
  }

  return (
    <>
      <FormControl isInvalid={isRequired("credType") && !isType}>
        <FormLabel>Credential type:</FormLabel>
        <Controller
          name={`${baseFieldName}.credType`}
          control={control}
          rules={{ required: isRequired("credType") }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              placeholder={placeholder("credType")}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>This fiel is required!</FormErrorMessage>
      </FormControl>

      <Box w="full">
        <FormLabel>Issuance date:</FormLabel>
        <Stack spacing="2" direction={{ base: "column", sm: "row" }} w="full">
          <FormControl isInvalid={isRequired("credIssuence") && !isIssuence}>
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
                  value={options.find((option) => option.value === value)}
                  onChange={(newSelectedOption: SelectOption) =>
                    onChange(newSelectedOption?.value)
                  }
                  onBlur={onBlur}
                />
              )}
            />
            <FormErrorMessage>This fiel is required!</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isRequired("credIssuenceDate") && !isDate}>
            <Controller
              name={`${baseFieldName}.credIssuenceDate`}
              control={control}
              rules={{ required: isRequired("credIssuenceDate") }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  type="date"
                  ref={ref}
                  placeholder="Cred date..."
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
            <FormErrorMessage>This fiel is required!</FormErrorMessage>
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
