import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Stack,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import useServerData from "hooks/useServerData"
import { useMemo } from "react"
import { useController, useFormContext, useFormState } from "react-hook-form"
import { SelectOption } from "types"
import UnauthenticatedOptions from "../UnauthenticatedOptions"
import useDiscordRoleMemberCounts from "./hooks/useDiscordRoleMemberCount"

const ExistingRoleSettings = () => {
  const { errors, dirtyFields } = useFormState()
  const { setValue } = useFormContext()
  const { platforms } = useGuild()
  const {
    data: { roles },
  } = useServerData(platforms?.[0]?.platformId)

  const { memberCounts } = useDiscordRoleMemberCounts(roles?.map((role) => role.id))

  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({ name: "discordRoleId", defaultValue: "NEW" })

  const options = useMemo(() => {
    if (!memberCounts || !roles) return undefined

    return roles.map((role) => ({
      label: role.name,
      value: role.id,
      details:
        memberCounts[role.id] === null
          ? "Failed to count members"
          : `${memberCounts[role.id]} member${
              (memberCounts[role.id] !== 1 && "s") || ""
            }`,
    }))
  }, [roles, memberCounts])

  const optionsFinal = [
    { label: "Create a new role for me", value: "NEW" },
    ...(options ?? []),
  ]

  return (
    <Stack direction={{ base: "column", md: "row" }} spacing="8">
      <FormControl isDisabled={!roles?.length}>
        <HStack mb={2} alignItems="center">
          <FormLabel m={0}>Select role</FormLabel>
        </HStack>

        <Box maxW="sm">
          <StyledSelect
            name={name}
            ref={ref}
            options={optionsFinal}
            value={optionsFinal?.find((option) => option.value === value)}
            onChange={(selectedOption: SelectOption) => {
              if (!dirtyFields.name) {
                setValue("name", selectedOption?.label, { shouldDirty: false })
              }
              onChange(selectedOption?.value)
            }}
            onBlur={onBlur}
            isLoading={!options}
          />
        </Box>
        <FormErrorMessage>{errors.discordRoleId?.message}</FormErrorMessage>
      </FormControl>

      {value !== "NEW" && (
        <FormControl>
          <FormLabel whiteSpace="normal">
            Should remove from unauthenticated users...
          </FormLabel>
          <UnauthenticatedOptions />
        </FormControl>
      )}
    </Stack>
  )
}

export default ExistingRoleSettings
