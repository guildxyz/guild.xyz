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
import SoundArtistSelect from "./components/SoundArtistSelect"
import SoundMinAmount from "./components/SoundMinAmount"
import SoundOwnASong from "./components/SoundOwnASong"
import SoundTopCollector from "./components/SoundTopCollector"

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
    label: "Be a top x collector of artist",
    value: "SOUND_TOP_COLLECTOR",
    SoundRequirement: SoundTopCollector,
  },
  {
    label: "Own at least x songs",
    value: "SOUND_NFTS",
    SoundRequirement: SoundMinAmount,
  },
]

const SoundForm = ({ baseFieldPath, field }: RequirementFormProps) => {
  const { resetField } = useFormContext()

  const { errors } = useFormState()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const selected = soundRequirementTypes.find((reqType) => reqType.value === type)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledCombobox
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={soundRequirementTypes}
          beforeOnChange={() =>
            resetField(`${baseFieldPath}.data.id`, { defaultValue: "" })
          }
          disableOptionFiltering
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
