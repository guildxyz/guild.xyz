import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormContext, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import SoundOwnASong from "./components/SoundOwnASong"
import SoundSupportArtist from "./components/SoundSupportArtist"
import Top10Collector from "./components/SoundTop10Collector"

const soundRequirementTypes = [
  {
    label: "Be an artist",
    value: "SOUND_ARTIST",
  },
  {
    label: "Support an artist",
    value: "SOUND_ARTIST_BACKED",
    SoundRequirement: SoundSupportArtist,
  },
  {
    label: "Own a song",
    value: "SOUND_COLLECTED",
    SoundRequirement: SoundOwnASong,
  },
  {
    label: "Be a top 10 collector",
    value: "SOUND_TOP_COLLECTOR",
    SoundRequirement: Top10Collector,
  },
]

const SoundForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.type`,
    rules: { required: "It's required to select a type" },
  })

  const { resetField } = useFormContext()

  const { errors } = useFormState()

  const selected = soundRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={soundRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            resetField(`${baseFieldPath}.data.id`, { defaultValue: "" })
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.SoundRequirement && (
        <>
          <Divider />
          <selected.SoundRequirement baseFieldPath={baseFieldPath} field={field} />
        </>
      )}
    </Stack>
  )
}

export default SoundForm
