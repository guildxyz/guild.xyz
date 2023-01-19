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
import SoundArtistSelect from "./components/SoundArtistSelect"
import SoundMinAmount from "./components/SoundMinAmount"
import SoundOwnASong from "./components/SoundOwnASong"

const soundRequirementTypes = [
  {
    label: "Be an artist",
    value: "SOUND_ARTIST",
  },
  {
    label: "Collect a song",
    value: "SOUND_COLLECTED",
    SoundRequirement: SoundOwnASong,
  },
  {
    label: "Collect any song from artist",
    value: "SOUND_ARTIST_BACKED",
    SoundRequirement: SoundArtistSelect,
  },
  {
    label: "Be a top 10 collector of artist",
    value: "SOUND_TOP_COLLECTOR",
    SoundRequirement: SoundArtistSelect,
  },
  {
    label: "Own at least x songs",
    value: "SOUND_NFTS",
    SoundRequirement: SoundMinAmount,
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
            onChange(newValue?.value ?? null)
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
