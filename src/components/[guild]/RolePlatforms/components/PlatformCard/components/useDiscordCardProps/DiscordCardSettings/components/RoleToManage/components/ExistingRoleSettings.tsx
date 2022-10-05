import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useServerData from "hooks/useServerData"
import { useEffect, useMemo, useState } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import { SelectOption } from "types"
import pluralize from "utils/pluralize"
import useDiscordRoleMemberCounts from "../hooks/useDiscordRoleMemberCount"

const ExistingRoleSettings = () => {
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

  const [selectedRoleId, setSelectedRoleId] = useState<string>()
  const selectedRole = useMemo(
    () => options?.find((option) => option.value === selectedRoleId),
    [selectedRoleId, options]
  )

  const { append, update, remove } = useFieldArray({
    name: "requirements",
  })
  const requirements = useWatch({ name: "requirements" })

  const existingGuildifyRequirementIndex =
    requirements?.findIndex(
      ({ type, data: { _guildify, serverId } }) =>
        !!_guildify &&
        type === "DISCORD_ROLE" &&
        serverId === guildPlatform.platformGuildId
    ) ?? -1

  useEffect(() => {
    if (!selectedRole) return

    const req = {
      type: "DISCORD_ROLE",
      data: {
        serverId: guildPlatform.platformGuildId,
        serverName: guildPlatform.platformGuildName,
        roleId: selectedRole.value,
        roleName: selectedRole.label,
        _guildify: true,
      },
    }

    // Remove FREE requirement(s)
    requirements
      .filter(({ type }) => type === "FREE")
      .forEach((_, i) => {
        remove(i)
      })

    if (existingGuildifyRequirementIndex >= 0) {
      update(existingGuildifyRequirementIndex, req)
    } else {
      append(req)
    }

    if (!dirtyFields.name && !(selectedRole as any).__isNew__) {
      setValue("name", selectedRole?.label, { shouldDirty: false })
    }
  }, [selectedRole])

  return (
    <Box px="5" py="4">
      <FormControl isDisabled={!discordRoles?.length}>
        <HStack mb={2} alignItems="center">
          <FormLabel m={0}>Select role</FormLabel>
        </HStack>

        <Box maxW="sm">
          <StyledSelect
            defaultValue={options?.find(
              ({ value }) =>
                value ===
                requirements[existingGuildifyRequirementIndex]?.data?.roleId
            )}
            options={options}
            value={selectedRole}
            onChange={(selectedOption: SelectOption) => {
              setValue("logic", "OR")
              setSelectedRoleId(selectedOption?.value)
            }}
            isLoading={!options}
          />
        </Box>
        <FormErrorMessage>
          {errors.rolePlatforms?.[index]?.platformRoleId?.message}
        </FormErrorMessage>
      </FormControl>
    </Box>
  )
}

export default ExistingRoleSettings
