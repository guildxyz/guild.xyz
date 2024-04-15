import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import GuildSelect from "requirements/common/GuildSelect"
import parseFromObject from "utils/parseFromObject"
import GuildAdmin from "./components/GuildAdmin"
import MinGuilds from "./components/MinGuilds"
import { Role, RoleRelative } from "./components/Role"
import UserSince from "./components/UserSince"

const guildRequirementTypes = [
  {
    label: "Have a role",
    value: "GUILD_ROLE",
    GuildRequirement: Role,
  },
  {
    label: "Have a role (relative)",
    value: "GUILD_ROLE_RELATIVE",
    GuildRequirement: RoleRelative,
  },
  {
    label: "Account age",
    value: "GUILD_USER_SINCE",
    GuildRequirement: UserSince,
  },
  {
    label: "Memberships count",
    value: "GUILD_MINGUILDS",
    GuildRequirement: MinGuilds,
  },
  {
    label: "Admin status",
    value: "GUILD_ADMIN",
    GuildRequirement: GuildAdmin,
  },
  {
    label: "Be a guild member",
    value: "GUILD_MEMBER",
    GuildRequirement: GuildSelect,
  },
]

const GuildForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const type = useWatch({ name: `${baseFieldPath}.type` })

  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const selected = guildRequirementTypes.find((reqType) => reqType.value === type)
  const isEditMode = !!field?.id

  const resetDataFields = () => {
    resetField(`${baseFieldPath}.data.guildId`)
    resetField(`${baseFieldPath}.data.roleId`)
    resetField(`${baseFieldPath}.data.minAmount`)
    resetField(`${baseFieldPath}.data.maxAmount`)
    resetField(`${baseFieldPath}.data.creationDate`)
  }
  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={guildRequirementTypes}
          afterOnChange={resetDataFields}
          isDisabled={isEditMode}
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

export default GuildForm
