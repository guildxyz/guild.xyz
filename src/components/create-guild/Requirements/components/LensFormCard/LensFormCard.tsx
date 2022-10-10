import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Requirement, SelectOption } from "types"
import useLensProfiles from "./hooks/useLensProfiles"

type Props = {
  index: number
  field: Requirement
}

const typeOptions = [
  {
    value: "LENS_PROFILE",
    label: "Have a LENS profile",
  },
  {
    value: "LENS_FOLLOW",
    label: "Follow a profile",
  },
  {
    value: "LENS_COLLECT",
    label: "Collect a post",
  },
  {
    value: "LENS_MIRROR",
    label: "Mirror a post",
  },
]

const LensFormCard = ({ index, field }: Props) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `requirements.${index}.type` })

  return (
    <>
      <FormControl isRequired>
        <FormLabel>Type:</FormLabel>

        <Controller
          name={`requirements.${index}.type` as const}
          control={control}
          defaultValue={field.type}
          rules={{
            required: "This field is required.",
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              options={typeOptions}
              placeholder="Choose type"
              value={typeOptions?.find((option) => option.value === value)}
              onChange={(newSelectedOption: SelectOption) => {
                onChange(newSelectedOption.value)
                setValue(`requirements.${index}.data`, "")
              }}
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>

      {["LENS_COLLECT", "LENS_MIRROR"].includes(type) && (
        <FormControl isRequired isInvalid={errors?.requirements?.[index]?.data?.id}>
          <FormLabel>Post ID:</FormLabel>

          <Controller
            name={`requirements.${index}.data.id` as const}
            control={control}
            defaultValue={field.data.id ?? ""}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                placeholder="Paste Lenster link"
                value={value ?? ""}
                onChange={(event) => {
                  const newValue = event.target.value
                  const split = newValue.split("/")
                  onChange(split[split.length - 1])
                }}
                onBlur={onBlur}
              />
            )}
          />

          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.id?.message}
          </FormErrorMessage>
        </FormControl>
      )}

      {type === "LENS_FOLLOW" && <FollowSelect {...{ index, field }} />}
    </>
  )
}

const FollowSelect = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  // provide default value so there's options data on role edit
  // split before "." because I couldn't get the graphql query to work with "." in it
  const [search, setSearch] = useState(field.data?.id?.split(".")?.[0] ?? "")

  const { handles, restCount, isLoading } = useLensProfiles(search)

  const options = handles?.map((handle) => ({ label: handle, value: handle }))

  if (restCount > 0)
    options.push({ label: `${restCount} more`, value: 0, isDisabled: true })

  return (
    <FormControl isRequired isInvalid={errors?.requirements?.[index]?.data?.id}>
      <FormLabel>Profile username:</FormLabel>

      <Controller
        name={`requirements.${index}.data.id` as const}
        control={control}
        defaultValue={field.data?.id ?? ""}
        rules={{
          required: "This field is required.",
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <StyledSelect
            ref={ref}
            isClearable
            options={options}
            placeholder="Search user to follow"
            value={options?.find((option) => option.value === value)}
            onChange={(newSelectedOption: SelectOption) =>
              onChange(newSelectedOption?.value)
            }
            onInputChange={(inputValue) => setSearch(inputValue.split(".")[0])}
            isLoading={isLoading}
            onBlur={onBlur}
            // so restCount stays visible
            filterOption={() => true}
            menuIsOpen={search ? undefined : false}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
          />
        )}
      />

      <FormErrorMessage>
        {errors?.requirements?.[index]?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default LensFormCard
