import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
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

  const [isType, setIsType] = useState(false)
  const [isIssuence, setIsIssuence] = useState(false)
  const [isDate, setIsDate] = useState(false)
  const [isIssuer, setIsIssuer] = useState(false)

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
          name={`requirements.${index}.data.params.credType`}
          control={control}
          rules={{ required: isRequired("credType") }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              placeholder={placeholder("credType")}
              onChange={(newType) => {
                if (newType?.target?.value != "") setIsType(true)
                else setIsType(false)
                onChange(newType)
              }}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>This fiel is required!</FormErrorMessage>
      </FormControl>

      <Stack spacing="2" direction={{ base: "column", sm: "row" }} w="full">
        <FormControl isInvalid={isRequired("credIssuence") && !isIssuence}>
          <FormLabel>Issuance date:</FormLabel>

          <Controller
            name={`requirements.${index}.data.params.credIssuence`}
            control={control}
            rules={{ required: isRequired("credIssuence") }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                options={options}
                placeholder={placeholder("credIssuence")}
                value={options.find((option) => option.value === value)}
                onChange={(newSelectedOption: SelectOption) => {
                  if (newSelectedOption?.value != undefined) setIsIssuence(true)
                  else setIsIssuence(false)
                  onChange(newSelectedOption?.value)
                }}
                onBlur={onBlur}
              />
            )}
          />
          <FormErrorMessage>This fiel is required!</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={isRequired("credIssuenceDate") && !isDate}>
          <FormLabel>
            <br />
          </FormLabel>
          <Controller
            name={`requirements.${index}.data.params.credIssuenceDate`}
            control={control}
            rules={{ required: isRequired("credIssuenceDate") }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                type="date"
                ref={ref}
                placeholder="Cred date..."
                onChange={(newDate) => {
                  if (newDate?.target?.value != "") setIsDate(true)
                  else setIsDate(false)
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
      <FormControl>
        <FormLabel>Issuer DID:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.credIssuer`}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              placeholder="Optional"
              onChange={(newIssuer) => {
                if (newIssuer?.target?.value != "") setIsIssuer(true)
                else setIsIssuer(false)
                onChange(newIssuer)
              }}
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>
    </>
  )
}

export default DiscoFormCard
