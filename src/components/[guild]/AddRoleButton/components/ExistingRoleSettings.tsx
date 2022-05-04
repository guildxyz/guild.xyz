import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { useFormContext, useFormState } from "react-hook-form"
import UnauthenticatedOptions from "./UnauthenticatedOptions"

const ExistingRoleSettings = () => {
  const { errors } = useFormState()
  const { register } = useFormContext()
  const { platforms } = useGuild()
  const {
    data: { roles },
  } = useServerData(platforms?.[0]?.platformId)

  return (
    <VStack px="5" py="4" spacing="8">
      <FormControl isDisabled={!roles?.length}>
        <FormLabel>Select role</FormLabel>
        <Select {...register("discordRoleId")} maxW="sm">
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.discordRoleId?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel whiteSpace="normal">
          When should the Guild.xyz bot remove the role from unauthenticated users:
        </FormLabel>
        <UnauthenticatedOptions />
      </FormControl>
    </VStack>
  )
}

export default ExistingRoleSettings
