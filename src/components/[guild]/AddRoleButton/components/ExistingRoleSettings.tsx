import {
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react"
import Switch from "components/common/Switch"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { BaseSyntheticEvent } from "react"
import {
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"

const ExistingRoleSettings = () => {
  const { errors } = useFormState()
  const { register } = useFormContext()
  const { platforms } = useGuild()
  const {
    data: { roles },
  } = useServerData(platforms?.[0]?.platformId)

  const { field } = useController({ name: "activationInterval" })

  const activationInterval = useWatch({ name: "activationInterval" })
  const includeUnauthenticated = useWatch({ name: "includeUnauthenticated" })

  return (
    <VStack px="5" py="4" spacing="8">
      <FormControl isDisabled={!roles?.length}>
        <FormLabel>Select role</FormLabel>
        <Select {...register("discordRoleId")}>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.discordRoleId?.message}</FormErrorMessage>
      </FormControl>

      <HStack justifyContent="space-between" width="full">
        <FormControl>
          <HStack spacing={3} justifyContent="center">
            <Text>Instant</Text>
            <Switch
              {...field}
              onChange={(event: BaseSyntheticEvent) => {
                field.onChange(event.target.checked ? 7 : 0)
              }}
              value={field.value === 0 ? false : true}
            />
            <Text>Slow</Text>
          </HStack>
        </FormControl>

        <Divider orientation="vertical" height="8" />

        <FormControl>
          <HStack spacing={3} justifyContent="center">
            <Checkbox {...register("includeUnauthenticated")} />
            <FormLabel>Include unauthenticated users</FormLabel>
          </HStack>
        </FormControl>
      </HStack>

      <Text color="gray" fontSize="sm" whiteSpace="normal">
        {includeUnauthenticated
          ? "All members"
          : "Authenticated members (connected their Discord account with Guild.xyz)"}{" "}
        will lose access to the gated channel(s){" "}
        {activationInterval === 0 ? "immediately" : "after 7 days"}, if they do not
        meet the requirements.
      </Text>
    </VStack>
  )
}

export default ExistingRoleSettings
