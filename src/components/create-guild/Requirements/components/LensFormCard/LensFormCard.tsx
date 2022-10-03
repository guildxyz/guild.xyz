import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement, SelectOption } from "types"
import useLensProfiles from "./hooks/useLensProfiles"

type Props = {
  index: number
  field: Requirement
}

const typeOptions = [
  {
    value: "profile",
    label: "Have a LENS profile",
  },
  {
    value: "nft",
    label: "Own a collect/mirror NFT",
  },
  {
    value: "follow",
    label: "Follow a profile",
  },
]

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const LensFormCard = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const [type, setType] = useState(
    field?.address ? "nft" : field?.data ? "follow" : "profile"
  )

  return (
    <>
      <FormControl isRequired>
        <FormLabel>Type:</FormLabel>

        <StyledSelect
          options={typeOptions}
          placeholder="Choose type"
          value={typeOptions?.find((option) => option.value === type)}
          onChange={(newSelectedOption: SelectOption) =>
            setType(newSelectedOption.value)
          }
        />
      </FormControl>

      {type === "nft" && (
        <FormControl isRequired isInvalid={errors?.requirements?.[index]?.address}>
          <FormLabel>Collect/mirror NFT address:</FormLabel>

          <Controller
            name={`requirements.${index}.address` as const}
            control={control}
            defaultValue={field.address ?? ""}
            rules={{
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
            }}
            shouldUnregister
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                placeholder="Paste address"
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <FormErrorMessage>
            {errors?.requirements?.[index]?.address?.message}
          </FormErrorMessage>
        </FormControl>
      )}

      {type === "follow" && <FollowSelect {...{ index, field }} />}
    </>
  )
}

const FollowSelect = ({ index, field }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const [search, setSearch] = useState("")

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
        defaultValue={field.data.id ?? ""}
        rules={{
          required: "This field is required.",
        }}
        shouldUnregister
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
