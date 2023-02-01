import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import SpaceSelect from "./SpaceSelect"

const FollowSince = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <SpaceSelect baseFieldPath={baseFieldPath} />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.since}
      >
        <FormLabel>Follow since</FormLabel>

        <Controller
          control={control}
          name={`${baseFieldPath}.data.since`}
          defaultValue={null}
          rules={{
            required: "This field is required.",
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="date"
              ref={ref}
              onBlur={onBlur}
              onChange={(e) => {
                const valueAsTimestamp = new Date(e.target.value).getTime()
                onChange(valueAsTimestamp)
              }}
              value={
                value && !isNaN(value)
                  ? new Date(value).toISOString().split("T")[0]
                  : ""
              }
              max={new Date().toISOString().split("T")[0]}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.since?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default FollowSince
