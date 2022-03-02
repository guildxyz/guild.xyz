import { FormControl, FormLabel, Switch } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const MembersToggle = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <FormLabel>Members section</FormLabel>
      <Switch
        {...register("showMembers")}
        colorScheme="primary"
        display="flex"
        alignItems="center"
      >
        Show members
      </Switch>
    </FormControl>
  )
}

export default MembersToggle
