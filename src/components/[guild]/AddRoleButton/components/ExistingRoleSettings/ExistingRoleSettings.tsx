import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Spinner,
  Tag,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { Warning } from "phosphor-react"
import { useFormContext, useFormState } from "react-hook-form"
import UnauthenticatedOptions from "../UnauthenticatedOptions"
import useDiscordRoleMemberCount from "./hooks/useDiscordRoleMemberCount"

const ExistingRoleSettings = () => {
  const { errors } = useFormState()
  const { register } = useFormContext()
  const { platforms } = useGuild()
  const {
    data: { roles },
  } = useServerData(platforms?.[0]?.platformId)

  const { memberCount, error, isLoading } = useDiscordRoleMemberCount()

  return (
    <VStack px="5" py="4" spacing="8">
      <FormControl isDisabled={!roles?.length}>
        <HStack mb={2} alignItems="center">
          <FormLabel m={0}>Select role</FormLabel>
          {error ? (
            <Tooltip
              label="Failed to count the number of members with the selected role"
              shouldWrapChildren
              placement="right"
            >
              <Warning color="orange" />
            </Tooltip>
          ) : (
            <Tooltip
              placement="right"
              label={
                isLoading
                  ? "Counting the number of members with the selected role"
                  : `${memberCount ?? 0} member${
                      memberCount === 1 ? " has" : "s have"
                    } this role on Discord`
              }
            >
              <Tag>
                {isLoading ? (
                  <Spinner size="xs" />
                ) : (
                  <Text>
                    {memberCount ?? 0} member{memberCount === 1 ? "" : "s"}
                  </Text>
                )}
              </Tag>
            </Tooltip>
          )}
        </HStack>

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
