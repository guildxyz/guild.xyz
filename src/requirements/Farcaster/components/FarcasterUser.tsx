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
import { SelectOption } from "types"
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

  const { data: farcasterUsers, isValidating } = useFarcasterUsers(debounceSearch)
  const options: SelectOption<number>[] = farcasterUsers?.map((user) => ({
    label: user.display_name,
    details: user.username,
    value: user.fid,
    img: user.pfp_url,
  }))

  const fid = useWatch({ name: `${baseFieldPath}.data.id` })
  const { data: farcasterUser } = useFarcasterUser(fid)

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
    >
      <FormLabel>User:</FormLabel>

      <InputGroup>
        {farcasterUser?.pfp_url && (
          <InputLeftElement>
            <OptionImage
              img={farcasterUser.pfp_url}
              alt={farcasterUser.display_name}
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
          menuIsOpen={debounceSearch ? undefined : false}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          fallbackValue={
            farcasterUser && {
              label: farcasterUser.display_name,
              value: farcasterUser.fid,
              img: farcasterUser.pfp_url,
            }
          }
          // We filter users on the API, so don't need to apply a filter client side too
          filterOption={() => true}
        />
      </InputGroup>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}
export default FarcasterUser
