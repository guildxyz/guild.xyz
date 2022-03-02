import { Checkbox, FormControl, FormLabel } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const MembersToggle = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <FormLabel>Members section</FormLabel>
      <Checkbox {...register("showMembers")} colorScheme="primary">
        Show members list
      </Checkbox>
    </FormControl>
  )
}

export default MembersToggle
