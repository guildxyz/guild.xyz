import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement } from "types"

type Props = {
  index: number
  field: Requirement
}

const CaskFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl
        isRequired
        isInvalid={errors?.requirements?.[index]?.data?.provider}
      >
        <FormLabel>Provider:</FormLabel>

        <Controller
          name={`requirements.${index}.data.provider`}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="text"
              ref={ref}
              value={value ?? ""}
              placeholder="e.g.: 0x4aB5...123"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.provider?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={errors?.requirements?.[index]?.data?.planId}
      >
        <FormLabel>Plan ID:</FormLabel>

        <Controller
          name={`requirements.${index}.data.planId`}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="number"
              ref={ref}
              value={value ?? ""}
              placeholder="e.g.: 123456789"
              onChange={(event) => onChange(+event.target.value)}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.planId?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default CaskFormCard
