import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useServerData from "hooks/useServerData"
import { useMemo } from "react"
import { useController, useFormContext, useFormState } from "react-hook-form"
import { SelectOption } from "types"
import pluralize from "utils/pluralize"
import useDiscordRoleMemberCounts from "../hooks/useDiscordRoleMemberCount"

const GuildifyExistingRole = () => {
  const { errors, dirtyFields } = useFormState()
  const { setValue } = useFormContext()
  const { roles: guildRoles } = useGuild()
  const { guildPlatform, index } = useRolePlatform()
  const {
    data: { roles: discordRoles },
  } = useServerData(guildPlatform.platformGuildId)

  const { memberCounts } = useDiscordRoleMemberCounts(
    discordRoles?.map((role) => role.id)
  )

  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({ name: `rolePlatforms.${index}.platformRoleId` })

  const options = useMemo(() => {
    if (!memberCounts || !discordRoles || !guildRoles) return undefined

    const guildifiedRoleIds = guildRoles.map(
      (role) =>
        role.rolePlatforms?.find(
          (platform) => platform.guildPlatformId === guildPlatform.id
        )?.platformRoleId
    )
    const notGuildifiedRoles = discordRoles.filter(
      (discordRole) => !guildifiedRoleIds.includes(discordRole.id)
    )

    return notGuildifiedRoles.map((role) => ({
      label: role.name,
      value: role.id,
      details:
        memberCounts[role.id] === null
          ? "Failed to count members"
          : pluralize(memberCounts[role.id], "member"),
    }))
  }, [discordRoles, memberCounts])

  return (
    <Box px="5" py="4">
      <FormControl isDisabled={!discordRoles?.length}>
        <HStack mb={2} alignItems="center">
          <FormLabel m={0}>Select role</FormLabel>
        </HStack>

        <Box maxW="sm">
          <StyledSelect
            name={name}
            ref={ref}
            options={options}
            value={options?.find((option) => option.value === value)}
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
        <FormErrorMessage>
          {errors.rolePlatforms?.[index]?.platformRoleId?.message}
        </FormErrorMessage>
      </FormControl>
      <Text fontWeight={"normal"} colorScheme="gray" mt="6">
        Existing members with the role but without Guild.xyz auth won't lose access.
        You'll be able to purge them later (coming soon)
      </Text>
    </Box>
  )
}

export default GuildifyExistingRole
