import { FormControl } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useFormContext } from "react-hook-form"

const HideFromExplorerToggle = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <Switch
        {...register("hideFromExplorer")}
        title="Hide from explorer"
        description="Make guild private so only those will know about it who you share the link with"
      />
    </FormControl>
  )
}

export default HideFromExplorerToggle
