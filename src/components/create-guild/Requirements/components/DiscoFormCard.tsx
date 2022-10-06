import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
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

  return (
    <>
      <FormControl>
        <FormLabel>Credential type:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.credType` as string}
          control={control}
          rules={{ required: "This field is required." }}
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

        <FormErrorMessage>
          {/* {errors?.requirements?.[index]?.data?.params.credType} */}
        </FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Issuance date:</FormLabel>
        <Stack spacing="2" direction={{ base: "column", sm: "row" }} w="full">
          <Controller
            name={`requirements.${index}.data.params.credIssuence` as string}
            control={control}
            rules={{ required: "This field is required." }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                options={options}
                placeholder="Optional"
                value={options.find((option) => option.value === value)}
                onChange={(newSelectedOption: SelectOption) => {
                  onChange(newSelectedOption?.value)
                }}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name={`requirements.${index}.data.params.credIssuenceDate` as string}
            control={control}
            rules={{ required: "This field is required." }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                type="date"
                ref={ref}
                placeholder="Cred date..."
                onChange={(newDate) => {
                  onChange(new Date(newDate.target.value).toISOString())
                }}
                onBlur={onBlur}
              />
            )}
          />
        </Stack>
        <FormErrorMessage>
          {/* {errors?.requirements?.[index]?.data?.params.credType} */}
        </FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Issuer DID:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.credIssuer` as string}
          control={control}
          rules={{ required: "This field is required." }}
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

        <FormErrorMessage>
          {/* {errors?.requirements?.[index]?.data?.params.credIssuer} */}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default DiscoFormCard
