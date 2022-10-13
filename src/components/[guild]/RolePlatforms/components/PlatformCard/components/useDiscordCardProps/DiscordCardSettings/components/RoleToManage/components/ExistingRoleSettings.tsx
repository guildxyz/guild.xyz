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
import { useMemo, useState } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
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

  const platformRoleId = useWatch({ name: `rolePlatforms.${index}.platformRoleId` })

  return (
    <Box px="5" py="4">
      <FormControl isDisabled={!discordRoles?.length}>
        <HStack mb={2} alignItems="center">
          <FormLabel m={0}>Select role</FormLabel>
        </HStack>

        <Box maxW="sm">
          <StyledSelect
            defaultValue={options?.find(({ value }) => value === platformRoleId)}
            options={options}
            value={selectedRole}
            onChange={(selectedOption: SelectOption) => {
              if (!dirtyFields.name && !(selectedOption as any).__isNew__) {
                setValue("name", selectedOption?.label, { shouldDirty: false })
              }
              setValue(
                `rolePlatforms.${index}.platformRoleId`,
                selectedOption?.value
              )
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
