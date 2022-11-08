import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useEffect } from "react"
import { useController, useFormContext, useFormState } from "react-hook-form"
import { FormCardProps } from "types"
import parseFromObject from "utils/parseFromObject"
import GuildAdmin from "./components/GuildAdmin"
import MinGuilds from "./components/MinGuilds"
import Role from "./components/Role"
import UserSince from "./components/UserSince"

const guildRequirementTypes = [
  {
    label: "Have a role",
    value: "GUILD_ROLE",
    GuildRequirement: Role,
  },
  {
    label: "Be a guild admin",
    value: "GUILD_ADMIN",
    GuildRequirement: GuildAdmin,
  },
  {
    label: "Be a user since",
    value: "GUILD_USER_SINCE",
    GuildRequirement: UserSince,
  },
  {
    label: "Be a member of guilds",
    value: "GUILD_MINGUILDS",
    GuildRequirement: MinGuilds,
  },
]

const GuildFormCard = ({ baseFieldPath }: FormCardProps): JSX.Element => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const { errors, touchedFields } = useFormState()
  const { resetField } = useFormContext()

  const selected = guildRequirementTypes.find((reqType) => reqType.value === value)

  useEffect(() => {
    if (!touchedFields?.data) return
    resetField(`${baseFieldPath}.data.urlName`)
    resetField(`${baseFieldPath}.data.roleId`)
    resetField(`${baseFieldPath}.data.minAmount`)
    resetField(`${baseFieldPath}.data.creationDate`)
  }, [value])

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={guildRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.GuildRequirement && (
        <>
          <Divider />
          <selected.GuildRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default GuildFormCard
