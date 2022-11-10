import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { FormCardProps } from "types"
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
    label: "Member since",
    value: "DISCORD_MEMBER_SINCE",
    DiscordRequirement: DiscordMemberSince,
  },
  {
    label: "Registered before",
    value: "DISCORD_JOIN",
    DiscordRequirement: DiscordJoin,
  },
  {
    label: "Registered since",
    value: "DISCORD_JOIN_FROM_NOW",
    DiscordRequirement: DiscordJoinFromNow,
  },
]

const DiscordFormCard = ({ baseFieldPath }: FormCardProps) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    defaultValue: "DISCORD_ROLE",
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = discordRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={discordRequirementTypes}
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

      {selected?.DiscordRequirement && (
        <>
          <Divider />
          <selected.DiscordRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default DiscordFormCard
