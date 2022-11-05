import { Divider, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { Requirement } from "types"
import BeArtist from "./components/SoundBeAnArtist"
import SoundOwnASong from "./components/SoundOwnASong"
import Top10Collector from "./components/SoundTop10Collector"
import SupportArtist from "./components/SupportArtist"

type Props = {
  index: number
  field: Requirement
}

const soundRequirementTypes = [
  {
    label: "Be an artist",
    value: "SOUND_ARTIST",
    SoundRequirement: BeArtist,
  },
  {
    label: "Support an artist",
    value: "SOUND_SUPPORT",
    SoundRequirement: SupportArtist,
  },
  {
    label: "Own a song",
    value: "SOUND_OWN_SONG",
    SoundRequirement: SoundOwnASong,
  },
  {
    label: "Be a top 10 collector",
    value: "SOUND_TOP10",
    SoundRequirement: Top10Collector,
  },
]

const SoundFormCard = ({ index, field }: Props) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `requirements.${index}.type`,
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = soundRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.type?.message}>
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={soundRequirementTypes}
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

      {selected?.SoundRequirement && (
        <>
          <Divider />
          <selected.SoundRequirement index={index} field={field} />
        </>
      )}
    </>
  )
}

export default SoundFormCard
