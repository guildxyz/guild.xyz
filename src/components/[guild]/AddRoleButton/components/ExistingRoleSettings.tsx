import { FormControl, FormErrorMessage, FormLabel, VStack } from "@chakra-ui/react"
import { Select } from "chakra-react-select"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFormContext, useFormState } from "react-hook-form"

const ExistingRoleSettings = () => {
  const { errors } = useFormState()
  const { register } = useFormContext()
  const { platforms } = useGuild()
  const {
    data: { roles },
  } = useServerData(platforms?.[0]?.platformId)

  return (
    <VStack px="5" py="4" spacing="8">
      <FormControl isInvalid={!!errors.discordRoleId} isDisabled={!roles?.length}>
        <FormLabel>Select role</FormLabel>
        <Select
          {...register("discordRoleId", {
            validate: (value) => value !== "0" || "Please select a role",
          })}
        >
          <option value={0} defaultChecked>
            No role selected
          </option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.discordRoleId?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ExistingRoleSettings
