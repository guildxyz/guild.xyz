import { FormControl, FormLabel } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import useLensProfile from "../hooks/useLensProfile"
import useLensProfiles from "../hooks/useLensProfiles"

const LensProfileSelect = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const id = useWatch({ name: `${baseFieldPath}.data.id` })

  // provide default value so there's options data on role edit
  // split before "." because I couldn't get the graphql query to work with "." in it
  const [search, setSearch] = useState(field?.data?.id?.split(".")?.[0] ?? "")
  const debouncedSearch = useDebouncedState(search)

  const { handles, isLoading: isProfilesLoading } = useLensProfiles(debouncedSearch)
  const { data: handle, isLoading: isProfileLoading } = useLensProfile(id)

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.id}
    >
      <FormLabel>Profile username:</FormLabel>

      <ControlledSelect
        name={`${baseFieldPath}.data.id`}
        rules={{
          required: "This field is required.",
        }}
        isClearable
        options={handles}
        placeholder={`Search user ${type === "LENS_FOLLOW" ? "to follow" : ""}`}
        onInputChange={(inputValue) => setSearch(inputValue.split(".")[0])}
        isLoading={isProfilesLoading || isProfileLoading}
        // so restCount stays visible
        filterOption={() => true}
        menuIsOpen={search ? undefined : false}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        fallbackValue={handle}
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default LensProfileSelect
