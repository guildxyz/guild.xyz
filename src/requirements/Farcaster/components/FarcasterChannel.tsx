import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useDebouncedState from "hooks/useDebouncedState"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import useFarcasterChannels, {
  useFarcasterChannel,
} from "../hooks/useFarcasterChannels"

type Props = {
  baseFieldPath: string
}

const FarcasterChannel = ({ baseFieldPath }: Props) => {
  const {
    formState: { errors },
  } = useFormContext()

  const [search, setSearch] = useState("")
  const debounceSearch = useDebouncedState(search)

  const { data: options, isValidating } = useFarcasterChannels(debounceSearch)

  const id = useWatch({ name: `${baseFieldPath}.data.id` })
  const { data: farcasterChannel } = useFarcasterChannel(id)

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
    >
      <FormLabel>Channel:</FormLabel>

      <InputGroup>
        {farcasterChannel?.img && (
          <InputLeftElement>
            <OptionImage
              img={farcasterChannel.img.toString()}
              alt={farcasterChannel.label}
            />
          </InputLeftElement>
        )}

        <ControlledSelect
          name={`${baseFieldPath}.data.id`}
          rules={{
            required: "This field is required.",
          }}
          isClearable
          options={options}
          placeholder="Search channel"
          onInputChange={setSearch}
          isLoading={isValidating}
          // so restCount stays visible
          filterOption={() => true}
          menuIsOpen={debounceSearch ? undefined : false}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          fallbackValue={farcasterChannel}
        />
      </InputGroup>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export default FarcasterChannel
