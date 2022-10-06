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
      <FormControl isRequired>
        <FormLabel>Type:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.credType` as string}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              placeholder="Credential type"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {/* {errors?.requirements?.[index]?.data?.params.credType} */}
        </FormErrorMessage>
      </FormControl>
      <Stack spacing="4" direction={{ base: "column", sm: "row" }} w="full">
        <FormControl isRequired>
          <FormLabel>Issuance:</FormLabel>
          <Controller
            name={`requirements.${index}.data.params.credIssuence` as string}
            control={control}
            rules={{ required: "This field is required." }}
            defaultValue={"before"}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                options={options}
                value={options.find((option) => option.value === value)}
                onChange={(newSelectedOption: SelectOption) => {
                  onChange(newSelectedOption?.value)
                }}
                onBlur={onBlur}
              />
            )}
          />
          <FormErrorMessage>
            {/* {errors?.requirements?.[index]?.data?.params.credType} */}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Issuance date:</FormLabel>
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
          <FormErrorMessage>
            {/* {errors?.requirements?.[index]?.data?.params.credIssuenceDate.message} */}
          </FormErrorMessage>
        </FormControl>
      </Stack>
      <FormControl isRequired>
        <FormLabel>Issuer:</FormLabel>

        <Controller
          name={`requirements.${index}.data.params.credIssuer` as string}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              placeholder="Issuer DID"
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
