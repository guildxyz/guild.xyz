import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import RadioSelect from "components/common/RadioSelect"
import { Lock, LockSimpleOpen } from "phosphor-react"
import { useController, useFormContext } from "react-hook-form"
import KeepAccessInfoText from "./components/KeepAccessInfoText"

const options = [
  {
    value: 0,
    title: "Authenticate existing members",
    description: "Ensure that no bots can stay in your server",
    icon: Lock,
  },
  {
    value: 1,
    title: "Keep access for existing members",
    description: "Only guard for bots joining after now",
    icon: LockSimpleOpen,
    children: <KeepAccessInfoText />,
  },
]

const PickSecurityLevel = (): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const { field } = useController({
    control,
    name: "rolePlatforms.0.platformRoleData.grantAccessToExistingUsers",
  })

  return (
    <FormControl isRequired isInvalid={!!errors?.platform}>
      <FormLabel>Security level</FormLabel>
      <RadioSelect
        options={options}
        name="rolePlatforms.0.platformRoleData.grantAccessToExistingUsers"
        onChange={(newValue) => field.onChange(Boolean(+newValue))}
        value={+field.value}
        defaultValue={0}
        colorScheme="DISCORD"
      />

      <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default PickSecurityLevel
