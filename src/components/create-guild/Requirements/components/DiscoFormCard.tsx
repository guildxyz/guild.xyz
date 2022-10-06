import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
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

  const isRequired = () => isType || isIssuence || isDate || isIssuer

  return (
    <>
      <FormControl
        isInvalid={
          errors?.requirements?.[index]?.data?.params?.credType && isRequired()
        }
      >
        <FormLabel>Credential type:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.credType`}
          control={control}
          rules={{ required: isRequired() }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              placeholder="Optional"
              onChange={(newType) => {
                if (newType?.target?.value != "") setIsType(true)
                else setIsType(false)
                onChange(newType)
              }}
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>

      <FormControl
        isInvalid={
          errors?.requirements?.[index]?.data?.params?.credIssuence && isRequired()
        }
      >
        <FormLabel>Issuance date:</FormLabel>
        <Stack spacing="2" direction={{ base: "column", sm: "row" }} w="full">
          <Controller
            name={`requirements.${index}.data.params.credIssuence`}
            control={control}
            rules={{ required: isRequired() }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                options={options}
                placeholder="Optional"
                value={options.find((option) => option.value === value)}
                onChange={(newSelectedOption: SelectOption) => {
                  if (newSelectedOption?.target?.value != null) setIsIssuence(true)
                  else setIsIssuence(false)
                  onChange(newSelectedOption?.value)
                }}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name={`requirements.${index}.data.params.credIssuenceDate`}
            control={control}
            rules={{ required: isRequired() }}
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
        </Stack>
      </FormControl>
      <FormControl
        isInvalid={
          errors?.requirements?.[index]?.data?.params?.credIssuer && isRequired()
        }
      >
        <FormLabel>Issuer DID:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.credIssuer`}
          control={control}
          rules={{ required: isRequired() }}
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
