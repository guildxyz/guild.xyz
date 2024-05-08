import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
} from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import ControlledSelect from "components/common/ControlledSelect"
import useServerData from "hooks/useServerData"
import { useMemo } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import pluralize from "utils/pluralize"

const GuildifyExistingRole = () => {
  const { errors, dirtyFields, defaultValues } = useFormState()
  const { setValue } = useFormContext()
  const { roles: guildRoles } = useGuild()
  const { guildPlatform, index } = useRolePlatform()
  const {
    data: { roles: discordRoles },
  } = useServerData(guildPlatform.platformGuildId, { memberCountDetails: true })

  const options = useMemo(() => {
    if (!discordRoles || !guildRoles) return undefined

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
      details: pluralize(role.memberCount, "member"),
    }))
  }, [discordRoles, guildRoles, guildPlatform.id])

  return (
    <Box px="5" py="4">
      <FormControl isDisabled={!discordRoles?.length}>
        <HStack mb={2} alignItems="center">
          <FormLabel m={0}>Select role</FormLabel>
        </HStack>

        <Box maxW="sm">
          <ControlledSelect
            name={`rolePlatforms.${index}.platformRoleId`}
            isLoading={!options}
            options={options}
            beforeOnChange={(newValue) => {
              if (defaultValues.name || dirtyFields.name) return
              setValue("name", newValue?.label, { shouldDirty: false })
            }}
          />
        </Box>
        <FormErrorMessage>
          {errors.rolePlatforms?.[index]?.platformRoleId?.message}
        </FormErrorMessage>
      </FormControl>
      <Text fontWeight={"normal"} colorScheme="gray" mt="6">
        Existing members with the role but without Guild.xyz auth won't lose access
      </Text>
    </Box>
  )
}

export default GuildifyExistingRole
