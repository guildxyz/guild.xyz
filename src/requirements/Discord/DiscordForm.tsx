import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import { ControlledCombobox } from "components/zag/Combobox"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import DiscordJoin from "./components/DiscordJoin"
import DiscordJoinFromNow from "./components/DiscordJoinFromNow"
import DiscordMemberSince from "./components/DiscordMemberSince"
import DiscordRole from "./components/DiscordRole"

const discordRequirementTypes = [
  {
    label: "Have a role",
    value: "DISCORD_ROLE",
    DiscordRequirement: DiscordRole,
  },
  {
    label: "Be member of server since",
    value: "DISCORD_MEMBER_SINCE",
    DiscordRequirement: DiscordMemberSince,
  },
  {
    label: "Account age (absolute)",
    value: "DISCORD_JOIN",
    DiscordRequirement: DiscordJoin,
  },
  {
    label: "Account age (relative)",
    value: "DISCORD_JOIN_FROM_NOW",
    DiscordRequirement: DiscordJoinFromNow,
  },
]

const DiscordForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { resetField } = useFormContext()
  const { errors } = useFormState()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = discordRequirementTypes.find((reqType) => reqType.value === type)

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.memberSince`)
    resetField(`${baseFieldPath}.data.serverId`)
    resetField(`${baseFieldPath}.data.serverName`)
    resetField(`${baseFieldPath}.data.roleId`)
    resetField(`${baseFieldPath}.data.roleName`)
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={discordRequirementTypes}
          beforeOnChange={resetFields}
          placeholder="Select type"
          disableOptionFiltering
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.DiscordRequirement && (
        <>
          <Divider />
          <selected.DiscordRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default DiscordForm
