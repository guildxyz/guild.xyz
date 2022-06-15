import { FormControl } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useFormContext } from "react-hook-form"

const MembersToggle = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <Switch {...register("showMembers")} title="Show members" />
    </FormControl>
  )
}

export default MembersToggle
