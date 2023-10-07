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
import useFarcasterUsers, { useFarcasterUser } from "../hooks/useFarcasterUsers"

type Props = {
  baseFieldPath: string
}

const FarcasterUser = ({ baseFieldPath }: Props) => {
  const {
    formState: { errors },
  } = useFormContext()

  const [search, setSearch] = useState("")
  const debounceSearch = useDebouncedState(search)

  const { data: options, isValidating } = useFarcasterUsers(debounceSearch)

  const fid = useWatch({ name: `${baseFieldPath}.data.id` })
  const { data: farcasterUser } = useFarcasterUser(fid)

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
    >
      <FormLabel>User:</FormLabel>

      <InputGroup>
        {farcasterUser?.img && (
          <InputLeftElement>
            <OptionImage
              img={farcasterUser.img.toString()}
              alt={farcasterUser.label}
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
          placeholder="Search user"
          onInputChange={setSearch}
          isLoading={isValidating}
          // so restCount stays visible
          filterOption={() => true}
          menuIsOpen={debounceSearch ? undefined : false}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          // TODO: return users as SelectOption[] from the hooks!
          // TODO: set SWR cache for single user when selection an option, that way we won't experience a delay between selecting and displaying a user in the select
          fallbackValue={farcasterUser}
        />
      </InputGroup>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export default FarcasterUser
