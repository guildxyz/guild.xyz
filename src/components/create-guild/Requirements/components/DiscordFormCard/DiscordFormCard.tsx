import { Divider, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { Requirement } from "types"
import DiscordRole from "./components/DiscordRole"

type Props = {
  index: number
  field: Requirement
}

const discordRequirementTypes = [
  {
    label: "Have a role",
    value: "DISCORD_ROLE",
    DiscordRequirement: DiscordRole,
  },
]

const DiscordFormCard = ({ index }: Props) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `requirements.${index}.type`,
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = discordRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.type?.message}>
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
          {errors?.requirements?.[index]?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.DiscordRequirement && (
        <>
          <Divider />
          <selected.DiscordRequirement index={index} />
        </>
      )}
    </>
  )
}

export default DiscordFormCard
